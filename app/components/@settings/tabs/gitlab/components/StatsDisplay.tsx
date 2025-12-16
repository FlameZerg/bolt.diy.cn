import React from 'react';
import { Button } from '~/components/ui/Button';
import type { GitLabStats } from '~/types/GitLab';
import { useStore } from '@nanostores/react';
import { getTranslation, languageStore } from '~/utils/i18n';

interface StatsDisplayProps {
  stats: GitLabStats;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function StatsDisplay({ stats, onRefresh, isRefreshing }: StatsDisplayProps) {
  const language = useStore(languageStore);

  return (
    <div className="space-y-4">
      {/* Repository Stats */}
      <div>
        <h5 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">{getTranslation('repositoryStats', language)}</h5>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: getTranslation('publicRepos', language),
              value: stats.publicProjects,
            },
            {
              label: getTranslation('privateRepos', language),
              value: stats.privateProjects,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex flex-col p-3 rounded-lg bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor"
            >
              <span className="text-xs text-bolt-elements-textSecondary">{stat.label}</span>
              <span className="text-lg font-medium text-bolt-elements-textPrimary">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contribution Stats */}
      <div>
        <h5 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">{getTranslation('contributionStats', language)}</h5>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: getTranslation('stars', language),
              value: stats.stars || 0,
              icon: 'i-ph:star',
              iconColor: 'text-bolt-elements-icon-warning',
            },
            {
              label: getTranslation('forks', language),
              value: stats.forks || 0,
              icon: 'i-ph:git-fork',
              iconColor: 'text-bolt-elements-icon-info',
            },
            {
              label: getTranslation('followers', language),
              value: stats.followers || 0,
              icon: 'i-ph:users',
              iconColor: 'text-bolt-elements-icon-success',
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex flex-col p-3 rounded-lg bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor"
            >
              <span className="text-xs text-bolt-elements-textSecondary">{stat.label}</span>
              <span className="text-lg font-medium text-bolt-elements-textPrimary flex items-center gap-1">
                <div className={`${stat.icon} w-4 h-4 ${stat.iconColor}`} />
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-bolt-elements-borderColor">
        <div className="flex items-center justify-between">
          <span className="text-xs text-bolt-elements-textSecondary">
            {getTranslation('lastUpdated', language)} {new Date(stats.lastUpdated).toLocaleString()}
          </span>
          {onRefresh && (
            <Button onClick={onRefresh} disabled={isRefreshing} variant="outline" size="sm" className="text-xs">
              {isRefreshing ? getTranslation('refreshing', language) : getTranslation('refresh', language)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
