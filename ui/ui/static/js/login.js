$(document).ready(function () {
    $('#login_orm').validate({
        focusInvalid: false,
        ignore: "",
        rules: {txtusername: {minlength: 2, required: true}, txtpassword: {required: true,}},
        invalidHandler: function (event, validator) {
        },
        errorPlacement: function (label, element) {
            $('<span class="error"></span>').insertAfter(element).append(label)
            var parent = $(element).parent('.input-with-icon');
            parent.removeClass('success-control').addClass('error-control');
        },
        highlight: function (element) {
        },
        unhighlight: function (element) {
        },
        success: function (label, element) {
            var parent = $(element).parent('.input-with-icon');
            parent.removeClass('error-control').addClass('success-control');
        },
        submitHandler: function (form) {
            form.submit();
        }
    });
});