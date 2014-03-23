(function () {

  'use strict';

  var Signals = function () {
    this.handlers = {};
  };

  // Convert an existing object into an event emitter
  Signals.convert = function (obj) {
    var signals = new Signals();
    obj.on   = function () {
      signals.on.apply(signals, arguments);
      return obj;
    };
    obj.once = function () {
      signals.once.apply(signals, arguments);
      return obj;
    };
    obj.off  = function () {
      signals.off.apply(signals, arguments);
      return obj;
    };
    obj.emit = function () {
      signals.emit.apply(signals, arguments);
      return obj;
    };
    return obj;
  };

  // add a listener
  Signals.prototype.on = function(eventName, handler, context) {
    if (! this.handlers.hasOwnProperty(eventName)) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push({
      callback: handler,
      context: context
    });
    return this;
  };

  // add a listener that will only be called once
  Signals.prototype.once = function(eventName, handler, context) {
    var wrappedHandler = function () {
      handler.apply(this.off(eventName, wrappedHandler), arguments);
    };

    // in order to allow that these wrapped handlers can be removed by
    // removing the original function, we save a reference to the original
    // function
    wrappedHandler._callback = handler;

    return this.on(eventName, wrappedHandler, context);
  };

  // remove a listener
  Signals.prototype.off = function(eventName, handler) {
    var i, item, list, len;
    list = this.handlers[eventName];

    for(i = list.length - 1; i >= 0; i--) {
      item = list[i];
      if (item.callback === handler || item._callback === handler) {
        list.splice(i, 1);
      }
    }

    if (list.length === 0 || ! handler) {
      delete this.handlers[eventName];
    }

    return this;
  };

  Signals.prototype.emit = function(eventName) {
    var i, item, list,len;
    list = this.handlers[eventName];
    if (typeof list === 'undefined') {
      return this;
    }
    len = list.length;
    for(i = 0; i < len; i++) {
      item = list[i];
      item.callback.apply(item.context || this, list.slice.call(arguments, 1));
    }
    return this;
  };

  if (typeof module !== 'undefined') {
    module.exports = Signals;
  } else if (typeof window !== 'undefined') {
    window.Signals = Signals;
  }

}());
