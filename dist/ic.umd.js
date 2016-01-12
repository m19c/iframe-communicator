'use strict';

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.index = mod.exports;
  }
})(this, function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var isArray = Array.isArray ? Array.isArray : null;
  var indexOf = Array.indexOf ? Array.indexOf : null;
  var ic = {};

  if (!isArray) {
    isArray = function (value) {
      return Object.prototype.toString.call(value) === '[object Array]';
    };
  }

  if (!indexOf) {
    indexOf = function (data, search) {
      var index = 0;
      var object;
      var length;

      if (data === null && !data) {
        throw new TypeError('"data" is null or not defined');
      }

      object = Object(this);
      length = object.length >>> 0;

      if (length === 0) {
        return -1;
      }

      while (index < length) {
        if (index in object && object[index] === search) {
          return index;
        }

        index++;
      }

      return -1;
    };
  }

  ic.setId = function setId(id) {
    window._icid = id;
  };

  ic.waitFor = function waitFor(ids, callback, options) {
    var interval;
    ids = !isArray(ids) ? [ids] : ids;

    if (!window && !window.parent && !window.parent.frames) {
      return callback(null);
    }

    interval = setInterval(function () {
      var index;
      var item;

      for (index = 0; index < window.parent.frames.length; index++) {
        item = window.parent.frames[index];

        if (!item) {
          continue;
        }

        if (indexOf(ids, item._icid)) {
          callback(item);
          clearInterval(interval);
          break;
        }
      }
    }, options.interval);
    return interval;
  };

  exports.default = ic;
});