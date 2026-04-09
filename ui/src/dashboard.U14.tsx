import { createRoot, type Root } from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import { BetterIconsManagementDashboard } from './IconRegistrationDashboard';

// Dashboard element for Umbraco 15+ (Web Components)
export class BetterIconsManagementDashboardElement extends HTMLElement {
  private root: Root | null = null;
  private container: HTMLDivElement | null = null;
  private styleTarget: HTMLElement | ShadowRoot | null = null;

  connectedCallback() {
    // Delay rendering to ensure DOM is ready
    setTimeout(() => {
      this.renderDashboard();
    }, 0);
  }

  private renderDashboard() {
    // Find the nearest shadow root for style scoping
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
    this.container.style.width = '100%';
    this.appendChild(this.container);

    this.root = createRoot(this.container);
    this.render();
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }

    if (this.container && this.contains(this.container)) {
      this.removeChild(this.container);
    }
    this.container = null;
    this.styleTarget = null;
  }

  private render() {
    if (this.root && this.styleTarget) {
      this.root.render(
        <StyleSheetManager target={this.styleTarget as any}>
          <BetterIconsManagementDashboard />
        </StyleSheetManager>
      );
    }
  }
}

if (!customElements.get('bettericons-management-dashboard')) {
  customElements.define('bettericons-management-dashboard', BetterIconsManagementDashboardElement);
}

export default BetterIconsManagementDashboardElement;
