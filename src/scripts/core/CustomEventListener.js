export class CustomEventListener {
  constructor() {
    this._observers = {};
  }

  addEventListener(name, callback) {
    if (this._observers[name] === undefined) {
      this._observers[name] = [];
    }
    this._observers[name].push(callback);
  }

  removeEventListener(name, callback) {
    this._observers[name] = this._observers[name].filter((item) => {
      return item !== callback;
    });
  }

  trigger(name, ...params) {
    if (this._observers[name] !== undefined) {
      for (let i = 0; i < this._observers[name].length; i++) {
        this._observers[name][i](...params);
      }
    }
  }
}
