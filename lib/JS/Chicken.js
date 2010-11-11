/******************************************************************************

                     ,--,                          ,--.                   ,--.
    ,----..        ,--.'|   ,---,  ,----..     ,--/  /|    ,---,.       ,--.'|
   /   /   \    ,--,  | :,`--.' | /   /   \ ,---,': / '  ,'  .' |   ,--,:  : |
  |   :     :,---.'|  : '|   :  :|   :     ::   : '/ / ,---.'   |,`--.'`|  ' :
  .   |  ;. /|   | : _' |:   |  '.   |  ;. /|   '   ,  |   |   .'|   :  :  | |
  .   ; /--` :   : |.'  ||   :  |.   ; /--` '   |  /   :   :  |-,:   |   \ | :
  ;   | ;    |   ' '  ; :'   '  ;;   | ;    |   ;  ;   :   |  ;/||   : '  '; |
  |   : |    '   |  .'. ||   |  ||   : |    :   '   \  |   :   .''   ' ;.    ;
  .   | '___ |   | :  | ''   :  ;.   | '___ |   |    ' |   |  |-,|   | | \   |
  '   ; : .'|'   : |  : ;|   |  ''   ; : .'|'   : |.  \'   :  ;/|'   : |  ; .'
  '   | '/  :|   | '  ,/ '   :  |'   | '/  :|   | '_\.'|   |    \|   | '`--'
  |   :    / ;   : ;--'  ;   |.' |   :    / '   : |    |   :   .''   : |
   \   \ .'  |   ,/      '---'    \   \ .'  ;   |,'    |   | ,'  ;   |.'
    `---`    '---'                 `---`    '---'      `----'    '---'

                           ,~.
                         ,-'__ `-,
                        {,-'  `. }              ,')
                       ,( a )   `-.__         ,',')~,
                      <=.) (         `-.__,==' ' ' '}
                        (   )                      /)
                         `-'\   ,                    )
                             |  \        `~.        /
                             \   `._        \      /
                              \     `._____,'    ,'
                               `-.             ,'
                                  `-._     _,-'
                                      77jj'
                                     //_||
                                  __//--'/`
                                ,--'/`  '

******************************************************************************/

/***************************** JQuery Plugin *********************************/

jQuery.fn.extend({
    process_template : function (params) {
        var tmpl = this;
        jQuery.each(
            params,
            function (selector, param) {
                var p;
                switch (typeof param) {
                    case 'function':
                        p = new Chicken.Callback (param);
                        break;
                    case 'object':
                        p = (param instanceof Chicken)
                            // if it isa Chicken object,
                            // pass it on through, we know
                            // how to handle it
                            ? param
                            // otherwise ...
                            : (param instanceof Array)
                                // arrays will be wrapped with Combinator
                                ? new Chicken.Param.Combinator (param)
                                // and all else will be wrapped with Param
                                : new Chicken.Param (param);
                                // this allows us to handle Param.Attributes
                                // and Param.EventHandlers later on
                        break;
                    default:
                        p = new Chicken.Param (param);
                }
                p.render(tmpl, selector);
            }
        );
        return tmpl;
    }
});

/*************************** Templating Objects ******************************/

function Chicken () {}

Chicken.VERSION   = '0.03';
Chicken.AUTHORITY = 'cpan:STEVAN';

Chicken.set_error_handler = function (f) { this.prototype.handle_error = f }
Chicken.prototype.handle_error = function (e) {
    throw new Error (e);
}

// ------------------------------------------------------------------
// Chicken.Param
// ------------------------------------------------------------------
// this is the base class for all, it has the simple
// 'find_and_replace' method to replace a value and it
// has the 'render' method which delegates to the
// 'find_and_replace' method.
// The API should be thought of as simply 'render'.
// ------------------------------------------------------------------

Chicken.Param = function (value) {
    this.value = value
}
Chicken.Param.prototype = new Chicken ();
Chicken.Param.prototype.find = function (tmpl, selector) {
    var selection = selector == '.' ? tmpl : tmpl.find(selector);
    if (!selection.length) {
        this.handle_error("Could not find selector '" + selector + "' in " + tmpl.html());
    }
    return selection;
}
Chicken.Param.prototype.apply = function (e, value) {
    switch (value.constructor) {
        case Chicken.Param.Attributes:
            e.attr(value.attrs);
            break;
        case Chicken.Param.EventHandlers:
            for (var event in value.events) {
                e.bind( event, value.events[ event ] );
            }
            break;
        case Function:
            // this is kind of the catchall - SL
            value(e);
            break;
        default:
            e.html(value);
    }
}
Chicken.Param.prototype.find_and_replace = function (tmpl, selector, value) {
    var self = this;
    this.find(tmpl, selector).each(function () {
        self.apply( jQuery(this), value )
    });
}

