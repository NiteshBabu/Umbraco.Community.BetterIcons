import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IconDisplay } from './components';
import { MultiSelectModal } from './components/MultiSelectModal';
import { GlobalStyle } from './styles';

const DashboardContainer = styled.div`
  padding: 12px 24px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-top:0;
  margin-bottom: 16px;
  color: #333;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: #3544b1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2a3a9f;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  padding: 8px 12px;
  background: white;
  color: #3544b1;
  border: 1px solid #3544b1;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8f9ff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DangerButton = styled.button`
  padding: 8px 12px;
  background: #ef5350;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #c62828;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ActionBar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const StatusMessage = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: 16px;
  border-radius: 6px;
  margin-top: 24px;
  font-size: 1rem;
  
  ${props => {
    if (props.type === 'success') {
      return `
        background: #e8f5e9;
        color: #2e7d32;
        border: 1px solid #4caf50;
      `;
    }
    if (props.type === 'error') {
      return `
        background: #ffebee;
        color: #c62828;
        border: 1px solid #ef5350;
      `;
    }
    return `
      background: #f8f9ff;
      color: #3544b1;
      border: 1px solid #3544b1;
    `;
  }}
`;

const IconList = styled.div`
  margin-top: 24px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const IconItem = styled.div<{ $selected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: white;
  border: 2px solid ${props => props.$selected ? '#3544b1' : 'transparent'};
  border-radius: 8px;
  font-size: 12px;
  color: #666;
  transition: all 0.2s;
  position: relative;
  cursor: pointer;
  
  &:hover {
    border-color: #3544b1;
    box-shadow: 0 2px 8px rgba(53, 68, 177, 0.1);
  }
`;

const IconCheckbox = styled.input`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`;

const IconName = styled.div`
  font-family: monospace;
  font-size: 11px;
  color: #666;
  text-align: center;
  word-break: break-all;
  max-width: 100%;
`;

interface BetterIconManagementDashboardProps {
}

export const BetterIconsManagementDashboard = (props: BetterIconManagementDashboardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedIcons, setSelectedIcons] = useState<string[]>([]);
  const [pendingModalSelections, setPendingModalSelections] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  const [registeredIcons, setRegisteredIcons] = useState<string[]>([]);

  useEffect(() => {
    const loadRegisteredIcons = async () => {
      try {
        const response = await fetch('/umbraco/backoffice/api/bettericons/registered');
        if (response.ok) {
          const result = await response.json();
          if (result.icons && Array.isArray(result.icons)) {
            setRegisteredIcons(result.icons);
          }
        }
      } catch (error) {
        console.error('Failed to load registered icons:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRegisteredIcons();
  }, []);

  const handleIconsSelected = async (icons: string[]) => {
    setRegistering(true);
    setStatusMessage(null);
    setPendingModalSelections([]);

    try {
      const response = await fetch('/umbraco/backoffice/api/bettericons/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ icons }),
      });

      if (!response.ok) {
        throw new Error('Failed to register icons');
      }

      const result = await response.json();

      setStatusMessage({
        type: 'success',
        message: result.message || `Successfully registered ${result.registered} icon(s)! Please restart your Umbraco application to see the icons in the picker. ${result.failed > 0 ? `(${result.failed} failed)` : ''}`,
      });

      // Merge new icons with existing ones
      if (result.registeredIcons && result.registeredIcons.length > 0) {
        setRegisteredIcons(prev => {
          const combined = [...prev, ...result.registeredIcons];
          // Remove duplicates
          return Array.from(new Set(combined));
        });
      }
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message: 'Failed to register icons. Please try again.',
      });
    } finally {
      setRegistering(false);
    }
  };

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
    setSelectedIcons([]);
    setStatusMessage(null);
  };

  const handleToggleIconSelection = (iconAlias: string) => {
    setSelectedIcons(prev => {
      if (prev.includes(iconAlias)) {
        return prev.filter(i => i !== iconAlias);
      } else {
        return [...prev, iconAlias];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedIcons.length === registeredIcons.length) {
      setSelectedIcons([]);
    } else {
      setSelectedIcons([...registeredIcons]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIcons.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedIcons.length} icon(s)? You will need to restart Umbraco for changes to take effect.`)) {
      return;
    }

    setDeleting(true);
    setStatusMessage(null);

    try {
      const response = await fetch('/umbraco/backoffice/api/bettericons/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ iconAliases: selectedIcons }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete icons');
      }

      const result = await response.json();

      setStatusMessage({
        type: 'success',
        message: result.message || `Successfully deleted ${result.deleted} icon(s). Please restart your Umbraco application for changes to take effect.`,
      });

      // Remove deleted icons from the list
      setRegisteredIcons(prev => prev.filter(icon => !selectedIcons.includes(icon)));
      setSelectedIcons([]);
      setEditMode(false);
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message: 'Failed to delete icons. Please try again.',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <DashboardContainer>
        <Card>

          <CardTitle>Register Better Icons</CardTitle>
          <CardDescription>
            Click below to open the icon picker. Select multiple icons from any collection (Material Design Icons, Phosphor, Heroicons, etc.)
            and they will be registered in your Umbraco installation. Once registered, these icons will appear in the standard Umbraco icon picker
            with the prefix <code>bi-</code> (e.g., <code>bi-mdi--home</code>).
          </CardDescription>

          <Button onClick={() => setIsModalOpen(true)} disabled={registering || loading}>
            {registering ? 'Registering...' : loading ? 'Loading...' : 'Select Icons to Register'}
          </Button>
          {statusMessage && (
            <StatusMessage type={statusMessage.type}>
              {statusMessage.message}
            </StatusMessage>
          )}

          {registeredIcons.length > 0 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
                  Registered Icons ({registeredIcons.length}):
                </h3>
                <SecondaryButton onClick={handleToggleEditMode} disabled={loading}>
                  {editMode ? 'Cancel' : 'Manage Icons'}
                </SecondaryButton>
              </div>

              {editMode && (
                <ActionBar>
                  <SecondaryButton onClick={handleSelectAll}>
                    {selectedIcons.length === registeredIcons.length ? 'Deselect All' : 'Select All'}
                  </SecondaryButton>
                  <DangerButton onClick={handleDeleteSelected} disabled={selectedIcons.length === 0 || deleting}>
                    {deleting ? 'Deleting...' : `Delete Selected (${selectedIcons.length})`}
                  </DangerButton>
                </ActionBar>
              )}

              <IconList>
                {registeredIcons.map(iconAlias => {
                  const convertedIcon = iconAlias.replace(/^bi-/, '').replace('--', ':');

                  const isSelected = selectedIcons.includes(iconAlias);

                  return (
                    <IconItem
                      key={iconAlias}
                      $selected={isSelected}
                      onClick={() => editMode && handleToggleIconSelection(iconAlias)}
                    >
                      {editMode && (
                        <IconCheckbox
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleIconSelection(iconAlias)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      <IconDisplay
                        icon={convertedIcon}
                        color="#3544b1"
                        width={32}
                        height={32}
                      />
                    </IconItem>
                  );
                })}
              </IconList>
            </>
          )}
        </Card>

        <Card style={{ marginTop: '24px' }}>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            <strong>1. Select Icons:</strong> Browse through 200,000+ icons from popular icon libraries.<br />
            <strong>2. Register:</strong> Selected icons are downloaded as SVG files and saved to your Umbraco installation.<br />
            <strong>3. Manage Icons:</strong> Click "Manage Icons" to enter edit mode. Select multiple icons and delete them in bulk.<br />
            <strong>4. Restart Umbraco:</strong> ⚠️ <strong style={{ color: '#c62828' }}>You must restart your Umbraco application</strong> (or recycle the app pool) after registering or deleting icons.<br />
            <strong>5. Use Anywhere:</strong> Registered icons appear in all Umbraco icon pickers with the <code>bi-</code> prefix.<br />
            <strong>6. Naming Convention:</strong> Icons are saved as <code>bi-[collection]--[name].svg</code> (e.g., <code>bi-mdi--home.svg</code>, <code>bi-skill-icons--golang.svg</code>).
          </CardDescription>
        </Card>
      </DashboardContainer>

      {isModalOpen && (
        <MultiSelectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onIconsSelected={handleIconsSelected}
          selectedIcons={pendingModalSelections}
          setSelectedIcons={setPendingModalSelections}
        />
      )}
    </>
  );
};
