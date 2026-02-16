import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/property-editor';
import { createRoot, type Root } from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import { BetterIconsCore } from './BetterIconsCore';

export class BetterIconsElement extends HTMLElement implements UmbPropertyEditorUiElement {
  private root: Root | null = null;
  private _value: string = '';
  private _readonly: boolean = false;
  private container: HTMLDivElement | null = null;
  private styleTarget: HTMLElement | ShadowRoot | null = null;

  static get observedAttributes() {
    return ['value', 'readonly'];
  }

  connectedCallback() {
    let el: Node | null = this;
    while (el) {
      if (el instanceof ShadowRoot) {
        this.styleTarget = el;
        break;
      }
      el = (el as HTMLElement).parentNode || (el as ShadowRoot).host?.parentNode || null;
    }
    
    if (!this.styleTarget) {
      this.styleTarget = document.head;
    }
    
    this.container = document.createElement('div');
    this.container.style.display = 'block';
    this.appendChild(this.container);
    
    this.root = createRoot(this.container);
    this.render();
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
    
    if (this.container && this.contains(this.container)) {
      this.removeChild(this.container);
    }
    this.container = null;
    this.styleTarget = null;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    if (name === 'value') {
      this._value = newValue || '';
    } else if (name === 'readonly') {
      this._readonly = newValue === 'true' || newValue === '';
    }

    if (this.root) {
      this.render();
    }
  }

  get value() {
    return this._value;
  }

  set value(val: string | any) {
    let stringValue = '';
    
    if (val === null || val === undefined || val === '') {
      stringValue = '';
    } else if (typeof val === 'string') {
      stringValue = val;
    } else if (typeof val === 'object') {
      stringValue = JSON.stringify(val);
    } else {
      stringValue = String(val);
    }
    
    if (this._value !== stringValue) {
      this._value = stringValue;
      if (stringValue) {
        this.setAttribute('value', stringValue);
      } else {
        this.removeAttribute('value');
      }
      this.render();
    }
  }

  get readonly() {
    return this._readonly;
  }

  set readonly(val: boolean) {
    if (this._readonly !== val) {
      this._readonly = val;
      if (val) {
        this.setAttribute('readonly', '');
      } else {
        this.removeAttribute('readonly');
      }
      this.render();
    }
  }

  private handleChange = (value: string) => {
    this._value = value;
    
    this.dispatchEvent(
      new CustomEvent('property-value-change', {
        bubbles: true,
        composed: true,
        detail: { value }
      })
    );

    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        detail: { value }
      })
    );

    this.render();
  };

  private render() {
    if (!this.root || !this.styleTarget) return;

    this.root.render(
      <StyleSheetManager target={this.styleTarget as any} enableVendorPrefixes>
        <BetterIconsCore
          value={this._value}
          onChange={this.handleChange}
          readonly={this._readonly}
        />
      </StyleSheetManager>
    );
  }
}

if (!customElements.get('bettericons-picker')) {
  customElements.define('bettericons-picker', BetterIconsElement);
}

export default BetterIconsElement;