Chicken.Param.prototype.render = function (tmpl, selector) {
    this.find_and_replace(tmpl, selector, this.value);
}

// ------------------------------------------------------------------
// Chicken.Param.Combinator
// ------------------------------------------------------------------

Chicken.Param.Combinator = function (params) {
    this.params = params;
}
Chicken.Param.Combinator.prototype = new Chicken.Param ();
Chicken.Param.Combinator.prototype.find_and_replace = function (tmpl, selector, params) {
    var self = this;
    this.find(tmpl, selector).each(function () {
        var $e = jQuery(this);
        jQuery.map(
            params,
            function (x) { self.apply( $e, x ) }
        );
    });
}

Chicken.Param.Combinator.prototype.render = function (tmpl, selector) {
    this.find_and_replace(tmpl, selector, this.params);
}

// ------------------------------------------------------------------
// Chicken.Param.Attributes
// ------------------------------------------------------------------

Chicken.Param.Attributes = function (attrs) {
    this.attrs = attrs;
}

// ------------------------------------------------------------------
// Chicken.Param.EventHandlers
// ------------------------------------------------------------------

Chicken.Param.EventHandlers = function (events) {
    this.events = events;
}

// ------------------------------------------------------------------
// Chicken.Callback
// ------------------------------------------------------------------
// A Callback object is simply a Chicken.Param object in which
// 'render' calls it's own callback function instead of the
// 'find_and_replace' method from Chicken.Param
// ------------------------------------------------------------------

Chicken.Callback = function (func) {
    this.func = func;
}
Chicken.Callback.prototype        = new Chicken.Param ();
Chicken.Callback.prototype.render = function (tmpl, selector) {
    this.func(tmpl, selector);
}

// ------------------------------------------------------------------
// Chicken.Thunk
// ------------------------------------------------------------------
// A Thunk object looks similar to a Callback object, but it is
// different in that the function passed in is used to produce
// the value that is replaced with 'find_and_replace'
// ------------------------------------------------------------------

Chicken.Thunk = function (func) {
    this.func = func;
}
Chicken.Thunk.prototype        = new Chicken.Param ();
Chicken.Thunk.prototype.render = function (tmpl, selector) {
    this.find_and_replace(
        tmpl,
        selector,
        this.func()
    );
}

// ------------------------------------------------------------------
// Chicken.MethodThunk
// ------------------------------------------------------------------
// This is just a wrapper around Thunk that takes an invocant and
// a method name and creates a Thunk function for you that calls
// that method on the invocant
// ------------------------------------------------------------------

Chicken.MethodThunk = function (invocant, method_name) {
    this.func = function () { return invocant[method_name]() }
}
Chicken.MethodThunk.prototype = new Chicken.Thunk ();

// ------------------------------------------------------------------
// Chicken.PropertyThunk
// ------------------------------------------------------------------
// This is just a wrapper around Thunk that takes an invocant and
// a property name and creates a Thunk function for you that just
// reads the property from the invocant for you
// ------------------------------------------------------------------

Chicken.PropertyThunk = function (invocant, property_name) {
    this.func = function () { return invocant[property_name] }
}
Chicken.PropertyThunk.prototype = new Chicken.Thunk ();

// ------------------------------------------------------------------
// Chicken.Collection
// ------------------------------------------------------------------
// This is one of the more complex objects, it takes a number of
// parameters:
// - row_selector
// This is the CSS selector that defines the rows we are iterating
// over. The row selector must be defined inside the template or
// an error will be raised.
// - values
// These are an array of values we are iterating over
// - transformer
// This is an optional function which is applied to ever element
// of the values list, it should return something which can be
// passed into 'process_template' (which is a lot of things).
// ------------------------------------------------------------------
// It should also be noted that collections do not need to be
// built all at once, they can be built incrementally by using
// the 'append_values' and 'prepend_values' methods
// ------------------------------------------------------------------

