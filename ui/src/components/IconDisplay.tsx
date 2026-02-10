import { memo, useEffect, useState } from 'react';
import { IconErrorPlaceholder, IconLoadingPlaceholder, IconWrapper } from '../styles';
import { fetchIconSvg } from '../utils/iconify-api';

interface IconDisplayProps {
  icon: string;
  color: string;
  width?: number;
  height?: number;
}

/**
 * Displays an icon from BetterIcons with the specified color
 * Memoized to prevent unnecessary re-renders
 */
export const IconDisplay = memo(({ icon, color, width = 32, height = 32 }: IconDisplayProps) => {
  const [svg, setSvg] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(false);
    
    fetchIconSvg(icon)
      .then((svgData) => {
        if (mounted) {
          setSvg(svgData);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      });
    
    return () => {
      mounted = false;
    };
  }, [icon]);

  if (loading) {
    return <IconLoadingPlaceholder width={width} height={height} />;
  }

  if (error || !svg) {
    return <IconErrorPlaceholder width={width} height={height} />;
  }

  return (
    <IconWrapper
      width={width}
      height={height}
      color={color}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
});
