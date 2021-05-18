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
        return { width: '1rem', height: '1rem' };
      case 's':
        return { width: '1.5rem', height: '1.5rem' };
      case 'm':
        return { width: '2rem', height: '2rem' };
      case 'l':
        return { width: '2.5rem', height: '2.5rem' };
      case 'xl':
        return { width: '3rem', height: '3rem' };
      case '2xl':
        return { width: '4rem', height: '4rem' };
      case 'inline':
        return { width: '1.25em', height: '1.25em' };
      case 'custom':
        return { width: this.width, height: this.height };
      default:
        return { width: '2rem', height: '2rem' };
    }
  }

  connectedCallback() {
    this.updateTemplate();
  }

  disconnectedCallback() {}

  attributeChangedCallback() {
    this.updateTemplate();
  }

  private updateTemplate = () => {
    this.innerHTML = `
    <svg viewBox="0 0 32 32" width="${this.getSize().width}" height="${this.getSize().height}">
      <use xlink:href="icons/${this.name}.svg/#${this.name}"></use>
    </svg>
    `;
  };
}