Chicken.Collection = function (params) {
    this.row_selector = params['row_selector'];
    this.values       = params['values'] || [];
    this.transformer  = params['transformer'];
    // cache the DOM elements
    // needed to append to the
    // collection - SL
    this.row_element    = null;
    this.target_element = null;
}
Chicken.Collection.prototype            = new Chicken.Param ();
Chicken.Collection.prototype.get_values = function () {
    return (this.transformer == undefined)
        ? this.values
        : jQuery.map(this.values, this.transformer)
}

Chicken.Collection.prototype.find_row = function (selection) {
    this.row_element = selection.find(this.row_selector);
    return this.row_element;
}

Chicken.Collection.prototype.find_target = function () {
    this.target_element = this.row_element.parent();
    return this.target_element;
}

Chicken.Collection.prototype.initialize = function (tmpl, selector) {
    var selection = this.find(tmpl, selector);
    var row = this.find_row(selection);
    if (!row.length) {
        this.handle_error("Could not find row selector " + this.row_selector);
    }
    var target = this.find_target();
    target.empty();
}

Chicken.Collection.prototype._add_values = function (values, callback) {
    var t = this.target_element;
    if (!t.length) {
        this.handle_error("No target element cached");
    }
    var r = this.row_element;
    if (!r.length) {
        this.handle_error("No row element cached");
    }
    jQuery.each(values, function () { callback(t, r, this) });
}

Chicken.Collection.prototype.render = function (tmpl, selector) {
    this.initialize(tmpl, selector);
    this._add_values(
        this.get_values(),
        function (t, r, v) { t.append(r.clone(true).process_template(v)) }
    );
}

Chicken.Collection.prototype.append_values = function (values) {
    this._add_values(
        values,
        function (t, r, v) { t.append(r.clone(true).process_template(v)) }
    );
}

Chicken.Collection.prototype.prepend_values = function (values) {
    this._add_values(
        values,
        function (t, r, v) { t.prepend(r.clone(true).process_template(v)) }
    );
}

// ------------------------------------------------------------------
// Chicken.Hierarchy
// ------------------------------------------------------------------
// I will be honest, I don't even use this one, it is too complex.
// Look in the tests for a good example.
// ------------------------------------------------------------------

Chicken.Hierarchy = function (params) {
    this.list_selector = params['list_selector'];
    this.item_selector = params['item_selector'];
    this.values        = params['values'];
    this.transformer   = params['transformer'];
}
Chicken.Hierarchy.prototype            = new Chicken.Param ();
Chicken.Hierarchy.prototype.get_values = function () { return this.values }
Chicken.Hierarchy.prototype.render     = function (tmpl, selector) {
    var selection      = this.find(tmpl, selector);
    var list_selection = selection.find(this.list_selector);
    if (!list_selection.length) {
        this.handle_error("Could not find list selector '" + this.list_selector + "'");
    }
    var item_selection = selection.find(this.item_selector);
    if (!item_selection.length) {
        this.handle_error("Could not find item selector '" + this.item_selector + "'");
    }

    selection.empty();
    list_selection.empty();

    var self     = this;
    var traverse = function (element, tree) {
        // build a node ...
        var node_element = item_selection.clone(true).process_template(
            self.transformer == undefined
                ? tree['node']
                : self.transformer(tree['node'])
        );
        element.append(node_element);
        // if the node has children then ...
        if (tree['children'] != undefined) {
            var new_element = list_selection.clone(true);
            jQuery.each(
                tree['children'],
                function () {
                    traverse(new_element, this);
                    node_element.append(new_element);
                }
            );
        }
    };

    // create the root ...
    var root_node = list_selection.clone(true);
    traverse(root_node, this.get_values());
    selection.append(root_node);
}

/******************************************************************************

EXAMPLE:

  // simple Hello world example
  $('<div>Hello <span>Nobody</span></div>').process_template({
      'span' : "World"
  });

  // slightly more complex example
  $('<div>Hello <a href="#">Nobody</a></div>').process_template({
      'a' : new Chicken.Callback(function (tmpl, selector) {
          var target = tmpl.find(selector);
          target.attr({ href : 'http://www.world.com' });
          target.html("World")
      })
  });


Stevan Little <stevan.little@iinteractive.com>

Copyright 2008-2010 Infinity Interactive, Inc.

http://www.iinteractive.com

This library is free software; you can redistribute it and/or modify
it under the same terms as Perl itself.

******************************************************************************/


