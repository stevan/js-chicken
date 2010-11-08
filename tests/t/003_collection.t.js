test(
    "Collection test",
    function() {

        test_template(
            '<div><table><tr><td></td></tr></table></div>',
            {
                'table' : new Chicken.Collection({
                    'row_selector' : 'tr',
                    'values'       : [
                        { 'td' : 1 },
                        { 'td' : 2 },
                        { 'td' : 3 },
                        { 'td' : 4 }
                    ]
                })
            },
            '<table><tbody><tr><td>1</td></tr><tr><td>2</td></tr><tr><td>3</td></tr><tr><td>4</td></tr></tbody></table>',
            '... simple collection'
        );

        test_template(
            '<div><div id="data"><div class="row"><span class="x" /></div></div></div>',
            {
                '#data' : new Chicken.Collection({
                    'row_selector' : '.row',
                    'values'       : [ 1, 2, 3, 4 ],
                    'transformer'  : function (x) {
                        return { '.x' : x }
                    }
                })
            },
            '<div id="data"><div class="row"><span class="x">1</span></div><div class="row"><span class="x">2</span></div><div class="row"><span class="x">3</span></div><div class="row"><span class="x">4</span></div></div>',
            '... simple collection using class and id selectors'
        );

        test_template(
            '<div><div id="data"><div class="row"><span class="x" /></div></div></div>',
            {
                '#data' : new Chicken.Collection({
                    'row_selector' : '.row',
                    'values'       : [ 1, 2, 3, 4 ],
                    'transformer'  : function (x) {
                        return {
                            '.x' : new Chicken.Thunk(function () { return x * x })
                        }
                    }
                })
            },
            '<div id="data"><div class="row"><span class="x">1</span></div><div class="row"><span class="x">4</span></div><div class="row"><span class="x">9</span></div><div class="row"><span class="x">16</span></div></div>',
            '... simple collection using class and id selectors'
        );

        test_template(
            '<div><div id="data"><div class="row"><span class="x" /><img /></div></div></div>',
            {
                '#data' : new Chicken.Collection({
                    'row_selector' : '.row',
                    'values'       : [ 1, 2, 3, 4 ],
                    'transformer'  : function (x) {
                        return {
                            '.x'  : new Chicken.Thunk(function () { return x * x }),
                            'img' : function (tmpl, selector) {
                                tmpl.find(selector).attr({ src : 'test.gif' })
                            }
                        }
                    }
                })
            },
            '<div id="data"><div class="row"><span class="x">1</span><img src="test.gif"></div><div class="row"><span class="x">4</span><img src="test.gif"></div><div class="row"><span class="x">9</span><img src="test.gif"></div><div class="row"><span class="x">16</span><img src="test.gif"></div></div>',
            '... simple collection using class and id selectors'
        );

        test_template(
            '<div><select><option/></select></div>',
            {
                'select' : new Chicken.Collection({
                    'row_selector' : 'option',
                    'values'       : [
                        { '.' : 1 },
                        { '.' : 2 },
                        { '.' : 3 },
                        { '.' : 4 }
                    ]
                })
            },
            '<select><option>1</option><option>2</option><option>3</option><option>4</option></select>',
            '... simple collection'
        );

    }
);
