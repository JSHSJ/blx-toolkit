import { controller, targets, target, attr } from '@github/catalyst';
import { fromEvent, Subscription } from '../../utils/fromEvent';
import './style.css';

@controller
export class BlxCarouselElement extends HTMLElement {
  @target container!: HTMLElement;
  @target itemContainer!: HTMLElement;
  @targets items!: HTMLElement[];

  @target nextButton!: HTMLElement;
  @target previousButton!: HTMLElement;

  @target dotContainer!: HTMLElement;
  @target dotTemplate!: HTMLTemplateElement;
  @targets dots!: HTMLElement[];

  @attr currentIndex: number = 0;
  @attr itemsToDisplay: number = 1;

  private slideAttributes = {
    amountSlides: 0,
    itemWidth: '',
    slidePercent: 100,
    currentTranslate: '',
  };

  private subscriptions: Subscription[] = [];

  connectedCallback() {
    this.calculateAttributes();
    this.setupSubscriptions();

    this.container.setAttribute('role', 'region');
    this.items.forEach(() => this.setAttribute('role', 'group'));

    this.performSlide();
  }

  attributeChangedCallback() {
    this.calculateAttributes();

    this.performSlide();
  }

  disconnectedCallback() {
    this.cleanupSubscriptions();
  }

  private setupSubscriptions = () => {
    this.subscriptions = [fromEvent(this, 'keydown', (e) => this.handleKeydownEvents(e as KeyboardEvent))];
  };

  private cleanupSubscriptions = () => {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  };

  private handleKeydownEvents = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight':
        this.nextSlide();
        return;
      case 'ArrowLeft':
        this.previousSlide();
        return;
      default:
        return;
    }
  };

  private calculateAttributes = () => {
    const itemWidth = 100 / this.itemsToDisplay;
    const amountSlides = Math.ceil(this.items.length / this.itemsToDisplay);

    if (amountSlides !== this.slideAttributes.amountSlides) {
      this.createDots(amountSlides);
    }

    this.slideAttributes.itemWidth = `${itemWidth}%`;
    this.slideAttributes.slidePercent = itemWidth * this.itemsToDisplay;
    this.slideAttributes.amountSlides = amountSlides;
    this.setAttributes();
  };

  private performSlide = () => {
    this.slideAttributes.currentTranslate = `translate3d(-${
      this.slideAttributes.slidePercent * this.currentIndex
    }%, 0, 0`;

    this.setDotClasses();
    this.setSlideAttributes();

    this.setAttributes();
  };

  private setAttributes = () => {
    const customProps = Object.entries(this.slideAttributes)
      .map(([k, v]) => `--${k}: ${v}`)
      .join('; ');

    this.setAttribute('style', customProps);
  };

  private createDots = (amount: number) => {
    if (this.dotContainer && this.dotTemplate) {
      this.dotContainer.textContent = '';
      for (let i = 0; i < amount; i++) {
        const dot = this.dotTemplate.content.firstElementChild?.cloneNode(true);
        if (dot) {
          dot.addEventListener('click', () => this.setSlide(i));
          this.dotContainer.appendChild(dot);
        }
      }
    }
  };

  private setDotClasses = () => {
    if (this.dots.length === 0) {
      return;
    }

    this.dots.forEach((d) => d.classList.remove('-active'));
    this.dots[this.currentIndex].classList.add('-active');
  };

  private setSlideAttributes = () => {
    const activeSlideIndices = Array.from(Array(this.itemsToDisplay)).map(
      (_, idx) => idx + this.currentIndex * this.itemsToDisplay
    );
    this.items.forEach((item, index) => {
      if (!activeSlideIndices.includes(index)) {
        item.setAttribute('aria-hidden', 'true');
        item.classList.remove('-active');
      } else {
        item.setAttribute('aria-hidden', 'false'), item.classList.add('-active');
      }
    });
  };

  public nextSlide = () => {
    const newIndex = this.currentIndex === this.slideAttributes.amountSlides - 1 ? 0 : this.currentIndex + 1;
    this.currentIndex = newIndex;
  };

  public previousSlide = () => {
    const newIndex = this.currentIndex === 0 ? this.slideAttributes.amountSlides - 1 : this.currentIndex - 1;
    this.currentIndex = newIndex;
  };

  public setSlide = (slideIndex: number) => {
    this.currentIndex = slideIndex;
  };
}
