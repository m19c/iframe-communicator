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

export default class IFrameCommunicator {

  constructor(id, deps) {
    this.id = id;
    this.deps = deps;
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

      const index = this.deps.indexOf(data.id);
      if (index >= 0) {
        this.deps.splice(index, 1);

        if (this.deps.length === 0) {
          this.fire('ready');
        }
      }
    });
  }

  on(name, callback) {
    this.listeners[name] = this.listeners[name] || [];
    this.listeners[name].push(callback);

    return this;
  }

  fire(name, ...args) {
    if (!this.listeners[name]) {
      return false;
    }

    this.listeners[name].forEach((callback) => {
      callback(...args);
    });
    return true;
  }

  ready(currentWindow = window.top) {
    for (let i = 0; i < currentWindow.frames.length; i++) {
      if (currentWindow.frames[i] !== window) {
        currentWindow.frames[i].postMessage(toJSON({ type: 'ping', id: this.id }), '*');
      }

      this.ready(currentWindow.frames[i]);
    }
  }

}
