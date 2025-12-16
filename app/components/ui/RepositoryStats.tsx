import React from 'react';
import { Badge } from './Badge';
import { classNames } from '~/utils/classNames';
import { formatSize } from '~/utils/formatSize';
import { useStore } from '@nanostores/react';
import { getTranslation, languageStore } from '~/utils/i18n';

interface RepositoryStatsProps {
  stats: {
    totalFiles?: number;
    totalSize?: number;
    languages?: Record<string, number>;
    hasPackageJson?: boolean;
    hasDependencies?: boolean;
  };
  className?: string;
  compact?: boolean;
}

export function RepositoryStats({ stats, className, compact = false }: RepositoryStatsProps) {
  const { totalFiles, totalSize, languages, hasPackageJson, hasDependencies } = stats;
  const language = useStore(languageStore);

  return (
    <div className={classNames('space-y-3', className)}>
      {!compact && (
        <p className="text-sm font-medium text-bolt-elements-textPrimary dark:text-bolt-elements-textPrimary-dark">
          {getTranslation('repoStats', language)}:
        </p>
      )}

      <div className={classNames('grid gap-3', compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3')}>
        {totalFiles !== undefined && (
          <div className="flex items-center gap-2 text-bolt-elements-textPrimary dark:text-bolt-elements-textPrimary-dark">
            <span className="i-ph:files text-purple-500 w-4 h-4" />
            <span className={compact ? 'text-xs' : 'text-sm'}>
              {getTranslation('totalFiles', language).replace('{0}', totalFiles.toLocaleString())}
            </span>
          </div>
        )}

        {totalSize !== undefined && (
          <div className="flex items-center gap-2 text-bolt-elements-textPrimary dark:text-bolt-elements-textPrimary-dark">
            <span className="i-ph:database text-purple-500 w-4 h-4" />
            <span className={compact ? 'text-xs' : 'text-sm'}>
              {getTranslation('totalSize', language).replace('{0}', formatSize(totalSize))}
            </span>
          </div>
        )}
      </div>

      {languages && Object.keys(languages).length > 0 && (
        <div className={compact ? 'pt-1' : 'pt-2'}>
          <div className="flex items-center gap-2 text-bolt-elements-textPrimary dark:text-bolt-elements-textPrimary-dark mb-2">
            <span className="i-ph:code text-purple-500 w-4 h-4" />
            <span className={compact ? 'text-xs' : 'text-sm'}>{getTranslation('languages', language)}:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(languages)
              .sort(([, a], [, b]) => b - a)
              .slice(0, compact ? 3 : 5)
              .map(([lang, size]) => (
                <Badge key={lang} variant="subtle" size={compact ? 'sm' : 'md'}>
                  {lang} ({formatSize(size)})
                </Badge>
              ))}
            {Object.keys(languages).length > (compact ? 3 : 5) && (
              <Badge variant="subtle" size={compact ? 'sm' : 'md'}>
                +{Object.keys(languages).length - (compact ? 3 : 5)} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {(hasPackageJson || hasDependencies) && (
        <div className={compact ? 'pt-1' : 'pt-2'}>
          <div className="flex flex-wrap gap-2">
            {hasPackageJson && (
              <Badge variant="primary" size={compact ? 'sm' : 'md'} icon="i-ph:package w-3.5 h-3.5">
                {getTranslation('packageJson', language)}
              </Badge>
            )}
            {hasDependencies && (
              <Badge variant="primary" size={compact ? 'sm' : 'md'} icon="i-ph:tree-structure w-3.5 h-3.5">
                {getTranslation('dependencies', language)}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
