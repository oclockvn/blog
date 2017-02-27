Entity Framework Navigation Property. Lazy loading và Eager loading (load trì hoãn và load đồng thời)

Biết được cơ chế hoạt động của 2 cái này có thể giúp bạn gia tăng performance cho Entity Framework (EF) rất nhiều trong các dự án của mình.

Trong phạm vi bài viết mình sử dụng EF code-first. Các cách còn lại hoàn toàn tương tự nhé.

### Entity

Xét 1 database context có 2 entity sau:

<script src="https://gist.github.com/oclockvn/730964da767b7be0a164cd0023ecbc2e.js"></script>

Ok, đơn giản phải không!

### Navigation Property

Khóa ngoại là cái biểu thị cho mối quan hệ trong CSDL quan hệ. Đơn giản thôi, 1 category sẽ có nhiều product - 1 product thuộc 1 category (để cho vấn đề đơn giản thôi nhé, bạn muốn product thuộc nhiều category cũng chả sao). Quan hệ 1 - * (1 - nhiều) là cái rất phổ biến.

Trong EF, cái đại diện cho mối quan hệ là Navigation Property. Nó được biểu diễn bằng cách thêm các properties như sau:

<script src="https://gist.github.com/oclockvn/9b66de54a560c4cd203aba1c188f33c8.js"></script>

ở `Product` mình thêm 2 property, bạn cũng có thể hình dung ngay là product sẽ có `CategoryId` là khóa ngoại (foreign key = FK), và `Category` là Navigation Property.

> Để đơn giản, bạn hãy đặt tên theo quy ước `<Table> + Id`, với `<Table>` là tên class tham chiếu tới. Bạn cũng có thể đặt tên tùy thích bằng cách sử dụng kết hợp với attribute `[ForeignKey]`

Tương tự ở class `Category` mình thêm 1 collection các product. Đây là danh sách các product thuộc category này.

Cách khai báo Navigation Property cũng rất quan trọng, nó quyết định bạn có sử dụng được chức năng lazy loading hay không (*).

### DbContext

Xem snippet:

<script src="https://gist.github.com/oclockvn/b50aae17885ad1d6ecc7f9e238e1f8fd.js"></script>

> Nhớ thêm 1 connection string có `name="connection"` vào config nhé.

Mình thêm dữ liệu để test vào DbContext như sau:

<script src="https://gist.github.com/oclockvn/70f706b2e27adffffd1a353ca1fd8ccb.js"></script>

Chú ý:

1. Mình không set `CategoryId` cho product khi thêm mới. Và để làm được điều này, hãy quay lại entity mà xem, `CategoryId` được khai báo là `nullable`.

2. Dòng 11, thực hiện save để product được thêm vào db, từ đó sinh ra id (vì id là kiểu tự động tăng - đây là quy ước của EF, nếu bạn đặt property là Id hoặc EntityId và có kiểu là int thì nó sẽ là khóa chính tự động tăng).

3. Dòng 13, thêm 2 product này vào category và save. Điều này cũng đồng thời set khóa ngoại của 2 product (`CategoryId`) là category hiện tại.

### Eager Loading

Đừng cố gắng dịch từ này ra tiếng Việt, tuy nhiên nếu bạn muốn thì mình có thể tạm dịch Eager Loading là load (tải) **đồng thời**. Tại sao lại là đồng thời, hãy xem giải thích.

![load product](load-product.png)

đặt breakpoint tại dòng 68 và lấy danh sách product từ db. Hãy chú ý tới Navigation Property `Category` hiện tại đang là null dù cho `CategoryId == 2`;

Để sử dụng eager loading, bạn dùng với phương thức `Include` như ở dòng tiếp theo. `F10`.

![eager loading product](eager-loading-product.png)

Để biết chuyện gì xảy ra thì bạn ghi log ra

<script src="https://gist.github.com/oclockvn/9b48204e96c96d50da5c5cd7c87edc37.js"></script>

Và xem log:

<script src="https://gist.github.com/oclockvn/e635b0088841aea8270959970b4f8792.js"></script>

Chỉ là 1 câu select bình thường.

Chạy tới câu `Include()`:

<script src="https://gist.github.com/oclockvn/6816ef6d6e4abd5bb9bb54c9715b34b3.js"></script>

Yes, join 2 table dựa trên khóa ngoại là `CategoryId`.

Đây là lý do mình gọi eager loading là load đồng thời. Các entity **liên quan** sẽ (được) load đồng thời với entity được query nếu sử dụng `Include()` - và quan trọng nhất là **chỉ load 1 lần duy nhất**.

### Lazy Loading

Như ở (*) đã nói, cách bạn khai báo property quyết định xem bạn có sử dụng được chức năng lazy loading hay không. Nếu muốn, hãy quay lại entity và sửa như sau:

<script src="https://gist.github.com/oclockvn/407619297d31b95415e834a23d8d3cc6.js"></script>

Không có gì thay đổi ngoại trừ việc mình thêm keyword `virtual` vào 2 Navigation Property. Điều này sẽ giúp bạn sử dụng lazy loading vốn đã được default enable trong EF.

Giải thích trước nhé: lazy loading ngược lại với eager loading, related data chỉ được load khi nó được gọi ở lần đầu tiên (first get) sử dụng. Nghĩa là gì:

![loading category](load-category.png)

Con trỏ đang ở dòng 88, và đã có 1 truy vấn được thực hiện là select tất cả các category. Ở dòng **90** mình gọi tới `Products`, và đây là lúc lazy loading được **"activate"**, tất cả các products thuộc category này sẽ được load lên:

![lazy loading](lazy-loading.png)

Yes, 1 query `where CategoryId = @EntityKeyValue1`, với `@EntityKeyValue1` là id của category hiện tại.

Giả sử có 10 categories thì sẽ có 11 lần gọi xuống db, khá tốn '**HP**' phải không :)

Chú ý là với eager loading, `Products` sẽ không được load do đó dòng 90 sẽ bị `NullReferenceException`.

Bạn thấy đấy, lazy loading không load data nếu không sử dụng (tốt ở chỗ này), nhưng 1 khi đã sử dụng thì nó gọi xuống số lần tương ứng với số lượng entity có trong collection (không tốt ở chỗ này).

### Khi nào nên áp dụng

1 điều dễ thấy nhất là không nên dùng lazy loading cho Collection Property vì nó sẽ gọi nhiều lần. Ngược lại với Navigation Property là 1 class thông thường, sử dụng lazy loading sẽ tiết kiệm công sức cho bạn hơn.

Tuy nhiên, ai biết được, mình thích thì mình gọi thôi :))

### Explicit Loading

Nó cũng chả khác gì 2 cái trên mà cách viết rườm rà, nếu muốn biết thì bạn có thể tham khảo link [này](https://docs.microsoft.com/en-us/ef/core/querying/related-data).