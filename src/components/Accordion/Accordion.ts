import { controller, target, attr } from '@github/catalyst';
import { fromEvent, Subscription } from '../../utils/fromEvent';
import './style.css';

@controller
export class BlxAccordionElement extends HTMLElement {
  @target header!: HTMLElement;
  @target content!: HTMLElement;
  @target icon!: HTMLElement;

  @attr isOpen: boolean = false;

  private subscriptions: Subscription[] = [];

  private accordionId = 1;
  private contentContainerId = `accordion-content-${this.accordionId}`;
  private contentHeaderId = `accordion-header-${this.accordionId}`;

  connectedCallback() {
    // setup accessibility
    this.header.setAttribute('aria-expanded', 'false');
    this.header.setAttribute('aria-controls', this.contentContainerId);
    this.header.setAttribute('id', this.contentHeaderId);
    this.content.setAttribute('id', this.contentContainerId);
    this.content.setAttribute('aria-labelledby', this.contentHeaderId);

    if (!(this.header.tagName === 'BUTTON')) {
      this.header.setAttribute('role', 'button');
    }

    this.handleClosingAttributes();
  }

  attributeChangedCallback() {
    if (this.isOpen) {
      this.addOpeningAttributes();
      this.setupSubscriptions();
    }
    if (!this.isOpen) {
      this.handleClosingAttributes();

      this.cleanupSubscriptions();
    }
  }

  disconnectedCallback() {
    this.cleanupSubscriptions();
  }

  private setupSubscriptions = () => {
    this.subscriptions = [
      // fromEvent(this.header, 'click', () => this.toglge()),
      fromEvent(this, 'keydown', (e) => this.handleKeydownEvents(e as KeyboardEvent)),
    ];
  };

  private cleanupSubscriptions = () => {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  };

  private handleKeydownEvents = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.dismiss();
    }
  };

  private addOpeningAttributes = () => {
    this.classList.add('open');
    const height = this.content.scrollHeight;

    this.header.setAttribute('aria-expanded', 'true');
    this.content.setAttribute('style', `height: ${height}px; overflow: hidden;`);
    this.content.setAttribute('aria-hidden', 'true');
  };

  private handleClosingAttributes = () => {
    this.classList.remove('open');
    this.header.setAttribute('aria-expanded', 'false');
    this.content.setAttribute('style', 'height: 0; overflow: hidden;');
    this.content.setAttribute('aria-hidden', 'true');
  };

  public toggle() {
    this.isOpen = !this.isOpen;
  }

  public dismiss() {
    this.isOpen = false;
  }
}
