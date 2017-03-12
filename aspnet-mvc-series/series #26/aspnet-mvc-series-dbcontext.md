asp.net mvc solution's architecture

### Previous post

Trước khi đi vào kiến trúc của project, mình sẽ nói thêm đôi chút về database.

#### DbContext

1 thủ thuật nhỏ giúp bạn tiết kiệm thời gian là sử dụng directive của .net để nhanh chóng "switch" connection string giữa môi trường dev và product.

![switch connection string](db-context-connection-string.png)

Với connection string được config trong `.config`

![connection string config](connection-string-config.png)

Khi sử dụng build ở mode `RELEASE`, directive `#elif !DEBUG` sẽ được sử dụng, và connection string được chỉ định là `ProductConnection`

Mình cũng đã cập nhật entity để thể hiện mối quan hệ. Ở đây mình không sử dụng [lazy loading](http://www.entityframeworktutorial.net/EntityFramework4.3/lazy-loading-with-dbcontext.aspx) mà dùng [eager loading](http://www.entityframeworktutorial.net/EntityFramework4.3/eager-loading-with-dbcontext.aspx). Mình cũng đã có 1 bài viết để giải thích về 2 khái niệm này, bạn có thể xem tại [đây](https://phantienquang.blogspot.com/2017/02/entity-framework-navigation-property-eager-loading-lazy-loading.html).

Thể hiện mối quan hệ bằng navigation property:

![entity-related](entity-related.png)

Một số entity mình để trống, sẽ cập nhật sau này. Và mình sẽ nói tới cách giải quyết vấn đề khi có sự thay đổi entity.

### Kiến trúc Project

> Trước khi đi vào chi tiết, mình xin nói rõ những kiến thức trong bài viết hoàn toàn thuộc về **kinh nghiệm bản thân**, được đúc kết trong quá trình làm việc, tìm hiểu và cày cuốc. Do đó đây không phải là 1 tiêu chuẩn, và tất nhiên không tránh khỏi thiếu sót. Mình rất hoan nghênh nhận xét đánh giá của mọi người để cùng nhau hoàn thiện.

Mục tiêu của những bài viết của mình là dành cho những người ..chưa biết, đọc vào cũng hiểu. Để làm được điều đó, bạn đừng cố gắng hiểu những gì chưa cần hiểu :). Cụ thể ở đây là về mặt kỹ thuật. Hãy nắm bắt "**tư tưởng**" trước, sau khi đả thông tư tưởng, bạn hoàn toàn có thể tự implement theo cách của bản thân, hoặc, follow theo hướng dẫn.

Ok, vậy mình sẽ nói về tư tưởng:

~~Mình đang có vốn và mình có nhu cầu bán điện thoại di động online, do đó mình cần 1 web app có thể show hàng, bán hàng và thanh toán cùng các chức năng lẻ tẻ khác:~~

![mvc architecture app](build-app-1.png)

~~Thằng bạn của mình là dev, nó biết được nhu cầu của mình nên mới nói: "ei mài, tao có thể cung cấp cho mày các API để show hàng và mua/bán hàng đó, team của tao luôn cập nhật công nghệ mới nhất nên mày an tâm về các khoản bla bla.. đi". Mình nghĩ: "Oh! ngon, quất thôi, ngại gì vết bẩn":~~

![mvc architecture business](build-app-2.png)

~~Vậy là team mình làm việc với team business (bus) của thằng bạn để tích hợp 2 hệ thống với nhau. Bên mình chỉ cần làm xong giao diện (UI), bên nó sẽ lo phần bus logic.~~

~~Lại nói về thằng bạn mình, nó có 1 team toàn super-dev nên cũng kiếm được kha khá khách hàng. Có lần nó kể khách hàng của nó người muốn dùng sql server, người muốn dùng mongodb, lại có khách sộp muốn dùng oracle...Mình mới thắc mắc là nếu có 1 chút business thay đổi chắc team nó phải làm việc cật lực lắm mới đảm bảo được sự nhất quán giữa các data source. Nó mới cười: "Đơn giản lắm mày à, tao dùng [repository](https://msdn.microsoft.com/en-us/library/ff649690.aspx) nên ~~adapt~~ rất nhanh với các thay đổi".~~

![mvc architecture repository](build-app-3.png)

~~Á à, thì ra nó tổ chức mô hình theo kiểu này...(bế tắc để viết)~~

