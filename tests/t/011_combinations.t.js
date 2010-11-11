
test(
    "Combination test",
    function() {

        var plugin_output;
        $.fn.testing = function (one, two) {
            $(this).dblclick(function () { plugin_output = one + two })
        };

        (function () {
            var output;
            var $tmpl = $('<div>Hello <a href="#">Somewhere</a></div>');
            $tmpl.process_template({
                'a' : new Chicken.Param.Combinator([
                    "World",
                    new Chicken.Param.Attributes ({
                        'href'   : 'http://www.world.com',
                        'target' : '_blank',
                        'class'  : 'testing'
                    }),
                    new Chicken.Param.EventHandlers ({
                        'click' : function () { output = "gotcha" }
                    }),
                    function (e) { e.testing(2, 2) }
                ])
            });
            ok(
                $tmpl.html()
                    ==
                'Hello <a href="http://www.world.com" target="_blank" class="testing">World</a>',
                '... got the right HTML output'
            );

            $tmpl.find('a').click();
            ok(output == "gotcha", '... the event handler was bound and ran');

            $tmpl.find('a').dblclick();
            ok(plugin_output == 4, '... the plugin handler was bound and ran');
        })();

        (function () {
            var output;
            var $tmpl = $('<div>Hello <a href="#">Somewhere</a></div>');
            $tmpl.process_template({
                'a' : [
                    "World",
                    new Chicken.Param.Attributes ({
                        'href'   : 'http://www.world.com',
                        'target' : '_blank',
                        'class'  : 'testing'
                    }),
                    new Chicken.Param.EventHandlers ({
                        'click' : function () { output = "gotcha" }
                    }),
                    function (e) { e.testing(2, 2) }
                ]
            });
            ok(
                $tmpl.html()
                    ==
                'Hello <a href="http://www.world.com" target="_blank" class="testing">World</a>',
                '... got the right HTML output'
            );

            $tmpl.find('a').click();
            ok(output == "gotcha", '... the event handler was bound and ran');

            $tmpl.find('a').dblclick();
            ok(plugin_output == 4, '... the plugin handler was bound and ran');
        })();

    }
);
