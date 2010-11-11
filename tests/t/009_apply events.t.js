
test(
    "Event Handler test",
    function() {

        var output;
        var $tmpl = $('<div>Hello <a href="#">World</a></div>');
        $tmpl.process_template({
            'a' : new Chicken.Param.EventHandlers ({
                'click' : function () {
                    console.log("am I fired?")
                    output = "gotcha"
                }
            })
        });
        $tmpl.find('a').click();

        ok(output == "gotcha", '... the event handler was bound and ran');

    }
);
