export type Subscription = { unsubscribe(): void };
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

export const fromClickOutside = (
  container: HTMLElement,
  onNext: Function,
  options: boolean | AddEventListenerOptions = false
) => {
  const eventListener = (event: MouseEvent) => {
    if (!container || !container.contains(event.target as HTMLElement)) {
      onNext();
    }
  };

  window.addEventListener('click', eventListener, options);

  return {
    unsubscribe: () => {
      window.removeEventListener('click', eventListener);
    },
  };
};
