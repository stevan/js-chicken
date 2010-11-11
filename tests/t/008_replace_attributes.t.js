
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

        test_template(
            '<div>Hello <a href="#">World</a></div>',
            {
                'a' : new Chicken.Param.Attributes ({
                    'href'   : 'http://www.world.com',
                    'target' : '_blank',
                    'class'  : 'testing'
                })
            },
            'Hello <a href="http://www.world.com" target="_blank" class="testing">World</a>',
            '... simple hello world with callback'
        );

    }
);
