export type LicenseCategory = 'permissive' | 'copyleft' | 'restrictive' | 'unknown';

export const PERMISSIVE_LICENSES = [
  'MIT',
  'Apache-2.0',
  'Apache 2.0',
  'ISC',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'CC0-1.0',
  'CC-BY-4.0',
  'Unlicense',
  'CC-BY-SA-4.0',
] as const;

export const COPYLEFT_LICENSES = [
  'GPL-2.0',
  'GPL-3.0',
  'AGPL-3.0',
  'LGPL-2.1',
  'LGPL-3.0',
  'MPL-2.0',
  'EPL-2.0',
] as const;

export const RESTRICTIVE_LICENSES = [
  'CC-BY-NC-4.0',
  'CC-BY-NC-SA-4.0',
  'Proprietary',
] as const;

export interface LicenseComplianceConfig {
  allowedLicenses?: string[];
  disallowedLicenses?: string[];
  allowPermissive?: boolean;
  allowCopyleft?: boolean;
  allowRestrictive?: boolean;
  allowUnknown?: boolean;
}

const DEFAULT_CONFIG: Required<LicenseComplianceConfig> = {
  allowedLicenses: [],
  disallowedLicenses: [],
  allowPermissive: true,
  allowCopyleft: false,
  allowRestrictive: false,
  allowUnknown: true,
};

let currentConfig: Required<LicenseComplianceConfig> = { ...DEFAULT_CONFIG };


export const configureLicenseCompliance = (config: LicenseComplianceConfig): void => {
  currentConfig = { ...DEFAULT_CONFIG, ...config };
};

export const resetLicenseComplianceConfig = (): void => {
  currentConfig = { ...DEFAULT_CONFIG };
};

export const getLicenseComplianceConfig = (): Required<LicenseComplianceConfig> => {
  return { ...currentConfig };
};

export const categorizeLicense = (license: string): LicenseCategory => {
  const normalizedLicense = license.trim();

  if (PERMISSIVE_LICENSES.includes(normalizedLicense as any)) {
    return 'permissive';
  }

  if (COPYLEFT_LICENSES.includes(normalizedLicense as any)) {
    return 'copyleft';
  }

  if (RESTRICTIVE_LICENSES.includes(normalizedLicense as any)) {
    return 'restrictive';
  }

  return 'unknown';
};

export const isLicenseAllowed = (license: string): boolean => {
  const normalizedLicense = license.trim();

  if (currentConfig.disallowedLicenses.length > 0) {
    if (currentConfig.disallowedLicenses.includes(normalizedLicense)) {
      return false;
    }
  }

  if (currentConfig.allowedLicenses.length > 0) {
    return currentConfig.allowedLicenses.includes(normalizedLicense);
  }

  const category = categorizeLicense(normalizedLicense);

  switch (category) {
    case 'permissive':
      return currentConfig.allowPermissive;
    case 'copyleft':
      return currentConfig.allowCopyleft;
    case 'restrictive':
      return currentConfig.allowRestrictive;
    case 'unknown':
      return currentConfig.allowUnknown;
    default:
      return false;
  }
};


export const getLicenseRestrictionReason = (license: string): string | null => {
  if (isLicenseAllowed(license)) {
    return null;
  }

  const normalizedLicense = license.trim();
  const category = categorizeLicense(normalizedLicense);

  if (currentConfig.disallowedLicenses.includes(normalizedLicense)) {
    return `License "${license}" is explicitly disallowed by compliance policy.`;
  }

  switch (category) {
    case 'copyleft':
      return `Copyleft license "${license}" requires derivative works to use the same license. Enterprise approval required.`;
    case 'restrictive':
      return `Restrictive license "${license}" may require commercial licensing or special permissions.`;
    case 'unknown':
      return `License "${license}" could not be verified. Enterprise compliance review required.`;
    default:
      return `License "${license}" is not allowed by current compliance policy.`;
  }
};

export const getLicenseIndicator = (license: string): string => {
  const category = categorizeLicense(license);

  switch (category) {
    case 'permissive':
      return '✓';
    case 'copyleft':
      return '⚠';
    case 'restrictive':
      return '⊘';
    case 'unknown':
      return '?';
    default:
      return '';
  }
};

export const isLicenseEnforcementEnabled = (): boolean => {
  return (
    currentConfig.disallowedLicenses.length > 0 ||
    currentConfig.allowedLicenses.length > 0 ||
    !currentConfig.allowPermissive ||
    !currentConfig.allowCopyleft ||
    !currentConfig.allowRestrictive ||
    !currentConfig.allowUnknown
  );
};
