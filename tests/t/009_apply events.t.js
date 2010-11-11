
test(
    "Event Handler test",
    function() {

        (function () {
            var output;
            var $tmpl = $('<div>Hello <a href="#">World</a></div>');
            $tmpl.process_template({
                'a' : new Chicken.Param.EventHandlers ({
                    'click' : function () { output = "gotcha" }
                })
            });
            $tmpl.find('a').click();

            ok(output == "gotcha", '... the event handler was bound and ran');
        })();

        (function () {
            var output = "";
            var $tmpl = $('<div>Hello <a href="#">World</a></div>');
            $tmpl.process_template({
                'a' : new Chicken.Param.EventHandlers ({
                    'mouseover' : function () { output += "over" },
                    'mouseout'  : function () { output += "out"  }
                })
            });
            $tmpl.find('a').mouseover();
            ok(output == "over", '... the event handler was bound and ran');
            $tmpl.find('a').mouseout();
            ok(output == "overout", '... the event handler was bound and ran');
            $tmpl.find('a').mouseover();
            ok(output == "overoutover", '... the event handler was bound and ran');
            $tmpl.find('a').mouseout();
            ok(output == "overoutoverout", '... the event handler was bound and ran');
        })();

        (function () {
            var output;
            $.fn.testing = function (one, two) {
                $(this).click(function () { output = one + two })
            };

            var $tmpl = $('<div>Hello <a href="#">World</a></div>');
            $tmpl.process_template({
                'a' : function (e, val) { e.testing(2, 2) }
            });
            $tmpl.find('a').click();

            ok(output == 4, '... the event handler was bound and ran');
        })();


    }
);
