import { controller, attr } from '@github/catalyst';
import './style.css';

@controller
export class BlxLoaderElement extends HTMLElement {
  @attr text!: string;
  @attr size!: string;

  @attr customSize: string = '';

  getSize() {
    switch (this.size) {
      case 's':
        return '2rem';
      case 'm':
        return '4rem';
      case 'l':
        return '8rem';
      case 'custom':
        return this.customSize;
      default:
        return '4rem';
    }
  }

  connectedCallback() {
    this.innerHTML = `
    <figure>
      <div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <legend>${this.text}</legend>
    </figure>
    `;

    this.setAttribute('style', `--size: ${this.getSize()}`);
  }

  disconnectedCallback() {}

  attributeChangedCallback() {}
}
