import { controller, target, attr } from '@github/catalyst';
import { fromEvent, Subscription } from '../../utils/fromEvent';

@controller
export class BlxNumberInputElement extends HTMLElement {
  @target input!: HTMLInputElement;

  private subscriptions: Subscription[] = [];

  @attr locale: string = 'de';

  connectedCallback() {
    // setup accessibility
    this.setupAttributes();
    this.updateInputValue();

    this.setupSubscriptions();
  }

  attributeChangedCallback() {}

  disconnectedCallback() {
    this.cleanupSubscriptions();
  }

  private setupAttributes() {
    if (!this.input) {
      return;
    }
    this.input.setAttribute('inputmode', 'numeric');
    this.input.setAttribute('type', 'text');
  }

  private updateInputValue = () => {
    // remove any non-digit character
    const currentVal = this.input.value
      .split('')
      .filter((key) => key >= '0' && key <= '9')
      .join('');

    // parse to number
    const newValue = parseInt(currentVal, 10);
    // check if it's a number. If not, set 0
    if (isNaN(newValue)) {
      this.input.value = '0';
    } else {
      // format using locale
      this.input.value = newValue.toLocaleString(this.locale);
    }
  };

  private setupSubscriptions = () => {
    this.subscriptions = [fromEvent(this.input, 'input', this.updateInputValue)];
  };

  private cleanupSubscriptions = () => {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  };
}
