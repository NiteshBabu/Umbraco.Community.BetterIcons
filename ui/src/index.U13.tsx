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
  config?: {
    allowedCollections?: string[];
  };
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

  angular.module('umbraco').controller('BetterIcons.AllowedCollectionsController', ['$scope', function ($scope: any) {
    $scope.collections = [
      { prefix: 'mdi', name: 'Material Design Icons' },
      { prefix: 'ph', name: 'Phosphor' },
      { prefix: 'tabler', name: 'Tabler Icons' },
      { prefix: 'lucide', name: 'Lucide' },
      { prefix: 'heroicons', name: 'Heroicons' },
      { prefix: 'carbon', name: 'Carbon' },
      { prefix: 'bi', name: 'Bootstrap Icons' },
      { prefix: 'ion', name: 'Ionicons' },
      { prefix: 'ri', name: 'Remix Icon' },
      { prefix: 'fa6-solid', name: 'Font Awesome Solid' },
      { prefix: 'fa6-regular', name: 'Font Awesome Regular' },
      { prefix: 'fa6-brands', name: 'Font Awesome Brands' },
      { prefix: 'simple-icons', name: 'Simple Icons (Brands)' },
      { prefix: 'logos', name: 'SVG Logos' },
      { prefix: 'skill-icons', name: 'Skill Icons' },
      { prefix: 'devicon', name: 'Devicon' },
      { prefix: 'vscode-icons', name: 'VSCode Icons' },
      { prefix: 'file-icons', name: 'File Icons' },
      { prefix: 'emojione', name: 'Emoji One' },
      { prefix: 'noto', name: 'Noto Emoji' },
      { prefix: 'twemoji', name: 'Twitter Emoji' },
      { prefix: 'fluent-emoji', name: 'Fluent Emoji' },
    ];

    if (!$scope.model.value || !Array.isArray($scope.model.value)) {
      $scope.model.value = [];
    }

    $scope.isSelected = function (prefix: string) {
      return $scope.model.value.indexOf(prefix) > -1;
    };

    $scope.toggle = function (prefix: string) {
      var idx = $scope.model.value.indexOf(prefix);
      if (idx > -1) {
        $scope.model.value.splice(idx, 1);
      } else {
        $scope.model.value.push(prefix);
      }
    };
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

    const allowedCollections = model.config?.allowedCollections;

    root.render(
      <BetterIconsCore
        key={valueAsString}
        value={valueAsString}
        onChange={handleChange}
        readonly={model.readonly}
        allowedCollections={allowedCollections && allowedCollections.length > 0 ? allowedCollections : undefined}
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
