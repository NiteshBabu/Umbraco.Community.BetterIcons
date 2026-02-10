import { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContainer, TabScrollButton, TabsScrollWrapper } from '../styles';

interface TabsWithScrollProps {
  children: React.ReactNode;
  activeKey?: string;
}

/**
 * Tabs container 
 */
export const TabsWithScroll = ({ children, activeKey }: TabsWithScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => checkScroll();
    el.addEventListener('scroll', handleScroll);
    
    // Check on resize
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    checkScroll();
  }, [children]);

  useEffect(() => {
    if (!activeKey || !scrollRef.current || !tabsRef.current) return;

    const activeButton = tabsRef.current.querySelector(`button[data-key="${activeKey}"]`) as HTMLElement;
    if (!activeButton) return;

    const container = scrollRef.current;
    const buttonLeft = activeButton.offsetLeft;
    const buttonWidth = activeButton.offsetWidth;
    const containerWidth = container.clientWidth;

    const targetScroll = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);

    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
  }, [activeKey]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.7; // Scroll 70% of visible width
    const targetScroll = direction === 'left' 
      ? el.scrollLeft - scrollAmount
      : el.scrollLeft + scrollAmount;

    el.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  return (
    <TabsContainer>
      <TabScrollButton
        direction="left"
        disabled={!canScrollLeft}
        onClick={() => scroll('left')}
        type="button"
        aria-label="Scroll tabs left"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </TabScrollButton>

      <TabsScrollWrapper ref={scrollRef}>
        <Tabs ref={tabsRef}>{children}</Tabs>
      </TabsScrollWrapper>

      <TabScrollButton
        direction="right"
        disabled={!canScrollRight}
        onClick={() => scroll('right')}
        type="button"
        aria-label="Scroll tabs right"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </TabScrollButton>
    </TabsContainer>
  );
};
