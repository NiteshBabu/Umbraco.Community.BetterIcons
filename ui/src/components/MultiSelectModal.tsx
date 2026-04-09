import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FooterCopyright, FooterRow, IconCountInfo, ModalFooter, UpdateIndicator } from '../styles';
import { POPULAR_COLLECTIONS } from '../types';
import { searchAllCollections, searchIcons } from '../utils';
import { IconModal } from './IconModal';
import { MultiSelectIconSelector } from './MultiSelectIconSelector';

const MODAL_ANIMATION_DURATION_MS = 350;

interface IconWithCollection {
  icon: string;
  collection: string;
}

interface MultiSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIconsSelected: (icons: string[]) => void;
}

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  ${props => props.$variant === 'primary' ? `
    background: #3544b1;
    color: white;
    &:hover {
      background: #2a3a9f;
    }
  ` : `
    background: white;
    color: #333;
    border: 1px solid #ddd;
    &:hover {
      background: #f5f5f5;
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/**
 * Modal for selecting multiple icons for registration
 */
export const MultiSelectModal = ({ isOpen, onClose, onIconsSelected }: MultiSelectModalProps) => {
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
  const [totalIcons, setTotalIcons] = useState<number>(0);
  const [selectedIcons, setSelectedIcons] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setSelectedIcons([]);
    }
  }, [isOpen]);

  const toggleIconSelection = (iconName: string) => {
    setSelectedIcons(prev => {
      if (prev.includes(iconName)) {
        return prev.filter(i => i !== iconName);
      } else {
        return [...prev, iconName];
      }
    });
  };

  const handleConfirm = () => {
    onIconsSelected(selectedIcons);
    setIsAnimating(false);
    setTimeout(onClose, MODAL_ANIMATION_DURATION_MS);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, MODAL_ANIMATION_DURATION_MS);
  };

  useEffect(() => {
    if (!isOpen) return;

    const loadIcons = async () => {
      setLoading(true);
      setError(null);
      setHasMore(true);
      setIcons([]);
      setIconsWithCollections([]);
      setTotalIcons(0);
      
      try {
        if (searchInAll && search) {
          const allCollections = POPULAR_COLLECTIONS.map(c => c.prefix);
          const results = await searchAllCollections(search, allCollections, 200, 0);
          setIconsWithCollections(results);
          setIcons(results.map(r => r.icon));
          setHasMore(results.length === 200);
        } else {
          const result = await searchIcons(selectedCollection, search, 200, 0);
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
  }, [selectedCollection, search, isOpen, searchInAll]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;

    setLoadingMore(true);
    try {
      const offset = icons.length;
      
      if (searchInAll && search) {
        const allCollections = POPULAR_COLLECTIONS.map(c => c.prefix);
        const results = await searchAllCollections(search, allCollections, 200, offset);
        setIconsWithCollections(prev => [...prev, ...results]);
        setIcons(prev => [...prev, ...results.map(r => r.icon)]);
        setHasMore(results.length === 200);
      } else {
        const result = await searchIcons(selectedCollection, search, 200, offset);
        setIcons(prev => [...prev, ...result.icons]);
        setHasMore(result.icons.length === 200);
      }
    } catch (err) {
      console.error('Failed to load more icons:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [icons, loadingMore, hasMore, selectedCollection, search, searchInAll, loading]);

  return (
    <>
      {isOpen && (
        <IconModal
          isOpen={isOpen}
          isAnimating={isAnimating}
          selectedIcon={null}
          color="#000000"
          onClose={(e) => { 
            e.preventDefault();
            e.stopPropagation(); 
            handleClose();
          }}
          onSelectIcon={() => {}} // Not used in multi-select
          onColorChange={() => {}} // Not used for registration
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
          isColorPickerActive={{ current: false }}
          hideColorPicker={true}
          customIconSelector={
            <MultiSelectIconSelector
              icons={icons}
              iconsWithCollections={iconsWithCollections}
              collection={selectedCollection}
              color="#000000"
              selectedIcons={selectedIcons}
              onToggleIcon={toggleIconSelection}
              showCollectionBadge={searchInAll}
            />
          }
          customFooter={
            <ModalFooter>
              <FooterRow>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
                    {selectedIcons.length} icon(s) selected
                  </span>
                  {icons.length > 0 && (
                    <IconCountInfo>
                      <span>
                        Showing {icons.length}{totalIcons > 0 && !searchInAll && !search ? ` of ${totalIcons}` : ''} icons
                        {searchInAll ? ' from all collections' : ` from ${selectedCollection}`}
                      </span>
                      {loading && <UpdateIndicator>Updating...</UpdateIndicator>}
                    </IconCountInfo>
                  )}
                </div>
                <ActionButtons>
                  <Button $variant="secondary" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button 
                    $variant="primary" 
                    onClick={handleConfirm}
                    disabled={selectedIcons.length === 0}
                  >
                    Register {selectedIcons.length} Icon(s)
                  </Button>
                </ActionButtons>
              </FooterRow>
              <FooterCopyright>
                © {new Date().getFullYear()} <strong>BetterIcons</strong> by <a href="https://niteshbabu.tech" target="_blank" rel="noopener noreferrer">NiteshBabu</a>
              </FooterCopyright>
            </ModalFooter>
          }
        />
      )}
    </>
  );
};