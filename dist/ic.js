(function() {
  var defaults = {
    interval: 25
  };

  window.ic = window.ic || {};

  window.ic.setId = function setId(id) {
    window._icid = id;
  };

  window.ic.waitFor = function waitFor(id, callback, options) {
    var interval;

    options = options || defaults;

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

        if (id === item._icid) {
          callback(item);
          clearInterval(interval);
          break;
        }
      }
    }, options.interval);

    return interval;
  };
})();
