import styled from 'styled-components';
import { IconButton, IconGrid, IconGridGrouped } from '../styles';
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
  const renderIcons = showCollectionBadge && iconsWithCollections.length > 0
    ? iconsWithCollections
    : icons.map(icon => ({ icon, collection }));

  return (
    <IconGrid>
      <IconGridGrouped>
        {renderIcons.map((iconData, index) => {
          const fullIconName = typeof iconData === 'string' 
            ? `${collection}:${iconData}`
            : `${iconData.collection}:${iconData.icon}`;
          
          const isSelected = selectedIcons.includes(fullIconName);
          const selectionIndex = selectedIcons.indexOf(fullIconName) + 1;

          return (
   <MultiSelectIconButton
              key={`${fullIconName}-${index}`}
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
    </IconGrid>
  );
};
