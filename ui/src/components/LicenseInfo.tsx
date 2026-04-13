import { useLicenseInfo } from '../hooks/useLicenseInfo';
import {
  LicenseBadge,
  LicenseContainer,
  LicenseLabel,
  LicenseLink,
  LicenseLoadingText,
  LicenseWarningMessage,
} from '../styles';
import { categorizeLicense, getLicenseIndicator, getLicenseRestrictionReason, isLicenseAllowed } from '../utils';

interface LicenseInfoProps {
  collection: string;
  compact?: boolean;
}

export const LicenseInfo = ({ collection, compact = false }: LicenseInfoProps) => {
  const { license, isLoading } = useLicenseInfo(collection);

  if (isLoading) {
    return (
      <LicenseContainer>
        <LicenseLoadingText>Loading license info...</LicenseLoadingText>
      </LicenseContainer>
    );
  }

  if (!license || license.license === 'Unknown') {
    return (
      <LicenseContainer>
        <LicenseLabel>License:</LicenseLabel>
        <LicenseBadge $category="unknown" $allowed={true}>
          ? Unknown
        </LicenseBadge>
      </LicenseContainer>
    );
  }

  const category = categorizeLicense(license.license);
  const allowed = isLicenseAllowed(license.license);
  const indicator = getLicenseIndicator(license.license);
  const restrictionReason = getLicenseRestrictionReason(license.license);

  return (
    <div>
      <LicenseContainer>
        <LicenseLabel>License:</LicenseLabel>
        <LicenseBadge $category={category} $allowed={allowed}>
          {indicator} {license.license}
        </LicenseBadge>
        {!compact && license.licenseUrl && (
          <LicenseLink
            href={license.licenseUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
          </LicenseLink>
        )}
      </LicenseContainer>
      {!allowed && restrictionReason && (
        <LicenseWarningMessage>
          ⚠ {restrictionReason}
        </LicenseWarningMessage>
      )}
    </div>
  );
};

export const LicenseBadgeCompact = ({ collection }: { collection: string }) => {
  const { license, isLoading } = useLicenseInfo(collection);

  if (isLoading || !license) {
    return null;
  }

  const category = categorizeLicense(license.license);
  const allowed = isLicenseAllowed(license.license);
  const indicator = getLicenseIndicator(license.license);

  return (
    <LicenseBadge
      category={category}
      allowed={allowed}
      title={`${license.license} - ${license.licenseTitle}`}
      style={{ fontSize: '10px', padding: '1px 6px' }}
    >
      {indicator}
    </LicenseBadge>
  );
};
