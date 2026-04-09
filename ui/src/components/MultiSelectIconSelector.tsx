import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { CollectionBadge, CollectionGroup, CollectionGroupHeader, IconButton, IconGrid, IconGridGrouped, IconGridInner } from '../styles';
import { POPULAR_COLLECTIONS } from '../types';
import { IconDisplay } from './IconDisplay';

interface IconWithCollection {
  icon: string;
  collection: string;
}

interface MultiSelectIconSelectorProps {
  icons: string[];
  iconsWithCollections: IconWithCollection[];
  collection: string;
  color: string;
  selectedIcons: string[];
  onToggleIcon: (iconName: string) => void;
  showCollectionBadge?: boolean;
}

const ITEM_SIZE = 60;
const MIN_ICON_SIZE = 52;
const GAP_SIZE = 8;
const ITEMS_PER_ROW = 10;
const BUFFER_SIZE = 2;

const SelectionBadge = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  background: #3544b1;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  pointer-events: none;
  z-index: 1;
`;

const MultiSelectIconButton = styled(IconButton)`
  position: relative;
`;

/**
 * Icon selector with multi-select capability for icon registration
 */
export const MultiSelectIconSelector = ({
  icons,
  iconsWithCollections,
  collection,
  color,
  selectedIcons,
  onToggleIcon,
  showCollectionBadge = false,
}: MultiSelectIconSelectorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 100 });
  const [itemsPerRow, setItemsPerRow] = useState(ITEMS_PER_ROW);
  const [calculatedItemSize, setCalculatedItemSize] = useState(ITEM_SIZE);

  const renderIcons = showCollectionBadge && iconsWithCollections.length > 0
    ? iconsWithCollections
    : icons.map(icon => ({ icon, collection }));

  const getIconData = (index: number) => {
    return renderIcons[index];
  };

  const groupedIcons = showCollectionBadge && iconsWithCollections.length > 0
    ? iconsWithCollections.reduce((groups, iconData) => {
        const collectionName = iconData.collection;
        if (!groups[collectionName]) {
          groups[collectionName] = [];
        }
        groups[collectionName].push(iconData);
        return groups;
      }, {} as Record<string, IconWithCollection[]>)
    : null;

  const getCollectionName = (prefix: string) => {
    const collectionInfo = POPULAR_COLLECTIONS.find(c => c.prefix === prefix);
    return collectionInfo?.name || prefix;
  };

  // Calculate items per row and item size to fit perfectly
  useEffect(() => {
    const updateItemsPerRow = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        
        const minItemsPerRow = Math.floor((containerWidth + GAP_SIZE) / (MIN_ICON_SIZE + GAP_SIZE));
        const actualItemsPerRow = Math.max(1, minItemsPerRow);
        
        const totalGapSpace = (actualItemsPerRow - 1) * GAP_SIZE;
        const availableSpaceForIcons = containerWidth - totalGapSpace;
        const perfectItemSize = availableSpaceForIcons / actualItemsPerRow;
        
        setItemsPerRow(actualItemsPerRow);
        setCalculatedItemSize(perfectItemSize);
      }
    };

    updateItemsPerRow();
    window.addEventListener('resize', updateItemsPerRow);
    return () => window.removeEventListener('resize', updateItemsPerRow);
  }, []);

  useEffect(() => {
    if (groupedIcons) return;

    const container = containerRef.current?.parentElement;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      const rowHeight = calculatedItemSize + GAP_SIZE;
      const startRow = Math.floor(scrollTop / rowHeight) - BUFFER_SIZE;
      const endRow = Math.ceil((scrollTop + containerHeight) / rowHeight) + BUFFER_SIZE;

      const start = Math.max(0, startRow * itemsPerRow);
      const end = Math.min(renderIcons.length, endRow * itemsPerRow);

      setVisibleRange({ start, end });
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [renderIcons.length, itemsPerRow, groupedIcons, calculatedItemSize]);

  if (groupedIcons) {
    return (
      <IconGrid>
        {Object.entries(groupedIcons).map(([collectionPrefix, collectionIcons]) => (
          <CollectionGroup key={collectionPrefix}>
            <CollectionGroupHeader>
              <span>{getCollectionName(collectionPrefix)}</span>
              <span>{collectionIcons.length} icons</span>
            </CollectionGroupHeader>
            <IconGridGrouped>
              {collectionIcons.map((iconData, index) => {
                const fullIconName = `${iconData.collection}:${iconData.icon}`;
                const isSelected = selectedIcons.includes(fullIconName);
                const selectionIndex = selectedIcons.indexOf(fullIconName) + 1;

                return (
                  <MultiSelectIconButton
                    key={`${iconData.collection}-${iconData.icon}-${index}`}
                    $selected={isSelected}
                    onClick={() => onToggleIcon(fullIconName)}
                    type="button"
                    title={fullIconName}
                    style={{
                      width: '52px',
                      height: '52px'
                    }}
                  >
                    <IconDisplay
                      icon={fullIconName}
                      color={color}
                      width={34}
                      height={34}
                    />
                    {isSelected && (
                      <SelectionBadge>{selectionIndex}</SelectionBadge>
                    )}
                  </MultiSelectIconButton>
                );
              })}
            </IconGridGrouped>
          </CollectionGroup>
        ))}
      </IconGrid>
    );
  }

  const totalRows = Math.ceil(renderIcons.length / itemsPerRow);
  const totalHeight = totalRows * (calculatedItemSize + GAP_SIZE);

  const visibleIcons = renderIcons.slice(visibleRange.start, visibleRange.end);

  return (
    <IconGrid>
      <IconGridInner ref={containerRef} style={{ minHeight: `${totalHeight}px` }}>
        {visibleIcons.map((_, index) => {
          const actualIndex = visibleRange.start + index;
          const iconData = getIconData(actualIndex);
          const fullIconName = `${iconData.collection}:${iconData.icon}`;
          const isSelected = selectedIcons.includes(fullIconName);
          const selectionIndex = selectedIcons.indexOf(fullIconName) + 1;

          const row = Math.floor(actualIndex / itemsPerRow);
          const col = actualIndex % itemsPerRow;
          const top = row * (calculatedItemSize + GAP_SIZE);
          const left = col * (calculatedItemSize + GAP_SIZE);

          return (
            <MultiSelectIconButton
              key={`${iconData.collection}-${iconData.icon}-${actualIndex}`}
              $selected={isSelected}
              onClick={() => onToggleIcon(fullIconName)}
              type="button"
              title={fullIconName}
              style={{
                position: 'absolute',
                top: `${top}px`,
                left: `${left}px`,
                width: `${calculatedItemSize}px`,
                height: `${calculatedItemSize}px`
              }}
            >
              <IconDisplay
                icon={fullIconName}
                color={color}
                width={Math.min(34, calculatedItemSize * 0.6)}
                height={Math.min(34, calculatedItemSize * 0.6)}
              />
              {isSelected && (
                <SelectionBadge>{selectionIndex}</SelectionBadge>
              )}
              {showCollectionBadge && (
                <CollectionBadge>{iconData.collection}</CollectionBadge>
              )}
            </MultiSelectIconButton>
          );
        })}
      </IconGridInner>
    </IconGrid>
  );
};
