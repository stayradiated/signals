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
  Signals.prototype.on = function(eventName, handler) {
    if (! this.handlers.hasOwnProperty(eventName)) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
    return this;
  };

  // add a listener that will only be called once
  Signals.prototype.once = function(eventName, handler) {
    var wrappedHandler = function () {
      handler.apply(this.off(eventName, wrappedHandler), arguments);
    };

    // in order to allow that these wrapped handlers can be removed by
    // removing the original function, we save a reference to the original
    // function
    wrappedHandler.h = handler;

    return this.on(eventName, wrappedHandler);
  };

  // remove a listener
  Signals.prototype.off = function(eventName, handler) {
    var i, list, len;
    list = this.handlers[eventName];

    for(i = list.length - 1; i >= 0; i--) {
      if (list[i] === handler || list[i].h === handler) {
        list.splice(i, 1);
      }
    }

    if (list.length === 0 || ! handler) {
      delete this.handlers[eventName];
    }

    return this;
  };

  Signals.prototype.emit = function(eventName) {
    var i, list, len;
    list = this.handlers[eventName];
    if (typeof list === 'undefined') {
      return this;
    }
    len = list.length;
    for(i = 0; i < len; i++) {
        list[i].apply(this, list.slice.call(arguments, 1));
    }
    return this;
  };

  module.exports = Signals;

}());
