export type Subscription = { unsubscribe(): void };
const NullSubscription = {
  unsubscribe() {
    /* Do nothing */
  },
};

export const fromEvent = (
  target: EventTarget,
  eventName: string,
  onNext: EventListenerOrEventListenerObject,
  options: boolean | AddEventListenerOptions = false
): Subscription => {
  target.addEventListener(eventName, onNext, options);

  return {
    unsubscribe: () => {
      target.removeEventListener(eventName, onNext, options);
    },
  };
};
