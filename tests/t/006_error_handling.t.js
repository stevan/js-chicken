test(
    "Basic test",
    function() {

        Chicken.set_error_handler(function () {})

        test_template(
            '<div><p>Boo</p></div>',
            {
                'ul > li:first'        : "One",
                'ul > li:nth-child(3)' : "Three"
            },
            '<p>Boo</p>',
            '... complex selectors'
        );

        var errors = [];
        Chicken.set_error_handler(function (e) { errors.push(e) })

        test_template(
            '<div><p>Boo</p></div>',
            {
                'ul > li:first'        : "One",
                'ul > li:nth-child(3)' : "Three"
            },
            '<p>Boo</p>',
            '... complex selectors'
        );

        ok(errors[0] == "Could not find selector 'ul > li:first' in <p>Boo</p>", '... got the error we expected');
        ok(errors[1] == "Could not find selector 'ul > li:nth-child(3)' in <p>Boo</p>", '... got the error we expected');

    }
);