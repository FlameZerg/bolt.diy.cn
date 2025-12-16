import { useStore } from '@nanostores/react';
import { getTranslation, languageStore } from '~/utils/i18n';

export const LoadingOverlay = ({
  message,
  progress,
  progressText,
}: {
  message?: string;
  progress?: number;
  progressText?: string;
}) => {
  const language = useStore(languageStore);
  const displayMessage = message || getTranslation('loading', language);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 backdrop-blur-sm">
      <div className="relative flex flex-col items-center gap-4 p-8 rounded-lg bg-bolt-elements-background-depth-2 shadow-lg">
        <div
          className={'i-svg-spinners:90-ring-with-bg text-bolt-elements-loader-progress'}
          style={{ fontSize: '2rem' }}
        ></div>
        <p className="text-lg text-bolt-elements-textTertiary">{displayMessage}</p>
        {progress !== undefined && (
          <div className="w-64 flex flex-col gap-2">
            <div className="w-full h-2 bg-bolt-elements-background-depth-1 rounded-full overflow-hidden">
              <div
                className="h-full bg-bolt-elements-loader-progress transition-all duration-300 ease-out rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            {progressText && <p className="text-sm text-bolt-elements-textTertiary text-center">{progressText}</p>}
          </div>
        )}
      </div>
    </div>
  );
};
