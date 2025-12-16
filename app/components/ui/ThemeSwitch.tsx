import { useStore } from '@nanostores/react';
import { memo, useEffect, useState } from 'react';
import { themeStore, toggleTheme } from '~/lib/stores/theme';
import { getTranslation, languageStore } from '~/utils/i18n';
import { IconButton } from './IconButton';

interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch = memo(({ className }: ThemeSwitchProps) => {
  const theme = useStore(themeStore);
  const language = useStore(languageStore);
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    domLoaded && (
      <IconButton
        className={className}
        icon={theme === 'dark' ? 'i-ph-sun-dim-duotone' : 'i-ph-moon-stars-duotone'}
        size="xl"
        title={getTranslation('toggleTheme', language)}
        onClick={toggleTheme}
      />
    )
  );
});
