
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
            ok($tmpl.find('a').attr('href') == 'http://www.world.com', '.. got the right HREF');
            ok($tmpl.find('a').attr('target') == '_blank', '.. got the right TARGET');
            ok($tmpl.find('a').attr('class') == 'testing', '.. got the right CLASS');

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
            ok($tmpl.find('a').attr('href') == 'http://www.world.com', '.. got the right HREF');
            ok($tmpl.find('a').attr('target') == '_blank', '.. got the right TARGET');
            ok($tmpl.find('a').attr('class') == 'testing', '.. got the right CLASS');

            $tmpl.find('a').click();
            ok(output == "gotcha", '... the event handler was bound and ran');

            $tmpl.find('a').dblclick();
            ok(plugin_output == 4, '... the plugin handler was bound and ran');
        })();

    }
);
