Signals
=======

> This is a fork of [Smoke
> Signals](https://bitbucket.org/bentomas/smokesignals.js/) by [Benjamin Thomas](https://bitbucket.org/bentomas)


Really, really lightweight event emitting for Node and the browser.

(though Node already has [event emitting built in][1] so I don't know why you'd
use this there. This is directly inspired by Node's and doesn't even have all of
the functionality that Node's event emitter has.)

This library has three goals:

1. Make it easy and intuitive to listen for and initiate events on an object.
2. Be as small as possible. Right now the minified version comes in at 407 bytes
   (247 bytes gzipped).
3. Not pollute the global namespace or the objects it modifies with a bunch of
   crap. I define crap as anything that is not the API.

There are many other [wonderful libraries that do similar things][2], but none
of them worked exactly how I wanted them to work or met all the goals above.

Installing
----------

In the browser, just download `smokesignals.js` or `smokesignals.unminified.js`
and put your choice in a place you can access from your webpage.

With npm:

    npm install smokesignals

Loading
-------

In the browser include the Smoke Signals script:

    <script src="smokesignals.js"></script>

With Node:

    var smokesignals = require('smokesignals');

Using
-----

Make any object an event emitter:

    var jill = {};
    smokesignals.convert(jill);

Or if you prefer constructors:

    function Person() {
        smokesignals.convert(this);
    }
    var jill = new Person();

Now you can listen for events:

    function listener(name) {
        window.alert('Hello ' + name + '!');
    }
    jill.on('say hello', listener);

And emit events:

    jill.emit('say hello', 'Jack');
    // alerts: "Hello Jack!"

And remove a listener:

    jill.off('say hello', listener);

Or if you only want to listen for an event once:

    jill.once('another event', function() {
        window.alert("I'll only be called once!");
    });
    jill.emit('another event');

Or remove all listeners for an event:

    jill.off('say hello');

Or if you want to remove ALL listeners:

    // just reconvert the object...
    smokesignals.convert(jill);

That's it! One global object (`smokesignals`) and when used it adds 4 methods to
your objects (`on`, `once`, `off` and `emit`).

By the way, all methods are chainable:

    var jill = smokesignals.convert({})
      .on('event one', function() { ... })
      .on('event two', function() { ... })
      .emit('event one')
      .once('event three', function() { ... })
      .off ('event one')
      ;

[1]: http://nodejs.org/docs/latest/api/events.html
[2]: http://microjs.com/#events
