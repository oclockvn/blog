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