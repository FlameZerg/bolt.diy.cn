import { classNames } from '~/utils/classNames';
import { IconButton } from '~/components/ui';
import { useStore } from '@nanostores/react';
import { getTranslation, languageStore } from '~/utils/i18n';

export function DiscussMode() {
  const language = useStore(languageStore);

  return (
    <div>
      <IconButton
        title={getTranslation('discuss', language)}
        className={classNames(
          'transition-all flex items-center gap-1 bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent',
        )}
      >
        <div className={`i-ph:chats text-xl`} />
      </IconButton>
    </div>
  );
}
