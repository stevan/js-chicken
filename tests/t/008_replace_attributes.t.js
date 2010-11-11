
test(
    "Attribute Replacement test",
    function() {

        test_template(
            '<div>Hello <a href="#">World</a></div>',
            {
                'a' : new Chicken.Param.Attributes ({ href : 'http://www.world.com' })
            },
            'Hello <a href="http://www.world.com">World</a>',
            '... simple hello world with callback'
        );


        var $tmpl = $('<div>Hello <a href="#">World</a></div>');
        $tmpl.process_template({
            'a' : new Chicken.Param.Attributes ({
                'href'   : 'http://www.world.com',
                'target' : '_blank',
                'class'  : 'testing'
            })
        });

        ok($tmpl.find('a').attr('href') == 'http://www.world.com', '.. got the right HREF');
        ok($tmpl.find('a').attr('target') == '_blank', '.. got the right TARGET');
        ok($tmpl.find('a').attr('class') == 'testing', '.. got the right CLASS');

    }
);
