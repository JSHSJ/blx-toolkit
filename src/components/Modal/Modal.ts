import { controller, target, attr } from '@github/catalyst';
import { fromEvent, Subscription } from '../../utils/fromEvent';
import './style.css';

@controller
export class BlxModalElement extends HTMLElement {
  @target container!: HTMLElement;
  @target overlay!: HTMLElement;
  @target content!: HTMLElement;

  @target close!: HTMLElement | null;
  @target modalTitle!: HTMLElement | null;

  @attr isOpen: boolean = false;

  private previouslyActiveElement: HTMLElement | null = null;
  private subscriptions: Subscription[] = [];

  connectedCallback() {
    this.container.setAttribute('role', 'dialog');
    this.container.setAttribute('aria-modal', 'true');

    if (this.modalTitle) {
      const modalTitleId = `modal-title-id-${this.modalTitle.textContent}`;
      this.modalTitle.setAttribute('id', modalTitleId);
      this.container.setAttribute('aria-labeledby', modalTitleId);
    }
  }

  attributeChangedCallback() {
    if (this.isOpen) {
      this.addOpeningClasses();

      this.previouslyActiveElement = document.activeElement as HTMLElement;

      if (this.close) {
        this.close.focus();
      }

      this.setupSubscriptions();
    }
    if (!this.isOpen) {
      this.handleClosingClasses();

      this.previouslyActiveElement?.focus();
      this.previouslyActiveElement = null;

      this.cleanupSubscriptions();
    }
  }

  disconnectedCallback() {
    this.cleanupSubscriptions();
  }

  private setupSubscriptions = () => {
    this.subscriptions = [
      fromEvent(this.overlay, 'click', () => this.dismiss()),
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

  private addOpeningClasses = () => {
    this.container.classList.add('open');
    this.overlay.classList.add('fade-in-overlay');
    this.content.classList.add('fade-in-content');
  };

  private handleClosingClasses = () => {
    this.overlay.classList.remove('fade-in-overlay');
    this.content.classList.remove('fade-in-content');
    this.overlay.classList.add('fade-out-overlay');
    this.content.classList.add('fade-out-content');

    setTimeout(() => {
      this.container.classList.remove('open');
      this.overlay.classList.remove('fade-out-overlay');
      this.content.classList.remove('fade-out-content');
      this;
    }, 300);
  };

  public open() {
    this.isOpen = true;
  }

  public dismiss() {
    this.isOpen = false;
  }

  // data-targets="domain.target"
  // data-action="event:domain#method"
  // set attributes with data-attrName="fasfa"

  // <user-settings data-targets="user-list.users">
  //     <input type="checkbox" data-target="user-settings.read">
  //     <input type="checkbox" data-target="user-settings.write">
  //   </user-settings>
}
