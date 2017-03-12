(function (document, $) {

    $(document).on('click', '.toggle-menu', function (e) {
        e.preventDefault();

        var menu = $('.menu');

        menu.slideToggle(500, function () {
            menu.css({
                display: ''
            }); // remove display none
            menu.toggleClass('show-menu'); // force display block in css
        });
    });

})(document, jQuery);