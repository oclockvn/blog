Data Validation (Input data validate: duyệt/kiểm tra dữ liệu đầu vào) có ý nghĩa quan trọng trong các ứng dụng. Việc validate data không chỉ giúp người dùng có 1 tiêu chuẩn nhập liệu 1 cách tốt hơn, mà còn giúp developer **giảm thiểu được lỗi** trong quá trình xử lý.

Validate data nên thực hiện ở cả 2 tầng là front-end và back-end, như vậy thì (giả sử) người dùng có hack/cheat để vượt quá tầng front-end (ví dụ disable javascript), thì vẫn còn 1 chốt chặn ở server nữa.

Trong bài này, mình sẽ giới thiệu một số cách sử dụng validation trong asp.net mvc, sử dụng data annotation và 1 thư viện validate rất cool do 1 dev của Việt Nam tạo ra, đó là bootstrap validator.

> [bootstrap validator](https://github.com/nghuuphuoc/bootstrapvalidator) (bs) là tiền thân của [formvalidation](http://formvalidation.io/). Sự khác nhau là bs là 1 phiên bản miễn phí, chỉ sự dụng cho bootstrap. Phiên bản mới nhất hỗ trợ được nhiều css framework khác và tính phí. Trong bài này mình chỉ nói tới bootstrap validator.

### UI

Xây dựng 1 layout đơn giản như sau:

![form-validate](form-validate.png)

html

<script src="https://gist.github.com/oclockvn/2e1bd5d01b7bd05287c933f49f65c2a9.js"></script>

### Model

<script src="https://gist.github.com/oclockvn/f8ee6fd54bf177c1c8c5b0b41f1f770f.js"></script>

Tạm thời model sẽ đơn giản thế này thôi.

### 1. Data Annotation

Hãy cùng xem và phân tích nhé:

<script src="https://gist.github.com/oclockvn/78344a954ea87b454286f204509e38d0.js"></script>

Đầu tiên là namespace để sử dụng được các attributes:

`using System.ComponentModel.DataAnnotations;`

Với mỗi attribute sẽ có các thuộc tính (property) để validate. Ví dụ đối với `RequiredAttribute` của **Name** property:

`[Required(ErrorMessage = "{0} is required")]`

Tham số thứ 0 luôn luôn là tên của property, ở đây là **Name**. Nếu bạn muốn custom name khi hiển thị, bạn sử dụng kèm với `DisplayAttribute` bằng cách `[Display(Name = "my custom name")]`.

Quay lại với `RequiredAttribute` ở trên, khi bạn submit mà chưa nhập tên, kết quả sinh ra sẽ là:

`Product name is required`

Dễ hiểu phải không! :))

Tiếp, ví dụ như validate số lượng ký tự nhập vào với `[StringLength]`

`[StringLength(250, MinimumLength = 2, ErrorMessage = "{0} must be from {2} to {1} characters")]`

- 250: MaximumLength (default parameter) là 250 ký tự
- MinimumLength = 2: tối thiểu 2 ký tự
- ErrorMessage: lỗi khi nhập 1 ký tự hoặc vượt quá 250 ký tự. Nhìn vào đây sẽ hiểu được cách sử dụng parameters, **{0}** luôn là tên của property, **{2}** là tham số thứ 2 (min length), **{1}** là tham số đầu tiên.

Đơn giản mà, rất là gợi nhớ và đầy đủ ngữ nghĩa nên bạn không khó để sử dụng.

