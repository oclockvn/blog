Angularjs (angular 1.x) đã quay lại cuộc chơi (cùng với các jsframework hot hiện tại) với sự xuất hiện của component kể từ version ^1.5 (>= 1.5). Với component, bạn không những có thể giảm bớt "mana" viết code, mà còn gia tăng đáng kể tốc độ cho web app của mình, bởi sự ~~thay thế~~ xuất hiện của 1-way data-binding cho 2-way data-binding - điều từng làm nên sức nóng cho angularjs.

> Nội dung bài viết chỉ để cập tới angular 1.x (angularjs), do vậy mình gọi luôn là angular cho tiện để tránh nhầm lẫn với angular2 (được gọi là angular) 

Nội dung bài viết sẽ giới thiệu về component trong angular, đi kèm là cách kết hợp với Firebase Realtime Database để tạo 1 ứng dụng lưu trữ đơn giản.

Và đây sẽ là cái mà mình sẽ thực hiện:

![layout](angular-component-with-firebase-angularfire/02-layout.png)

Mình không làm ứng dụng to-dos kinh điển nữa, làm cái gì đó thú vị hơn chút đi. Liệt kê chi tiêu của bạn chẳng hạn ^^!

### Boilerplate

Template đơn giản có cấu trúc như sau:

![Boilerplate](angular-component-with-firebase-angularfire/01-boilerplate.png)

Trong đó `index.html`:

<script src="https://gist.github.com/oclockvn/3ec6e442d3c3eca0bedbbe239c8de73d.js"></script>

Và `app.modules.js` được định nghĩa:

<script src="https://gist.github.com/oclockvn/487d8b35568fd210fa61a6322b555d52.js"></script>

Ok, mọi thứ đang đơn giản..và rồi cũng không có gì phức tạp lắm đâu :v

> Chú ý là cài đặt phiên bản angular >1.5 nhé

`npm install angular@1.6.1`

### Component

Trước tiên, lướt sơ sơ về component tại [trang chủ của angular](https://docs.angularjs.org/guide/component). Angular Component là 1 dạng `directive` đặc biệt dùng để thiết kế web app theo hướng component (như ng2, react,...).

Mình không giải thích định nghĩa hay khái niệm hay bla bla gì nhé, bạn hãy đọc xong bài viết và đọc lại [document](https://docs.angularjs.org/guide/component) trên trang chủ để nắm nhé.

Tạo component đầu tiên với quy ước (optional) đặt tên theo cú pháp: `<name-of-component>.component.js`

![wallet component](angular-component-with-firebase-angularfire/03-wallet-component.png)

Và nội dung của component này:

<script src="https://gist.github.com/oclockvn/70ed0ca2fdf5ec3e65c69ef67cd5323a.js"></script>

Nó chả khác gì cách khai báo của directive ngoại trừ - bạn cũng thấy đấy - nó không truyền vào 1 function (fn) mà chỉ truyền vào 1 object, và đây là configuration object cho component, có tên là wallet.

> Chú ý là tên của component cũng được [**normalize**](https://docs.angularjs.org/guide/directive)

Và component này được sử dụng (nhớ là khai báo nó đấy nhé :v):

![using component](angular-component-with-firebase-angularfire/04-using-component.png)

### Component.Template

Bạn nên nhớ là "hầu hết" các setting có trong directive đều có trong component, quay lại document của component và xem đoạn "Comparison between Directive definition and Component definition" để thấy rõ.

![component template url](angular-component-with-firebase-angularfire/05-component-templateurl.png)

Với template chỉ là 1 đoạn html nhỏ:

![component template](angular-component-with-firebase-angularfire/06-component-template.png)

Chạy để xem kết quả...chả có gì cả ngoài cái lỗi:

![load template error](angular-component-with-firebase-angularfire/07-load-template-error.png)

:)) nhìn lại url của mình đi, file protocol đó :) Nhớ nhé, cách khắc phục đơn giản lắm, tạo 1 server là xong.

`npm i http-server --save-dev`

Mở `package.json` ra và thêm 1 key config cho `http-server`

![setup http-server](angular-component-with-firebase-angularfire/08-setup-http-server.png)

Mở cmd ngay thư mục hiện tại và gõ lệnh start: `npm start`

![start http-server](angular-component-with-firebase-angularfire/09-start-http-server.png)

Và bạn biết phải làm gì rồi đấy:

![localhost](angular-component-with-firebase-angularfire/10-localhost.png)

#### Bạn vẫn thấy mọi thứ đang đơn giản đấy chứ :))

Ok, bây giờ hãy hình dung đã nhé: mình có 1 cái wallet, trong đó chứa nhiều tiền <-> tương đương với cái component của mình sẽ có nhiều (1 list) các "thẻ" con. Vậy thì giờ mình tạo thẻ con đó trước.

### Fee Component

Tương tự như wallet component, mình tạo fee component với template và định nghĩa như sau:

**fee.component.js**

<script src="https://gist.github.com/oclockvn/a5c9e26aebdcba1d1cefba5afe9a7dd5.js"></script>

**fee.template.html** đang chứa dữ liệu tĩnh (giả)

<script src="https://gist.github.com/oclockvn/f8f4515dffd8348ab970cf96b0f9f334.js"></script>

Và 1 chút css cho đời tươi đẹp:

<script src="https://gist.github.com/oclockvn/7ad0b30f4229cd9f2dbe6ec61c563213.js"></script>