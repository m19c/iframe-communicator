var isArray = (Array.isArray) ? Array.isArray : null;
var indexOf = (Array.indexOf) ? Array.indexOf : null;
var ic = {};

if (!isArray) {
  isArray = function isArrayPolyfill(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  };
}

if (!indexOf) {
  indexOf = function indexOfPolyfill(data, search) {
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

  ids = (!isArray(ids)) ? [ids] : ids;

  if (!window && !window.parent && !window.parent.frames) {
    return callback(null);
  }

  interval = setInterval(function icWaitForInterval() {
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

export default ic;
