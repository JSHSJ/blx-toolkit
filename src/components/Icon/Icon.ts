import { controller, attr } from '@github/catalyst';

@controller
export class BlxIconElement extends HTMLElement {
  @attr name!: string;
  @attr size!: string;

  @attr width: number = 0;
  @attr height: number = 0;

  getSize() {
    switch (this.size) {
      case 'xs':
        return { width: '0.5em', height: '0.5em' };
      case 's':
        return { width: '0.75em', height: '0.75em' };
      case 'm':
        return { width: '1em', height: '1em' };
      case 'l':
        return { width: '1.25em', height: '1.25em' };
      case 'xl':
        return { width: '1.5em', height: '1.5em' };
      case '2xl':
        return { width: '1.75em', height: '1.75em' };
      case 'custom':
        return { width: this.width, height: this.height };
      default:
        return { width: '1em', height: '1em' };
    }
  }

  connectedCallback() {
    this.innerHTML = `
    <svg viewBox="0 0 32 32" width="${this.getSize().width}" height="${this.getSize().height}">
      <use xlink:href="icons/${this.name}.svg/#${this.name}"></use>
    </svg>
    `;
  }

  disconnectedCallback() {}

  attributeChangedCallback() {}
}
