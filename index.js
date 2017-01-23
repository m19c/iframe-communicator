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
    this.master = null;

    const eventListenerName = ('addEventListener' in window) ? 'addEventListener' : 'attachEvent';

    if (!this.master) {
      this.master = window;
      while (this.master.parent && this.master.parent !== this.master) {
        this.master = this.master.parent;
      }
    }

    window[eventListenerName]('message', (event) => {
      if (!event || !event.data) {
        return;
      }

      const data = fromJSON(event.data);

      if (data.type !== 'ready') {
        return;
      }

      this.fire('ready', event, data);
    });

    const registered = {};
    this.master.window[eventListenerName]('message', (event) => {
      if (!event || !event.data) {
        return;
      }

      const data = fromJSON(event.data);

      if (data.type !== 'register') {
        return;
      }

      registered[data.id] = data;
      registered[data.id].window = event.source;

      // register deps
      if (data.deps && Array.isArray(data.deps)) {
        data.deps.forEach((dep) => {
          if (!registered.hasOwnProperty(dep)) {
            registered[dep] = false;
          }
        });
      }

      // check
      for (const key in registered) {
        if (!registered[key]) {
          continue;
        }

        const item = registered[key];

        if (!item || !item.deps) {
          continue;
        }

        const isFulfilled = item.deps
          .filter((dep) => !!registered[dep]) // eslint-disable-line
          .length === item.deps.length
        ;

        if (isFulfilled) {
          item.window.postMessage(toJSON({ type: 'ready' }), '*');
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

  register() {
    this.master.postMessage(toJSON({ type: 'register', id: this.id, deps: this.deps }), '*');
  }

}
