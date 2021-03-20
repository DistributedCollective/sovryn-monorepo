export class EventBag<T = string> {
  private _triggers: { [key: string]: Array<any> } = {};

  public on = (event: T, callback: any) => {
    const key = (event as unknown) as string;
    if (!this._triggers[key]) {
      this._triggers[key] = [];
    }
    this._triggers[key].push(callback);
  };

  public off = (event: T, callback?) => {
    const key = (event as unknown) as string;
    if (this._triggers.hasOwnProperty(key)) {
      if (!callback) {
        this._triggers[key] = [];
      } else {
        this._triggers[key] = this._triggers[key].filter(
          item => item !== callback,
        );
      }
    }
  };

  public trigger(event: T, ...values: any) {
    const key = (event as unknown) as string;
    if (this._triggers[key]) {
      for (const i in this._triggers[key]) {
        if (this._triggers[key].hasOwnProperty(i)) {
          this._triggers[key][i](...values);
        }
      }
    }
  }
}
