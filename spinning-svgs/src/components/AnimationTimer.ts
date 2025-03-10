export class AnimationTimer {
  static #instance: AnimationTimer;
  protected _lastTimestamp: DOMHighResTimeStamp = -1;
  protected _speedFactor: number = -1;
  protected _fps: number = 60 / 1000;

  // @ts-ignore: 'constructor' declared but value never read
  private contructor() {}

  static getInstance(): AnimationTimer {
    if (!AnimationTimer.#instance) {
      AnimationTimer.#instance = new AnimationTimer();
    }

    return AnimationTimer.#instance;
  }

  public setTimestamp(timestamp: number) {
    const timeDifference = timestamp - this._lastTimestamp;

    this._speedFactor = timeDifference * this._fps;
    this._lastTimestamp = timestamp;
  }

  public getSpeedFactor(): DOMHighResTimeStamp {
    return this._speedFactor;
  }
}
