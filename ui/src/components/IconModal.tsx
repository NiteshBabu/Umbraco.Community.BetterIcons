import { useEffect, useRef, useState } from 'react';
import {
  BrandLogo,
  ColorInput,
  ColorLabel,
  EmptyState,
  ErrorState,
  FooterCopyright,
  FooterRow,
  HeaderLink,
  HeaderLinks,
  IconCountInfo,
  IconGridWrapper,
  LoadingState,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  SearchInput,
  SearchRow,
  Tab,
  TitleRow,
  ToggleCheckbox,
  ToggleLabel,
  ToggleSlider,
  ToggleWrapper,
  UpdateIndicator,
} from '../styles';
import { POPULAR_COLLECTIONS } from '../types';
import { IconSelector } from './IconSelector';
import { TabsWithScroll } from './TabsWithScroll';

interface IconWithCollection {
  icon: string;
  collection: string;
}

interface IconModalProps {
  isOpen: boolean;
  isAnimating: boolean;
  selectedIcon: string | null;
  color: string;
  onClose: (e: React.MouseEvent) => void;
  onSelectIcon: (iconName: string, collection?: string) => void;
  onColorChange: (color: string) => void;
  icons: string[];
  iconsWithCollections: IconWithCollection[];
  loading: boolean;
  error: string | null;
  selectedCollection: string;
  onCollectionChange: (collection: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  searchInAll: boolean;
  onSearchInAllChange: (searchInAll: boolean) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  totalIcons: number;
  isColorPickerActive: { current: boolean };
}

/**
 * Modal dialog for selecting icons
 */
export const IconModal = ({
  isOpen,
  isAnimating,
  selectedIcon,
  color,
  onClose,
  onSelectIcon,
  onColorChange,
  icons,
  iconsWithCollections,
  loading,
  error,
  selectedCollection,
  onCollectionChange,
  search,
  onSearchChange,
  searchInAll,
  onSearchInAllChange,
  onLoadMore,
  hasMore,
  loadingMore,
  totalIcons,
  isColorPickerActive,
}: IconModalProps) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (icons.length > 0) {
      setIsInitialLoad(false);
    }
  }, [icons]);

  useEffect(() => {
    if (modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  }, [selectedCollection]);

  useEffect(() => {
    if (!hasMore || loadingMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loadingMore, loading, onLoadMore]);

  if (!isOpen) {
    return null;
  }

  const handleCollectionChange = (collection: string) => {
    onCollectionChange(collection);
    onSearchChange('');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the overlay background
    if (e.target === e.currentTarget) {
      onClose(e);
    }
  };

  return (
    <ModalOverlay isAnimating={isAnimating} onClick={handleOverlayClick}>
      <ModalContent isAnimating={isAnimating}>
        <ModalHeader>
          <TitleRow>
            <BrandLogo src="/App_Plugins/BetterIcons/better-icons.png" alt="BetterIcons" />
            <ModalTitle>BetterIcons</ModalTitle>
            <HeaderLinks>
              <HeaderLink href="https://github.com/niteshbabu/Umbraco.Community.BetterIcons" target="_blank" rel="noopener noreferrer" title="View on GitHub">
                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </HeaderLink>
            </HeaderLinks>
          </TitleRow>
          <SearchRow>
            <SearchInput
              type="search"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
            />
            <ToggleWrapper>
              <ToggleLabel htmlFor="searchInAll">Search in all</ToggleLabel>
              <ToggleCheckbox
                type="checkbox"
                id="searchInAll"
                checked={searchInAll}
                onChange={(e) => onSearchInAllChange(e.target.checked)}
              />
              <ToggleSlider htmlFor="searchInAll" />
            </ToggleWrapper>
          </SearchRow>
        </ModalHeader>

        <TabsWithScroll activeKey={selectedCollection}>
          {POPULAR_COLLECTIONS.map((collection) => (
            <Tab
              key={collection.prefix}
              data-key={collection.prefix}
              active={selectedCollection === collection.prefix}
              onClick={() => handleCollectionChange(collection.prefix)}
              type="button"
            >
              {collection.name}
            </Tab>
          ))}
        </TabsWithScroll>

        <ModalBody ref={modalBodyRef}>
          {loading && isInitialLoad && (
            <LoadingState>Loading icons...</LoadingState>
          )}
          
          {error && icons.length === 0 && (
            <ErrorState>{error}</ErrorState>
          )}
          
          {!loading && !error && icons.length === 0 && (
            <EmptyState>
              {search 
                ? 'No icons found matching your search.' 
                : 'No icons available in this collection.'}
            </EmptyState>
          )}
          
          {icons.length > 0 && (
            <>
              <IconGridWrapper loading={loading && !isInitialLoad}>
                <IconSelector
                  icons={icons}
                  iconsWithCollections={iconsWithCollections}
                  collection={selectedCollection}
                  color={color}
                  selectedIcon={selectedIcon}
                  onSelectIcon={onSelectIcon}
                  showCollectionBadge={searchInAll && iconsWithCollections.length > 0}
                />
              </IconGridWrapper>
              {hasMore && (
                <div ref={loadMoreRef} style={{ padding: '20px', textAlign: 'center' }}>
                  {loadingMore && <LoadingState>Loading more icons...</LoadingState>}
                </div>
              )}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <FooterRow>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <ColorLabel>Color:</ColorLabel>
              <ColorInput
                type="color"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                onFocus={() => {
                  isColorPickerActive.current = true;
                }}
                onBlur={() => {
                  setTimeout(() => {
                    isColorPickerActive.current = false;
                  }, 200);
                }}
              />
            </div>
            {icons.length > 0 && (
              <IconCountInfo>
                <span>
                  Showing {icons.length}{totalIcons > 0 && !searchInAll && !search ? ` of ${totalIcons}` : ''} icons
                  {searchInAll ? ' from all collections' : ` from ${selectedCollection}`}
                </span>
                {loading && <UpdateIndicator>Updating...</UpdateIndicator>}
              </IconCountInfo>
            )}
          </FooterRow>
          <FooterCopyright>
            © {new Date().getFullYear()} <strong>BetterIcons</strong> by <a href="https://niteshbabu.tech" target="_blank" rel="noopener noreferrer">NiteshBabu</a>
          </FooterCopyright>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};
