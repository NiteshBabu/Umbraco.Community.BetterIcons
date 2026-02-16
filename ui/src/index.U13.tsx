import ReactDOM from 'react-dom/client';
import { BetterIconsCore } from './BetterIconsCore';

const REACT_INIT_DELAY_MS = 100;

interface AngularScope {
  model: UmbracoModel;
  $apply: (fn: () => void) => void;
  $watch: (expression: string, callback: (newValue: string, oldValue: string) => void) => () => void;
}

interface AngularElement {
  scope: () => AngularScope | undefined;
}

declare global {
  interface Window {
    angular?: {
      element: (element: HTMLElement) => AngularElement;
    };
  }
}

interface UmbracoModel {
  value: string;
  readonly?: boolean;
}

if (typeof angular !== 'undefined') {
  angular.module('umbraco').controller('BetterIconsController', ['$scope', '$element', function ($scope: AngularScope, $element: any) {
    var initReact = function () {
      var element = $element[0].querySelector('#bettericons-root');
      if (element && window.initBetterIcons) {
        window.initBetterIcons(element as HTMLElement, $scope.model);
      } else {
        setTimeout(initReact, REACT_INIT_DELAY_MS);
      }
    };

    setTimeout(initReact, REACT_INIT_DELAY_MS);
  }]);
}



declare global {
  interface Window {
    initBetterIcons: (element: HTMLElement, model: UmbracoModel) => void;
  }
}

window.initBetterIcons = (element: HTMLElement, model: UmbracoModel) => {
  const root = ReactDOM.createRoot(element);

  let currentModelValue = model.value;

  const scope = window.angular?.element(element).scope();

  const handleChange = (value: string) => {
    model.value = value;
    currentModelValue = value;

    if (scope) {
      scope.$apply(() => {
        scope.model.value = value;
      });
    }

    renderComponent();
  };

  const renderComponent = () => {
    const valueAsString = typeof model.value === 'string'
      ? model.value
      : JSON.stringify(model.value);

    root.render(
      <BetterIconsCore
        key={valueAsString}
        value={valueAsString}
        onChange={handleChange}
        readonly={model.readonly}
      />
    );
  };

  let unwatch: (() => void) | null = null;

  if (scope) {
    unwatch = scope.$watch('model.value', (newValue: string, oldValue: string) => {
      if (newValue !== oldValue && newValue !== currentModelValue) {
        currentModelValue = newValue;
        model.value = newValue;
        renderComponent();
      }
    });
  }

  const observer = new MutationObserver(() => {
    if (!document.contains(element)) {
      if (unwatch) unwatch();
      observer.disconnect();
      root.unmount();
    }
  });

  if (element.parentElement) {
    observer.observe(element.parentElement, { childList: true, subtree: true });
  }

  renderComponent();
};
