import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { IconDisplay, IconModal } from './components';
import {
  ClearButton,
  Container,
  GlobalStyle,
  Label,
  PlaceholderIcon,
  TriggerButton,
} from './styles';
import type { IconValue } from './types';
import { POPULAR_COLLECTIONS } from './types';
import { parseIconValue, searchAllCollections, searchIcons, stringifyIconValue, useDebounce, useThrottle } from './utils';

const REACT_INIT_DELAY_MS = 100;
const MODAL_ANIMATION_DURATION_MS = 350;
const COLOR_CHANGE_DEBOUNCE_MS = 500;

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

interface BetterIconsProps {
  value?: string;
  onChange: (value: string) => void;
  readonly?: boolean;
}

interface IconWithCollection {
  icon: string;
  collection: string;
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



const BetterIcons = ({ value, onChange, readonly }: BetterIconsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInAll, setSearchInAll] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>(POPULAR_COLLECTIONS[0].prefix);
  const [icons, setIcons] = useState<string[]>([]);
  const [iconsWithCollections, setIconsWithCollections] = useState<IconWithCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [totalIcons, setTotalIcons] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const colorDebounceTimer = useRef<number | null>(null);
  const isColorPickerActive = useRef<boolean>(false);

  const debouncedSearch = useDebounce(search, 300);

  const currentValue = useMemo<IconValue | null>(() => parseIconValue(value), [value]);
  const [color, setColor] = useState(currentValue?.color || '#000000');

  const throttledColor = useThrottle(color, 50);

  useEffect(() => {
    if (currentValue?.color) {
      setColor(currentValue.color);
    }
  }, [currentValue]);

  useEffect(() => {
    if (!isOpen) return;

    const loadIcons = async () => {
      setLoading(true);
      setError(null);
      setOffset(0);
      setHasMore(true);
      setIcons([]);
      setIconsWithCollections([]);
      setTotalIcons(0);
      try {
        if (searchInAll && debouncedSearch) {
          const allCollections = POPULAR_COLLECTIONS.map(c => c.prefix);
          const results = await searchAllCollections(debouncedSearch, allCollections, 200, 0);
          setIconsWithCollections(results);
          setIcons(results.map(r => r.icon));
          setHasMore(results.length === 200);
        } else {
          const result = await searchIcons(selectedCollection, debouncedSearch, 200, 0);
          setIcons(result.icons);
          setTotalIcons(result.total);
          setIconsWithCollections([]);
          setHasMore(result.icons.length === 200);
        }
      } catch (err) {
        setError('Failed to load icons. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadIcons();
  }, [selectedCollection, debouncedSearch, isOpen, searchInAll]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;

    setLoadingMore(true);
    try {
      const newOffset = offset + 200;
      if (searchInAll && debouncedSearch) {
        const allCollections = POPULAR_COLLECTIONS.map(c => c.prefix);
        const results = await searchAllCollections(debouncedSearch, allCollections, 200, newOffset);
        if (results.length > 0) {
          setIconsWithCollections(prev => [...prev, ...results]);
          setIcons(prev => [...prev, ...results.map(r => r.icon)]);
        }
        setHasMore(results.length === 200);
      } else {
        const result = await searchIcons(selectedCollection, debouncedSearch, 200, newOffset);
        if (result.icons.length > 0) {
          setIcons(prev => [...prev, ...result.icons]);
        }
        setHasMore(result.icons.length === 200);
      }
      setOffset(newOffset);
    } catch (err) {
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, loading, offset, searchInAll, debouncedSearch, selectedCollection]);

  const handleToggleModal = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    if (readonly) return;

    if (!isOpen) {
      if (currentValue?.icon) {
        const [collection] = currentValue.icon.split(':');
        if (collection) {
          setSelectedCollection(collection);
        }
      } else {
        setSelectedCollection(POPULAR_COLLECTIONS[0].prefix);
      }
      setSearch('');
      setSearchInAll(false);
      setIsAnimating(true);
      setIsOpen(true);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsOpen(false), MODAL_ANIMATION_DURATION_MS);
    }
  }, [isOpen, readonly, currentValue]);

  const handleSelectIcon = useCallback((iconName: string, collection?: string) => {
    const col = collection || selectedCollection;
    const fullIconName = `${col}:${iconName}`;
    const iconValue: IconValue = {
      icon: fullIconName,
      color,
    };
    onChange(stringifyIconValue(iconValue));
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), MODAL_ANIMATION_DURATION_MS);
  }, [selectedCollection, color, onChange]);

  const handleClearSelection = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!readonly) {
      onChange('');
    }
  }, [onChange, readonly]);

  const handleColorChange = useCallback((newColor: string) => {
    setColor(newColor);

    if (colorDebounceTimer.current) {
      clearTimeout(colorDebounceTimer.current);
    }

    if (currentValue) {
      colorDebounceTimer.current = setTimeout(() => {
        const updatedValue: IconValue = {
          ...currentValue,
          color: newColor,
        };
        onChange(stringifyIconValue(updatedValue));
      }, COLOR_CHANGE_DEBOUNCE_MS);
    }
  }, [currentValue, onChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isColorPickerActive.current) {
        return;
      }

      const target = event.target as HTMLElement;

      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsAnimating(false);
        setTimeout(() => setIsOpen(false), MODAL_ANIMATION_DURATION_MS);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <GlobalStyle />
      <Container ref={containerRef}>
        <Label>Icon</Label>
        <TriggerButton
          hasValue={!!currentValue}
          onClick={handleToggleModal}
          disabled={readonly}
          type="button"
        >
          {currentValue ? (
            <IconDisplay
              key={currentValue.icon}
              icon={currentValue.icon}
              color={currentValue.color || color}
              width={32}
              height={32}
            />
          ) : (
            <PlaceholderIcon />
          )}
          {currentValue && !readonly && (
            <ClearButton onClick={handleClearSelection} type="button">
              ×
            </ClearButton>
          )}
        </TriggerButton>

        <IconModal
          isOpen={isOpen}
          isAnimating={isAnimating}
          selectedIcon={currentValue?.icon || null}
          color={throttledColor}
          onClose={handleToggleModal}
          onSelectIcon={handleSelectIcon}
          onColorChange={handleColorChange}
          icons={icons}
          iconsWithCollections={iconsWithCollections}
          loading={loading}
          error={error}
          selectedCollection={selectedCollection}
          onCollectionChange={setSelectedCollection}
          search={search}
          onSearchChange={setSearch}
          searchInAll={searchInAll}
          onSearchInAllChange={setSearchInAll}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          loadingMore={loadingMore}
          totalIcons={totalIcons}
          isColorPickerActive={isColorPickerActive}
        />
      </Container>
    </>
  );
};



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
      <BetterIcons
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