Tham khảo tại [đây](https://msdn.microsoft.com/en-us/library/system.componentmodel.dataannotations(v=vs.110).aspx) để xem các attribute hỗ trợ nhé.

Thêm 1 chút về cách viết annotation, bạn có thể viết tách ra như thế này:

<script src="https://gist.github.com/oclockvn/a98a4e12132d77f25fefb690482ca1a7.js"></script>

hoặc gộp lại thành 1 như thế này:

<script src="https://gist.github.com/oclockvn/82f5b6d474f4ec7542b66bb3a00195a9.js"></script>

bạn có thể viết cách nào mà bạn thấy thích nhất. (Mình thích cách tách ra, dễ nhìn và chỉnh sửa hơn)

### Sử dụng validate attribute

Quay trở lại với html 1 chút, nếu bạn chưa biết thì:

`@Html.TextBoxFor(m => m.Name, new { @class="form-control"})`

là 1 [Html helper](https://docs.microsoft.com/en-us/aspnet/mvc/overview/older-versions-1/views/creating-custom-html-helpers-cs), trong asp.net mvc (razor syntax) nó được sử dụng để sinh ra html.

Ví dụ như với helper ở trên, kết quả sinh ra sẽ là:

![html-helper-generated](html-helper-generated.png)

yes, cũng chỉ là 1 input bình thường, nhưng nó có gắn thêm `name=Name` (Name là tên của property, asp.net mvc model binder sẽ bind dựa vào name). Đây là 1 trong những lợi thế khi sử dụng html helper thay cho html tag bình thường.

À, nếu bạn chưa biết thì sự khác nhau giữa `@Html.TextBox()` và `@Html.TextBoxFor()` đó là `TextBoxFor` sinh ra html có gắn với 1 property cụ thể được binding vào Action (bạn viết ra là sẽ hiểu). For = For something, ví dụ textbox cho cái Id, textbox cho cái Name...

Không những thế, khi sử dụng kết hợp với data annotation, html sinh ra sẽ có thêm nhiều attributes khác nữa. Với những attribute mình đã thêm ở trên thì kết quả sẽ là:

![validation-rules](validation-rules.png)

Nó là các html attributes có dạng data-* (data-* là custom attribute được sử dụng trong html5). Tới đây thì bạn vẫn chưa sử dụng được các validation rules này, bạn phải thêm vào 1 helper nữa để validate, đó là:

### 2. Validation message

`@Html.ValidationMessageFor(m => m.Name)`

Thêm helper cho các property khác:

<script src="https://gist.github.com/oclockvn/72d735c0b69763a120dd06500b214927.js"></script>

### 3. Action

Bước cuối cùng, trong action bạn kiểm tra model có hợp lệ hay không bằng `ModelState`

<script src="https://gist.github.com/oclockvn/d89e9c67a78a5a83862bb6b1c80c13c7.js"></script>

Bạn có thể select danh sách lỗi bằng 1 câu linq đơn giản:

<script src="https://gist.github.com/oclockvn/c91c82be7cf13c50d0020d518e4ce32b.js"></script>

Hoặc hiển thị tất cả các lỗi ra giao diện bằng cách thêm helper:

<script src="https://gist.github.com/oclockvn/276e90667be5df27f522a500f55273b8.js"></script>

Kết quả:

![error-messages](error-messages.png)

Việc hiển thị trên hay dưới, đỏ hay đen, ngang hay dọc thì bạn hoàn toàn có thể quyết định được bằng cách thay đổi html và css cho form nhé.

Ok, validate bằng data annotation cơ bản là thế, 1 số chú ý khác khi sử dụng là:

- Nếu muốn sử dụng cho đa ngôn ngữ, bạn có thể tham khảo tại [đây](http://20fingers2brains.blogspot.com/2013/10/multi-language-error-messages-using.html).
- Nếu các build-in attribute chưa đủ làm bạn thỏa mãn, bạn có thể viết custom attribute, đơn giản thôi, xem tại [đây](http://www.c-sharpcorner.com/article/custom-data-annotation-validation-in-mvc/).

### Bootstrap validator (bs)

Link download ở phía trên nhé.

Thư viện bs được sử dụng đi kèm với bootstrap, do đó, hiển nhiên là bạn phải dùng bootstrap chứ không phải framework khác nhé.

Đầu tiên, thêm bs vào _Layout.cshtml

![insert-bootstrap-validator](insert-bootstrap-validator.png)

Setup:

1 setup cơ bản như sau:

<script src="https://gist.github.com/oclockvn/6614d260195c5539f5e651f6533d0929.js"></script>

Trong đó `icons` là các icons hiển thị tương ứng với trạng thái của control (hợp lệ/không hợp lệ..), và `fields` là các option tương ứng cho mỗi control (lấy theo tên).

Ví dụ:

`<input type="text" name="MyName" />`

thì option tương ứng sẽ là:

`fields: { MyName: {} }`

dễ hiểu phải không :).

Tiếp theo, để setup các rules cho 1 control, sử dụng `validators`:

<script src="https://gist.github.com/oclockvn/891bb92cb0521f3fc5fa1dd77cdd3fae.js"></script>

Với rules như vậy, ví dụ bạn submit mà không nhập Name, thì rules **notEmpty** sẽ bị violate, và **message** Name is required sẽ hiển thị.

Bạn có thể download source code của bs về và xem các ví dụ demo để biết thêm các validators được sử dụng trong bs.