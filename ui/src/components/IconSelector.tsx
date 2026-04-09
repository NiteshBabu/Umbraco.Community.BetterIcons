import { useEffect, useRef, useState } from 'react';
import { CollectionBadge, CollectionGroup, CollectionGroupHeader, IconButton, IconGrid, IconGridGrouped, IconGridInner } from '../styles';
import { POPULAR_COLLECTIONS } from '../types';
import { IconDisplay } from './IconDisplay';

interface IconWithCollection {
  icon: string;
  collection: string;
}

interface IconSelectorProps {
  icons: string[];
  iconsWithCollections: IconWithCollection[];
  collection: string;
  color: string;
  selectedIcon: string | null;
  onSelectIcon: (iconName: string, collection?: string) => void;
  showCollectionBadge?: boolean;
}

const ITEM_SIZE = 60; 
const MIN_ICON_SIZE = 52;
const GAP_SIZE = 8;
const ITEMS_PER_ROW = 10;
const BUFFER_SIZE = 2; 


export const IconSelector = ({
  icons,
  iconsWithCollections,
  collection,
  color,
  selectedIcon,
  onSelectIcon,
  showCollectionBadge = false,
}: IconSelectorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 100 });
  const [itemsPerRow, setItemsPerRow] = useState(ITEMS_PER_ROW);
  const [calculatedItemSize, setCalculatedItemSize] = useState(ITEM_SIZE);

  const getIconData = (index: number) => {
    if (showCollectionBadge && iconsWithCollections.length > 0) {
      return iconsWithCollections[index];
    }
    return { icon: icons[index], collection };
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
        
        // Total gaps = (items - 1) * GAP_SIZE
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
      const end = Math.min(icons.length, endRow * itemsPerRow);

      setVisibleRange({ start, end });
    };

    handleScroll(); 
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [icons.length, itemsPerRow, groupedIcons, calculatedItemSize]);

  // Render grouped icons
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
                const isSelected = selectedIcon === fullIconName;

                return (
                  <IconButton
                    key={`${iconData.collection}-${iconData.icon}-${index}`}
                    $selected={isSelected}
                    onClick={() => onSelectIcon(iconData.icon, iconData.collection)}
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
                  </IconButton>
                );
              })}
            </IconGridGrouped>
          </CollectionGroup>
        ))}
      </IconGrid>
    );
  }

  const totalRows = Math.ceil(icons.length / itemsPerRow);
  const totalHeight = totalRows * (calculatedItemSize + GAP_SIZE);

  const visibleIcons = icons.slice(visibleRange.start, visibleRange.end);

  return (
    <IconGrid>
      <IconGridInner ref={containerRef} style={{ minHeight: `${totalHeight}px` }}>
        {visibleIcons.map((_, index) => {
          const actualIndex = visibleRange.start + index;
          const iconData = getIconData(actualIndex);
          const fullIconName = `${iconData.collection}:${iconData.icon}`;
          const isSelected = selectedIcon === fullIconName;

          const row = Math.floor(actualIndex / itemsPerRow);
          const col = actualIndex % itemsPerRow;
          const top = row * (calculatedItemSize + GAP_SIZE);
          const left = col * (calculatedItemSize + GAP_SIZE);

        return (
          <IconButton
            key={`${iconData.collection}-${iconData.icon}-${actualIndex}`}
            selected={isSelected}
            onClick={() => onSelectIcon(iconData.icon, iconData.collection)}
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
              width={Math.min(24, calculatedItemSize * 0.5)}
              height={Math.min(24, calculatedItemSize * 0.5)}
            />
            {showCollectionBadge && (
              <CollectionBadge>{iconData.collection}</CollectionBadge>
            )}
          </IconButton>
        );
      })}
      </IconGridInner>
    </IconGrid>
  );
};
