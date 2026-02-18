export { fetchIconSvg, searchAllCollections, searchIcons } from './iconify-api';
export {
  categorizeLicense,
  configureLicenseCompliance, COPYLEFT_LICENSES, getLicenseComplianceConfig,
  getLicenseIndicator,
  getLicenseRestrictionReason,
  isLicenseAllowed,
  isLicenseEnforcementEnabled, PERMISSIVE_LICENSES, resetLicenseComplianceConfig, RESTRICTIVE_LICENSES, type LicenseCategory,
  type LicenseComplianceConfig
} from './license-filter';
export {
  clearLicenseCache, getCollectionLicense, getLicenseCacheSize, getMultipleCollectionLicenses, isLicenseCached
} from './license-service';
export { useDebounce, useThrottle } from './useDebounce';
export { parseIconValue, stringifyIconValue } from './value-parser';