~~...todo~~

![aspnet mvc data transfer](data-transfer.png)

~~Từ mô hình trên có thể thấy..(bế tắc để viết luôn)~~

Ok, vậy là bỏ qua phần tư tưởng :v. Dev mà văn vẻ dài dòng quá cũng khó chịu :))

Nói nhanh cho vuông thì đây được xem là kiến trúc 3 tiers (storage và repo được xem là 1 tier).

### AutoMapper và Domain entities

Có thể thấy ngay, tầng app chỉ quan tâm tới business, không quan tâm tới việc data lưu trữ như thế nào. Vậy nên cái được luân chuyển qua lại giữa các tầng là 1 object dùng để transfer data, mà mình gọi là domain object (hoặc Data Transfer Object - DTO). Như vậy ở application và business bạn không cần phải cài đặt các library như entity framework hoặc driver kết nối data nữa.

Xem bài viết của mình tại [đây](http://phantienquang.com/2016/9/23/su-dung-automapper-trong-aspnet-mvc) để biết về AutoMapper, hoặc xem full document tại [đây](https://github.com/AutoMapper/AutoMapper/wiki/Getting-started).

Để sử dụng kỹ thuật Dependency Injection thì bạn có thể đọc bài viết [này](http://phantienquang.com/2016/10/4/su-dung-autofac-trong-aspnet-mvc) của mình, hoặc xem full document tại [đây](https://readthedocs.org/projects/autofac/).

Mình sẽ nói kỹ hơn về automapper và autofac trong lúc sử dụng.

Ok, giờ mình nói chi tiết vào các phần của solution:

### 1st tier: didongexpress.repos

Project này implement repository pattern (repo) và unit of work pattern (uow). repo cung cấp các phương thức CRUD cơ bản để làm việc với 1 data source, và uow đảm bảo các repo dùng chung 1 instance của db tại 1 thời điểm.

<script src="https://gist.github.com/oclockvn/e32745c249807984332e42d227c6c037.js"></script>

Bạn có thể đọc bài viết [này](https://phantienquang.blogspot.com/2015/06/aspnet-mvc-ap-dung-mau-repository-trong.html) của mình để nắm về repository pattern, hoặc đọc giải thích 1-cách-kỹ-thuật của microsoft tại [đây](https://msdn.microsoft.com/en-us/library/ff649690.aspx).

Trong implementation của mình có 1 nhược điểm là đã gán trực tiếp DbContext cho repository, điều này không thể hiện đúng sức mạnh của repo. Mình sẽ "generic" nó trong 1 bài viết khác, và hy vọng bạn cũng chia sẻ cách làm của mình :)

Sau khi có generic repo, bạn chỉ cần kế thừa nó và sử dụng:

<script src="https://gist.github.com/oclockvn/8516a50512bd92ab388ff6e7bd78c5da.js"></script>

1 điều chú ý là việc mapping giữa entity object và domain object để truyền lên business tier. Tại sao cần phải map? Như đã nói ở trên, app và bus không cần quan tâm tới việc lưu trữ ở database, do đó, ít nhất ở đây là nó không cần phải add reference tới db dll. Hơn nữa, mỗi khi có sự thay đổi ở db (hoặc bus), mình chỉ cần đổi phương thức map là xong. (Xem code hoặc link trên để biết cách setup map).

Về UoW, chỉ gồm 2 phương thức, được implement như sau:

<script src="https://gist.github.com/oclockvn/1f63000fe9cbd581d2313c1cc361a5d9.js"></script>

Đây là nơi mà instance của DbContext được sinh ra, và truyền vào constructor của các repositories => đảm bảo được tất cả các repo đều dùng chung 1 instance của db context. Ở đây mình sử dụng kiểu `Lazy` để tránh việc khởi tạo các repo khi chưa thực sự sử dụng.

Một lần nữa ở đây đã gán trực tiếp DbContext vào UoW, và nó không thể hiện được sức mạnh "switch" data source, tuy nhiên điều này không đáng nói ở series này.

Phương thức `Get<>` dùng để lấy 1 repo đã được "đăng ký", điều này cũng có thể đạt được bằng cách khai báo các "read-only" properties trên interface UnitOfWork.

Toàn bộ project didongexpress.repo có thể tóm gọn trong class diagram sau:

![repo diagram](repo-class-diagram.png)

### 2nd tier: didongexpress.bus

Tầng này vô cùng đơn giản, nó quy định các business (công việc, method, function - tùy cách gọi của bạn) cho ứng dụng, và gọi xuống repository để lấy data và trả data về cho app:

<script src="https://gist.github.com/oclockvn/836ddb7da6dd0ae45c4fbd2a42cda2e3.js"></script>

có 2 điều cần chú ý trong `ProductBusiness`:

1. Kế thừa từ base `Business`: điều này là optional, nhưng nếu có thì nó sẽ giúp bạn dễ dàng thêm các "bước" cho 1 business process: Validate -> PreProcess -> Process -> PostProcess...

2. Dependency Injection: `IUnitOfWork` được "inject" vào `ProductBusiness`, điều này dễ dàng đạt được bằng cách sử dụng autofac, và điều cần thiết là config cho nó (clone source về xem cho đã mắt, F12 các kiểu để thấy mối liên hệ):

<script src="https://gist.github.com/oclockvn/0d6a68e129f45a920d4727959a1a3868.js"></script>

didongexpress.bus diagram:

![bus diagram](bus-class-diagram.png)

### 3th tier: didongexpress

Đây là cái web app của bạn, công việc bây giờ đơn giản lắm, bạn chỉ cần gọi tới thằng business, thi thoảng validate input hoặc xử lý file...

<script src="https://gist.github.com/oclockvn/75ceff5c9f4401fa81b84ac37fac3913.js"></script>

Ở đây cũng inject business vào constructor của controller, rồi cứ thế mà gọi phương thức cần ra thôi.

Tất nhiên là bạn cũng phải setup mapper và ioc các kiểu, thằng mà để làm cái này chả còn ai khác ngoài `Application_Start`:

<script src="https://gist.github.com/oclockvn/29a49ce18384bdd32697ac29419edd85.js"></script>

### Ok, Recap

Có 1 câu nói rất hay, mà mình chả nhớ là của cha nào (mình đọc quote rất ít khi nhớ tên tác giả :v, còn nữa, đại ý là thế thôi, mình cũng chả nhớ nguyên văn đâu :)))

