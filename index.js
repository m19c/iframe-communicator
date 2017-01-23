function toJSON(value) {
  try {
    return JSON.stringify(value);
  } catch (err) {
    return false;
  }
}

function fromJSON(value) {
  try {
    return JSON.parse(value);
  } catch (err) {
    return false;
  }
}

/**
 * @class IFrameCommunicator
 * @example
 * ```
 * const com = new IFrameCommunicator();
 * com.on('ready', () => document.querySelector('root').style.backgroundColor = 'blue');
 * com.ready();
 * ```
 */
export default class IFrameCommunicator {

  /**
   * @param {string} id
   * @param {array} initialDeps
   */
  constructor(id, initialDeps) {
    this.id = id;
    this.remainingDeps = initialDeps;
    this.listeners = {};

    const eventListenerName = ('addEventListener' in window) ? 'addEventListener' : 'attachEvent';

    window[eventListenerName]('message', (event) => {
      if (!event || !event.data) {
        return;
      }

      const data = fromJSON(event.data);

      if (data.type === 'ping') {
        event.source.postMessage(toJSON({
          type: 'pong',
          id: this.id
        }), '*');
      }

      const index = this.remainingDeps.indexOf(data.id);
      if (index >= 0) {
        this.remainingDeps.splice(index, 1);

        if (this.remainingDeps.length === 0) {
          this.fire('ready');
        }
      }
    });
  }

  /**
   * @param {string} name
   * @param {function} callback
   * @return {IFrameCommunicator}
   */
  on(name, callback) {
    this.listeners[name] = this.listeners[name] || [];
    this.listeners[name].push(callback);

    return this;
  }

  /**
   * @param {string} name
   * @param {...mixed} args
   * @return {boolean}
   */
  fire(name, ...args) {
    if (!this.listeners[name]) {
      return false;
    }

    this.listeners[name].forEach((callback) => {
      callback(...args);
    });
    return true;
  }

  /**
   * Sends a "message" event with the `type` `ping` to all `window.frames` and
   * thier frames, and so on...
   *
   * @return {void}
   */
  ready() {
    const bubble = (currentWindow = window.top) => {
      for (let index = 0; index < currentWindow.frames.length; index + 1) {
        if (currentWindow.frames[index] !== window) {
          currentWindow.frames[index].postMessage(toJSON({ type: 'ping', id: this.id }), '*');
        }

        bubble(currentWindow.frames[index]);
      }
    };

    bubble();
  }

}
