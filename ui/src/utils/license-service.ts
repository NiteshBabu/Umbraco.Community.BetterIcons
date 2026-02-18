import type { CollectionLicenseInfo } from '../types';


const licenseCache = new Map<string, CollectionLicenseInfo>();

let collectionsCache: Record<string, IconifyCollectionData> | null = null;

let collectionsPromise: Promise<Record<string, IconifyCollectionData>> | null = null;

interface IconifyCollectionData {
  name: string;
  author?: {
    name?: string;
  };
  license?: {
    spdx?: string;
    title?: string;
    url?: string;
  };
  total?: number;
  category?: string;
}


const loadCollections = async (): Promise<Record<string, IconifyCollectionData>> => {
  if (collectionsCache !== null) {
    return collectionsCache;
  }

  if (collectionsPromise !== null) {
    return collectionsPromise;
  }

  collectionsPromise = (async () => {
    try {
      const url = 'https://raw.githubusercontent.com/iconify/icon-sets/master/collections.json';
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Record<string, IconifyCollectionData> = await response.json();
      
      collectionsCache = data;
      
      return data;
    } catch (error) {
      console.error('[BetterIcons] Failed to fetch collections metadata:', error);
      
      collectionsPromise = null;
      
      return {};
    }
  })();

  return collectionsPromise;
};


export const getCollectionLicense = async (collection: string): Promise<CollectionLicenseInfo> => {
  if (licenseCache.has(collection)) {
    return licenseCache.get(collection)!;
  }

  try {
    const collections = await loadCollections();
    
    const collectionData = collections[collection];

    if (!collectionData) {
      console.warn(`[BetterIcons] Collection "${collection}" not found in metadata`);
      
      const fallbackInfo: CollectionLicenseInfo = {
        collection,
        name: collection,
        license: 'Unknown',
        licenseTitle: 'License information unavailable',
      };
      
      licenseCache.set(collection, fallbackInfo);
      
      return fallbackInfo;
    }

    const licenseData = collectionData.license;
    const licenseSpdx = licenseData?.spdx || licenseData?.title || 'Unknown';
    const licenseTitle = licenseData?.title || licenseSpdx;
    const licenseUrl = licenseData?.url;

    const licenseInfo: CollectionLicenseInfo = {
      collection,
      name: collectionData.name || collection,
      license: licenseSpdx,
      licenseTitle: licenseTitle,
      licenseUrl: licenseUrl,
    };

    licenseCache.set(collection, licenseInfo);

    return licenseInfo;
  } catch (error) {
    console.error(`[BetterIcons] Failed to fetch license for collection ${collection}:`, error);
    
    const fallbackInfo: CollectionLicenseInfo = {
      collection,
      name: collection,
      license: 'Unknown',
      licenseTitle: 'License information unavailable',
    };
    
    licenseCache.set(collection, fallbackInfo);
    
    return fallbackInfo;
  }
};


export const getMultipleCollectionLicenses = async (
  collections: string[]
): Promise<CollectionLicenseInfo[]> => {
  const promises = collections.map(collection => getCollectionLicense(collection));
  return Promise.all(promises);
};

export const clearLicenseCache = (): void => {
  licenseCache.clear();
};

export const isLicenseCached = (collection: string): boolean => {
  return licenseCache.has(collection);
};

export const getLicenseCacheSize = (): number => {
  return licenseCache.size;
};