> Nếu bạn muốn làm 1 cái gì đó to, đừng làm cái to. Hãy làm những cái nhỏ và gộp nó lại.

Câu nói trên rất đúng khi bạn phát triển ứng dụng. 1 khi ứng dụng của bạn đạt độ lớn vừa đủ, việc làm theo 1 mô hình chia nhỏ giúp bạn tiết kiệm rất nhiều thời gian + công sức cho việc maintain, upgrade, fix bug, testing...vì bạn thấy đấy, việc gì ra việc đó rồi, làm gì cũng biết làm ở đâu rồi.

Bạn nghĩ, ôi! việc gì phải làm phức tạp vấn đề lên như vậy, cứ gom 1 cục vào 1 project mà chiến, project này nhỏ mà. :)) Thi thoảng mình làm biếng cũng chẳng chia chác làm gì đâu (nếu cái là nhỏ, "thực sự nhỏ"). Việc làm theo mô hình giúp bạn giải quyết các vấn đề khi 1 project đạt độ lớn (độ lớn ở đây là độ phức tạp, nhiều file, nhiều dll, ...) nhất định, cho nên không phải lúc nào áp dụng vào tất cả cũng tốt.

Và cuối cùng, đây là 1 bài viết trong asp.net mvc series của mình, series này mình hướng tới những ai chưa biết, hoặc chưa nắm rõ asp.net mvc. Và dễ hiểu nếu bạn thấy bài này khó hiểu. Khi đó bạn có 3 cách: hoặc là clone code về, F5, F10, F11, F12 để xem luồng đi của sự kiện; hoặc, bỏ qua bài này, vì nó chả liên quan gì tới mvc cả; hoặc, cách cuối cùng là bỏ luôn series này, thằng này viết như củ kẹc ấy :v, đã viết chậm lại viết khó hiểu :)))

Luôn sẵn lòng đón nhận ý kiến đóng góp từ ae hoặc thắc mắc thầm kín của ae :)

Code luôn được up-to-date tại repo [didongexpress](https://github.com/oclockvn/didongexpress), video fullhd không che cũng up-to-date tại [playlist](https://www.youtube.com/watch?v=H_xOqySA7OQ&index=25&list=PLGQv5Xhv0tdq4kNQFqzrA4Z3twSAkrymP).