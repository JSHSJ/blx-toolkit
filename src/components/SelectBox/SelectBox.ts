import { controller, target, targets, attr } from '@github/catalyst';
import { fromClickOutside, fromEvent, Subscription } from '../../utils/fromEvent';
import './style.css';

@controller
export class BlxSelectBoxElement extends HTMLElement {
  @target container!: HTMLElement;
  @target input!: HTMLInputElement;
  @target list!: HTMLElement;
  @targets options!: HTMLOptionElement[];
  @target lastOption!: HTMLElement;

  private subscriptions: Subscription[] = [];

  @attr currentFocus = -1;
  @attr listHeight = 0;

  connectedCallback() {
    // setup accessibility

    this.setupSubscriptions();
    this.setupAttributes();
    this.filter();
  }

  attributeChangedCallback() {
    this.updateFocusedOption(this.currentFocus);
  }

  disconnectedCallback() {
    this.cleanupSubscriptions();
  }

  private setupSubscriptions = () => {
    this.subscriptions = [
      fromEvent(this.input, 'focus', () => this.openDataList()),
      fromEvent(this.input, 'input', this.filter),
      fromEvent(this.input, 'keydown', this.handleInputKeydown),
      fromClickOutside(this.input, () => this.closeDataList()),
    ];

    this.options.forEach((option) => {
      this.subscriptions.push(fromEvent(option, 'click', () => this.select(option.value)));
      this.subscriptions.push(
        fromEvent(option, 'keydown', (e) => {
          if ((e as KeyboardEvent).key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            this.select(option.value);
          }
        })
      );
    });
  };

  private cleanupSubscriptions = () => {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  };

  private setupAttributes = () => {
    // this.list.setAttribute('--maxHeight', this.options[0].clientHeight.toString());
  };

  private openDataList = () => {
    this.currentFocus = -1;

    this.list.classList.add('-open');
    this.classList.add('-open');
    this.input.classList.add('-open');
  };

  private closeDataList = () => {
    this.currentFocus = -1;
    this.list.classList.remove('-open');
    this.classList.remove('-open');
    this.input.classList.remove('-open');
  };

  private filter = () => {
    this.currentFocus = -1;
    const filterValue = this.input.value.toUpperCase();
    let showingValues = false;
    this.options.forEach((opt) => {
      if (opt.value.toUpperCase().indexOf(filterValue) > -1 || opt.innerText.toUpperCase().indexOf(filterValue) > -1) {
        opt.setAttribute('data-is-visible', 'true');
        showingValues = true;
      } else {
        opt.setAttribute('data-is-visible', 'false');
      }
    });

    if (!showingValues && this.lastOption) {
      this.lastOption.setAttribute('data-is-visible', 'true');
    }
  };

  private handleInputKeydown = (e: Event) => {
    const key = (e as KeyboardEvent).key;
    if (key === 'Enter') {
      if (this.currentFocus > -1) {
        const selectedOption = this.getVisibleOptions()[this.currentFocus];
        if (selectedOption) {
          this.select(selectedOption.value);
        }
      }
    }
    if (key === 'Escape') {
      this.input.blur();
      this.closeDataList();
    }
    if (key === 'ArrowDown') {
      if (this.currentFocus >= this.getVisibleOptions().length - 1) {
        return;
      }
      this.currentFocus++;
    }
    if (key === 'ArrowUp') {
      if (this.currentFocus <= 0) {
        return;
      }
      this.currentFocus--;
    }
  };

  private getVisibleOptions = () => {
    return this.options.filter((o) => o.getAttribute('data-is-visible') === 'true');
  };

  private updateFocusedOption = (focussedIndex: number) => {
    this.options.forEach((o) => {
      o.classList.remove('-active');
    });
    this.getVisibleOptions().forEach((o, idx) => {
      if (idx === focussedIndex) {
        o.classList.add('-active');
        o.scrollIntoView({
          block: 'nearest',
        });
      }
    });
  };

  public select = (value: string) => {
    this.input.value = value;
    this.options.forEach((o) => {
      o.classList.remove('-selected');
      if (o.value === value) {
        o.classList.add('-selected');
      }
    });
    this.closeDataList();
    this.input.blur();
  };
}
