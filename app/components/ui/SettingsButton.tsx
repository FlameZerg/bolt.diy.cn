import { memo } from 'react';
import { useStore } from '@nanostores/react';
import { IconButton } from '~/components/ui/IconButton';
import { getTranslation, languageStore } from '~/utils/i18n';

interface SettingsButtonProps {
  onClick: () => void;
}

export const SettingsButton = memo(({ onClick }: SettingsButtonProps) => {
  const language = useStore(languageStore);
  return (
    <IconButton
      onClick={onClick}
      icon="i-ph:gear"
      size="xl"
      title={getTranslation('settings', language)}
      data-testid="settings-button"
      className="text-[#666] hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive/10 transition-colors"
    />
  );
});

interface HelpButtonProps {
  onClick: () => void;
}

export const HelpButton = memo(({ onClick }: HelpButtonProps) => {
  const language = useStore(languageStore);
  return (
    <IconButton
      onClick={onClick}
      icon="i-ph:question"
      size="xl"
      title={getTranslation('helpDocumentation', language)}
      data-testid="help-button"
      className="text-[#666] hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive/10 transition-colors"
    />
  );
});
