var Util = require('../util');

var global = Function("return this")();

// We need to bind clear functions this way to avoid exceptions on IE8
function clearTimeout(timer) {
  global.clearTimeout(timer);
}
function clearInterval(timer) {
  global.clearInterval(timer);
}

function GenericTimer(set, clear, delay, callback) {
  var self = this;

  this.clear = clear;
  this.timer = set(function() {
    if (self.timer !== null) {
      self.timer = callback(self.timer);
    }
  }, delay);
}
var prototype = GenericTimer.prototype;

/** Returns whether the timer is still running.
 *
 * @return {Boolean}
 */
prototype.isRunning = function() {
  return this.timer !== null;
};

/** Aborts a timer when it's running. */
prototype.ensureAborted = function() {
  if (this.timer) {
    // Clear function is already bound
    this.clear(this.timer);
    this.timer = null;
  }
};

/** Cross-browser compatible one-off timer abstraction.
 *
 * @param {Number} delay
 * @param {Function} callback
 */
var Timer = function(delay, callback) {
  return new GenericTimer(setTimeout, clearTimeout, delay, function(timer) {
    callback();
    return null;
  });
};
/** Cross-browser compatible periodic timer abstraction.
 *
 * @param {Number} delay
 * @param {Function} callback
 */
var PeriodicTimer = function(delay, callback) {
  return new GenericTimer(setInterval, clearInterval, delay, function(timer) {
    callback();
    return timer;
  });
};

module.exports = {
  Timer: Timer,
  PeriodicTimer: PeriodicTimer
}
