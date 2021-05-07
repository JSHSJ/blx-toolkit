import { controller, target, targets, attr } from '@github/catalyst';
import { fromEvent, Subscription } from '../../utils/fromEvent';

@controller
export class ThemeSwitcherElement extends HTMLElement {
  @target root!: HTMLElement;
  @targets buttons!: HTMLElement[];

  @attr theme: string = 'theme-default';

  private subscriptions: Subscription[] = [];

  connectedCallback() {
    this.root.classList.add(this.theme);

    this.subscriptions = this.buttons.map((button) =>
      fromEvent(button, 'click', (e) => {
        const newTheme = (e.target as Element)?.getAttribute('data-theme');
        if (newTheme) {
          this.switchTheme(newTheme);
        }
      })
    );
  }

  disconnectedCallback() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  attributeChangedCallback() {
    // remove current theme
    const classes = this.root.className.split(' ').filter((c) => !c.startsWith('theme'));
    this.root.className = classes.join(' ').trim();

    this.root.classList.add(this.theme);
  }

  private switchTheme = (theme: string) => {
    this.theme = theme;
  };
}
