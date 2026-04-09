import styled, { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`

export const Container = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  position: relative;
  width: 100%;
`

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
`

// Trigger Button
export const TriggerButton = styled.button<{ hasValue: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: 2px solid ${props => props.hasValue ? '#3544b1' : '#ddd'};
  border-radius: 8px;
  background: ${props => props.hasValue ? '#f8f9ff' : 'white'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: #3544b1;
    background: #f8f9ff;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(53, 68, 177, 0.1);
  }

  svg {
    width: 32px;
    height: 32px;
  }
`

export const PlaceholderIcon = styled.div`
  width: 32px;
  height: 32px;
  border: 2px dashed #ccc;
  border-radius: 4px;
`

export const ClearButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid white;
  background: #ff4444;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s ease;

  &:hover {
    background: #cc0000;
    transform: scale(1.1);
  }
`

// Modal
export const ModalOverlay = styled.div<{ $isAnimating: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: ${props => props.$isAnimating ? 1 : 0};
  transition: opacity 0.3s ease;
`

export const ModalContent = styled.div<{ $isAnimating: boolean }>`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 850px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  opacity: ${props => props.$isAnimating ? 1 : 0};
  transform: ${props => props.$isAnimating ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)'};
  transition: opacity 0.35s ease, transform 0.35s ease;
`

export const ModalHeader = styled.div`
  padding: 10px 24px;
  flex-shrink: 0;
`

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`

export const BrandLogo = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
`

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  flex: 1;
`

export const HeaderLinks = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: auto;
`

export const HeaderLink = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #f5f5f5;
  border-radius: 6px;
  text-decoration: none;
  color: #666;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #3544b1;
    color: white;

    svg {
      fill: white;
    }
  }

  svg {
    width: 16px;
    height: 16px;
    fill: #666;
    transition: fill 0.2s ease;
  }
`

export const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3544b1;
  }

  &::placeholder {
    color: #999;
  }

  &::-webkit-search-cancel-button {
    cursor: pointer;
    -webkit-appearance: none;
    height: 16px;
    width: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E");
    background-size: contain;
  }

  &::-webkit-search-cancel-button:hover {
    opacity: 0.7;
  }
`

export const SearchRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`

export const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  position: relative;
`

export const ToggleCheckbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`

export const ToggleSlider = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  background-color: #ccc;
  border-radius: 22px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    height: 18px;
    width: 18px;
    left: 2px;
    top: 2px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }

  ${ToggleCheckbox}:checked + & {
    background-color: #3544b1;
  }

  ${ToggleCheckbox}:checked + &::before {
    transform: translateX(18px);
  }

  &:hover {
    background-color: ${props => props.htmlFor && (document.getElementById(props.htmlFor) as HTMLInputElement)?.checked ? '#2a3a9f' : '#b3b3b3'};
  }
`

export const ToggleLabel = styled.label`
  font-size: 13px;
  color: #666;
  cursor: pointer;
  user-select: none;
`

export const ModalBody = styled.div`
  overflow-y: auto;
  height: 90vh;

  /* Custom scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: #3544b1 #f0f0f0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #3544b1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #2a3a9f;
  }
`

export const TabsContainer = styled.div`
  position: relative;
  border-bottom: 3px solid #3544b1;
  flex-shrink: 0;
`

export const TabsScrollWrapper = styled.div`
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

export const Tabs = styled.div`
  display: flex;
  gap: 4px;
  padding: 0 24px;
`

export const TabScrollButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction}: 8px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: #3544b1;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    background: #2a3a9f;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(1.05);
  }

  &:disabled {
    opacity: 0;
    cursor: default;
    pointer-events: none;
  }

  svg {
    width: 14px;
    height: 14px;
    transition: transform 0.2s ease;
  }
`

export const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 16px;
  border: none;
  background: ${props => props.$active ? '#3544b1' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#666'};
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#3544b1' : '#f5f5f5'};
  }

  span {
    opacity: 0.7;
    font-size: 11px;
    margin-left: 6px;
  }
