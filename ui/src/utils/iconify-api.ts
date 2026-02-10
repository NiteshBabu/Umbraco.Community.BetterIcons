const svgCache = new Map<string, string>();

export const fetchIconSvg = async (iconName: string): Promise<string> => {
  if (svgCache.has(iconName)) {
    return svgCache.get(iconName)!;
  }

  try {
    const url = `https://api.iconify.design/${iconName}.svg?color=currentColor&width=32&height=32`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${iconName}`);
    }
    
    const svg = await response.text();
    
    if (!svg || !svg.includes('<svg')) {
      throw new Error(`Invalid SVG response for ${iconName}`);
    }
    
    svgCache.set(iconName, svg);
    return svg;
  } catch (error) {
    throw error;
  }
};


export const searchIcons = async (
  collection: string,
  query: string = '',
  limit: number = 200,
  start: number = 0
): Promise<{ icons: string[], total: number }> => {
  try {
    const baseUrl = 'https://api.iconify.design';
    
    if (query) {
      const url = `${baseUrl}/search?query=${encodeURIComponent(query)}&prefix=${collection}&limit=${limit}&start=${start}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const iconsList = data.icons || [];
      
      return { icons: cleanIconNames(iconsList), total: data.total || iconsList.length };
    } else {
      const url = `${baseUrl}/collection?prefix=${collection}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      let iconsList: string[] = [];
      let totalCount = 0;
      
      if (data.uncategorized) {
        totalCount = data.uncategorized.length;
        iconsList = data.uncategorized.slice(start, start + limit);
      } else {
        const allIcons: string[] = [];
        if (data.categories) {
          Object.values(data.categories).forEach((icons: unknown) => {
            if (Array.isArray(icons)) {
              allIcons.push(...icons);
            }
          });
        }
        
        if (allIcons.length === 0 && Array.isArray(data.icons)) {
          allIcons.push(...data.icons);
        }
        
        totalCount = allIcons.length;
        iconsList = allIcons.slice(start, start + limit);
      }
      
      return { icons: cleanIconNames(iconsList), total: totalCount };
    }
  } catch (error) {
    throw error;
  }
};


const cleanIconNames = (icons: string[]): string[] => {
  return icons.map((icon: string) => {
    if (icon.includes(':')) {
      return icon.split(':')[1]; 
    }
    return icon;
  });
};


export const searchAllCollections = async (
  query: string,
  collections: string[],
  limit: number = 50,
  start: number = 0
): Promise<Array<{ icon: string; collection: string }>> => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const baseUrl = 'https://api.iconify.design';
    const searchUrl = `${baseUrl}/search?query=${encodeURIComponent(query)}&limit=${limit}&start=${start}`;
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const iconsList = data.icons || [];
    
    const iconsWithCollections: Array<{ icon: string; collection: string }> = [];
    
    for (const fullIconName of iconsList) {
      const parts = fullIconName.split(':');
      if (parts.length === 2) {
        const [collection, iconName] = parts;
        if (collections.includes(collection)) {
          iconsWithCollections.push({
            icon: iconName,
            collection
          });
        }
      }
    }
    
    return iconsWithCollections;
  } catch (error) {
    throw error;
  }
};
