import { useEffect, useState } from 'react';
import type { CollectionLicenseInfo } from '../types';
import { getCollectionLicense } from '../utils/license-service';

export const useLicenseInfo = (collection: string | null) => {
  const [license, setLicense] = useState<CollectionLicenseInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!collection) {
      setLicense(null);
      return;
    }

    let isMounted = true;

    const fetchLicense = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const licenseInfo = await getCollectionLicense(collection);
        if (isMounted) {
          setLicense(licenseInfo);
          
          if (licenseInfo.license === 'Unknown') {
            console.warn(`[BetterIcons] Could not determine license for ${collection}`);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch license'));
          console.error(`[BetterIcons] Error fetching license for ${collection}:`, err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLicense();

    return () => {
      isMounted = false;
    };
  }, [collection]);

  return { license, isLoading, error };
};


export const useMultipleLicenses = (collections: string[]) => {
  const [licenses, setLicenses] = useState<Map<string, CollectionLicenseInfo>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (collections.length === 0) {
      return;
    }

    let isMounted = true;

    const fetchLicenses = async () => {
      setIsLoading(true);

      const newLicenses = new Map<string, CollectionLicenseInfo>();
      
      await Promise.all(
        collections.map(async (collection) => {
          try {
            const licenseInfo = await getCollectionLicense(collection);
            if (isMounted) {
              newLicenses.set(collection, licenseInfo);
            }
          } catch (err) {
            console.error(`Failed to fetch license for ${collection}:`, err);
          }
        })
      );

      if (isMounted) {
        setLicenses(newLicenses);
        setIsLoading(false);
      }
    };

    fetchLicenses();

    return () => {
      isMounted = false;
    };
  }, [collections]);

  return { licenses, isLoading };
};
