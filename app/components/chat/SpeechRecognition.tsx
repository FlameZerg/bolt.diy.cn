import { IconButton } from '~/components/ui/IconButton';
import { classNames } from '~/utils/classNames';
import React from 'react';
import { useStore } from '@nanostores/react';
import { getTranslation, languageStore } from '~/utils/i18n';

export const SpeechRecognitionButton = ({
  isListening,
  onStart,
  onStop,
  disabled,
}: {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled: boolean;
}) => {
  const language = useStore(languageStore);

  return (
    <IconButton
      title={isListening ? getTranslation('stopListening', language) : getTranslation('startListening', language)}
      disabled={disabled}
      className={classNames('transition-all', {
        'text-bolt-elements-item-contentAccent': isListening,
      })}
      onClick={isListening ? onStop : onStart}
    >
      {isListening ? <div className="i-ph:microphone-slash text-xl" /> : <div className="i-ph:microphone text-xl" />}
    </IconButton>
  );
};
