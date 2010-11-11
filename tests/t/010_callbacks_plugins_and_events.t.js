
test(
    "Custom Event Handler test",
    function() {

        var output;
        $.fn.testing = function (one, two) {
            $(this).click(function () { output = one + two })
        };

        (function () {

            var $tmpl = $('<div>Hello <a href="#">World</a></div>');
            $tmpl.process_template({
                'a' : function (e) { e.testing(2, 2) }
            });
            $tmpl.find('a').click();

            ok(output == 4, '... the event handler was bound and ran');

        })();

        (function () {

            var $tmpl = $('<div>Hello <a href="#">World</a></div>');
            $tmpl.process_template({
                'a' : new Chicken.Callback(function (e) { e.testing(2, 2) })
            });
            $tmpl.find('a').click();

            ok(output == 4, '... the event handler was bound and ran');

        })();

    }
);