`

export const IconGrid = styled.div`
  padding: 0 24px 12px 24px;
`

export const IconGridInner = styled.div`
  position: relative;
`

export const IconGridGrouped = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;
`

export const IconButton = styled.button<{ $selected?: boolean }>`
  aspect-ratio: 1;
  border: 2px solid ${props => props.$selected ? '#3544b1' : '#e5e5e5'};
  border-radius: 8px;
  background: ${props => props.$selected ? '#f8f9ff' : 'white'};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease, background-color 0.2s ease;
  padding: 6px;
  min-height: 52px;
  position: relative;

  &:hover {
    border-color: #3544b1;
    background: #f8f9ff;
  }

  svg, span {
    display: block;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }
`

export const CollectionBadge = styled.span`
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 9px;
  padding: 2px 4px;
  background: #3544b1;
  color: white;
  border-radius: 3px;
  font-weight: 600;
  text-transform: uppercase;
  width: auto !important;
  height: auto !important;
  line-height: 1;
`

export const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-shrink: 0;
`

export const FooterRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const FooterCopyright = styled.div`
  font-size: 12px;
  color: #999;
  text-align: center;
  
  strong {
    color: #666;
    font-weight: 600;
  }
  
  a {
    color: #3544b1;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
    
    &:hover {
      color: #2a3a9f;
      text-decoration: underline;
    }
  }
`

export const ColorInput = styled.input`
  width: 50px;
  height: 38px;
  border: 2px solid #e5e5e5;
  border-radius: 6px;
  cursor: pointer;
  
  &::-webkit-color-swatch-wrapper {
    padding: 2px;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }
`

export const ColorLabel = styled.label`
  font-size: 13px;
  color: #666;
  font-weight: 500;
`

export const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: #999;
`

export const LoadingState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: #666;
  font-size: 14px;
`

export const ErrorState = styled.div`
  padding: 24px;
  margin: 24px;
  background: #fff3f3;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  color: #cc0000;
  font-size: 14px;
`

// Icon Display States
export const IconLoadingPlaceholder = styled.span<{ width: number; height: number }>`
  display: block;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background: #f0f0f0;
`

export const IconErrorPlaceholder = styled.span<{ width: number; height: number }>`
  display: block;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background: #ffeeee;
`

export const IconWrapper = styled.span<{ width: number; height: number; color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  color: ${props => props.color};
`

// Icon Modal Info
export const IconCountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;

  span {
    display: inline-flex;
    align-items: center;
  }
`

export const UpdateIndicator = styled.span`
  font-size: 11px;
  color: #999;
`

export const IconGridWrapper = styled.div<{ $loading: boolean }>`
  opacity: ${props => props.$loading ? 0.6 : 1};
  transition: opacity 0.2s ease;
`

export const CollectionGroupHeader = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #3544b1;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  span:first-child {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  span:last-child {
    font-size: 12px;
    color: #999;
    font-weight: 600;
  }
`

export const CollectionGroup = styled.div`
  margin-bottom: 12px;
`

export const LicenseContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
`

export const LicenseLabel = styled.span`
  font-weight: 500;
  color: #333;
`

export const LicenseBadge = styled.span<{ $category: string; $allowed: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 11px;
  background: ${props => {
    if (!props.$allowed) return '#fee';
    switch (props.$category) {
      case 'permissive': return '#e8f5e9';
      case 'copyleft': return '#fff3e0';
      case 'restrictive': return '#ffebee';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    if (!props.$allowed) return '#c00';
    switch (props.$category) {
      case 'permissive': return '#2e7d32';
      case 'copyleft': return '#f57c00';
      case 'restrictive': return '#c62828';
      default: return '#666';
    }
  }};
`

export const LicenseLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

export const LicenseWarningMessage = styled.div`
  margin-top: 4px;
  padding: 6px 8px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  font-size: 11px;
  color: #856404;
`

export const LicenseLoadingText = styled.span`
  color: #999;
  font-size: 11px;
`
