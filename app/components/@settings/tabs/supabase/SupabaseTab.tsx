import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useStore } from '@nanostores/react';
import { classNames } from '~/utils/classNames';
import { Button } from '~/components/ui/Button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '~/components/ui/Collapsible';
import {
  supabaseConnection,
  isConnecting,
  isFetchingStats,
  isFetchingApiKeys,
  updateSupabaseConnection,
  fetchSupabaseStats,
  fetchProjectApiKeys,
  initializeSupabaseConnection,
  type SupabaseProject,
} from '~/lib/stores/supabase';
import { getTranslation, languageStore } from '~/utils/i18n';

interface ConnectionTestResult {
  status: 'success' | 'error' | 'testing';
  message: string;
  timestamp?: number;
}

interface ProjectAction {
  id: string;
  name: string;
  icon: string;
  action: (projectId: string) => Promise<void>;
  requiresConfirmation?: boolean;
  variant?: 'default' | 'destructive' | 'outline';
}

// Supabase logo SVG component
const SupabaseLogo = () => (
  <svg viewBox="0 0 109 113" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
    />
    <path
      fillOpacity="0.2"
      fill="currentColor"
      d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
    />
    <path
      fill="currentColor"
      d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
    />
  </svg>
);

export default function SupabaseTab() {
  const connection = useStore(supabaseConnection);
  const connecting = useStore(isConnecting);
  const fetchingStats = useStore(isFetchingStats);
  const fetchingApiKeys = useStore(isFetchingApiKeys);
  const language = useStore(languageStore);

  const [tokenInput, setTokenInput] = useState('');
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);
  const [connectionTest, setConnectionTest] = useState<ConnectionTestResult | null>(null);
  const [isProjectActionLoading, setIsProjectActionLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Connection testing function - uses server-side API to test environment token
  const testConnection = async () => {
    setConnectionTest({
      status: 'testing',
      message: getTranslation('testingConnection', language),
    });

    try {
      const response = await fetch('/api/supabase-user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        setConnectionTest({
          status: 'success',
          message: getTranslation('connectionSuccessWithProjects', language).replace('{count}', (data.projects?.length || 0).toString()),
          timestamp: Date.now(),
        });
      } else {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string };
        // Map common error messages to translations
        let translatedError = errorData.error || `${response.status} ${response.statusText}`;
        if (translatedError.toLowerCase().includes('token not found')) {
          translatedError = getTranslation('tokenNotFound', language);
        }
        setConnectionTest({
          status: 'error',
          message: getTranslation('connectionFailed', language).replace('{error}', translatedError),
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      setConnectionTest({
        status: 'error',
        message: getTranslation('connectionFailed', language).replace('{error}', error instanceof Error ? error.message : getTranslation('unknownError', language)),
        timestamp: Date.now(),
      });
    }
  };

  // Project actions
  const projectActions: ProjectAction[] = [
    {
      id: 'get_api_keys',
      name: getTranslation('getApiKeys', language),
      icon: 'i-ph:key',
      action: async (projectId: string) => {
        try {
          await fetchProjectApiKeys(projectId, connection.token);
          toast.success(getTranslation('apiKeysFetched', language));
        } catch (err: unknown) {
          const error = err instanceof Error ? err.message : 'Unknown error';
          toast.error(getTranslation('failedToFetchApiKeys', language).replace('{error}', error));
        }
      },
    },
    {
      id: 'view_dashboard',
      name: getTranslation('viewDashboard', language),
      icon: 'i-ph:layout',
      action: async (projectId: string) => {
        window.open(`https://supabase.com/dashboard/project/${projectId}`, '_blank');
      },
    },
    {
      id: 'view_database',
      name: getTranslation('viewDatabase', language),
      icon: 'i-ph:database',
      action: async (projectId: string) => {
        window.open(`https://supabase.com/dashboard/project/${projectId}/editor`, '_blank');
      },
    },
    {
      id: 'view_auth',
      name: getTranslation('viewAuth', language),
      icon: 'i-ph:user-circle',
      action: async (projectId: string) => {
        window.open(`https://supabase.com/dashboard/project/${projectId}/auth/users`, '_blank');
      },
    },
    {
      id: 'view_storage',
      name: getTranslation('viewStorage', language),
      icon: 'i-ph:folder',
      action: async (projectId: string) => {
        window.open(`https://supabase.com/dashboard/project/${projectId}/storage/buckets`, '_blank');
      },
    },
    {
      id: 'view_functions',
      name: getTranslation('viewFunctions', language),
      icon: 'i-ph:code',
      action: async (projectId: string) => {
        window.open(`https://supabase.com/dashboard/project/${projectId}/functions`, '_blank');
      },
    },
    {
      id: 'view_logs',
      name: getTranslation('viewLogs', language),
      icon: 'i-ph:scroll',
      action: async (projectId: string) => {
        window.open(`https://supabase.com/dashboard/project/${projectId}/logs`, '_blank');
      },
    },
    {
      id: 'view_settings',
      name: getTranslation('viewSettings', language),
      icon: 'i-ph:gear',
      action: async (projectId: string) => {
        window.open(`https://supabase.com/dashboard/project/${projectId}/settings`, '_blank');
      },
    },
    {
      id: 'view_api',
      name: getTranslation('viewApiDocs', language),
      icon: 'i-ph:book',
      action: async (projectId: string) => {
        window.open(`https://supabase.com/dashboard/project/${projectId}/api`, '_blank');
      },
    },
    {
      id: 'view_realtime',
      name: getTranslation('viewRealtime', language),
      icon: 'i-ph:radio',
      action: async (projectId: string) => {
        window.open(`https://supabase.com/dashboard/project/${projectId}/realtime`, '_blank');
      },
    },
    {
      id: 'view_edge_functions',
      name: getTranslation('viewEdgeFunctions', language),
      icon: 'i-ph:terminal',
      action: async (projectId: string) => {
        window.open(`https://supabase.com/dashboard/project/${projectId}/functions`, '_blank');
      },
    },
  ];

  // Initialize connection on component mount - check server-side token first
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        // First try to initialize using server-side token
        await initializeSupabaseConnection();

        // If no connection was established, the user will need to manually enter a token
        const currentState = supabaseConnection.get();

        if (!currentState.user) {
          console.log('No server-side Supabase token available, manual connection required');
        }
      } catch (error) {
        console.error('Failed to initialize Supabase connection:', error);
      }
    };
    initializeConnection();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      if (connection.user && connection.token && !connection.stats) {
        await fetchSupabaseStats(connection.token);
      }
    };
    fetchProjects();
  }, [connection.user, connection.token]);

  const handleConnect = async () => {
    if (!tokenInput) {
      toast.error(getTranslation('enterSupabaseToken', language));
      return;
    }

    isConnecting.set(true);

    try {
      await fetchSupabaseStats(tokenInput);
      updateSupabaseConnection({
        token: tokenInput,
        isConnected: true,
      });
      toast.success(getTranslation('connectedToSupabase', language));
      setTokenInput('');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(getTranslation('failedToConnectSupabase', language));
      updateSupabaseConnection({ user: null, token: '' });
    } finally {
      isConnecting.set(false);
    }
  };

  const handleDisconnect = () => {
    updateSupabaseConnection({
      user: null,
      token: '',
      stats: undefined,
      selectedProjectId: undefined,
      isConnected: false,
      project: undefined,
      credentials: undefined,
    });
    setConnectionTest(null);
    setSelectedProjectId('');
    toast.success(getTranslation('disconnectedFromSupabase', language));
  };

  const handleProjectAction = async (projectId: string, action: ProjectAction) => {
    if (action.requiresConfirmation) {
      if (!confirm(getTranslation('confirmProjectAction', language).replace('{action}', action.name.toLowerCase()))) {
        return;
      }
    }

    setIsProjectActionLoading(true);
    await action.action(projectId);
    setIsProjectActionLoading(false);
  };

  const handleProjectSelect = async (projectId: string) => {
    setSelectedProjectId(projectId);
    updateSupabaseConnection({ selectedProjectId: projectId });

    if (projectId && connection.token) {
      try {
        await fetchProjectApiKeys(projectId, connection.token);
      } catch (error) {
        console.error('Failed to fetch API keys:', error);
      }
    }
  };

  const renderProjects = () => {
    if (fetchingStats) {
      return (
        <div className="flex items-center gap-2 text-sm text-bolt-elements-textSecondary">
          <div className="i-ph:spinner-gap w-4 h-4 animate-spin" />
          {getTranslation('fetchingSupabaseProjects', language)}
        </div>
      );
    }

    return (
      <Collapsible open={isProjectsExpanded} onOpenChange={setIsProjectsExpanded}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 rounded-lg bg-bolt-elements-background dark:bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor dark:border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive/70 dark:hover:border-bolt-elements-borderColorActive/70 transition-all duration-200 cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="i-ph:database w-4 h-4 text-bolt-elements-item-contentAccent" />
              <span className="text-sm font-medium text-bolt-elements-textPrimary">
                {getTranslation('yourProjects', language).replace('{count}', (connection.stats?.totalProjects || 0).toString())}
              </span>
            </div>
            <div
              className={classNames(
                'i-ph:caret-down w-4 h-4 transform transition-transform duration-200 text-bolt-elements-textSecondary',
                isProjectsExpanded ? 'rotate-180' : '',
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden">
          <div className="space-y-4 mt-4">
            {/* Supabase Overview Dashboard */}
            {connection.stats?.projects?.length ? (
              <div className="mb-6 p-4 bg-bolt-elements-background-depth-1 rounded-lg border border-bolt-elements-borderColor">
                <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-3">{getTranslation('supabaseOverview', language)}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-bolt-elements-textPrimary">
                      {connection.stats.totalProjects}
                    </div>
                    <div className="text-xs text-bolt-elements-textSecondary">{getTranslation('totalProjects', language)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-bolt-elements-textPrimary">
                      {connection.stats.projects.filter((p: SupabaseProject) => p.status === 'ACTIVE_HEALTHY').length}
                    </div>
                    <div className="text-xs text-bolt-elements-textSecondary">{getTranslation('activeProjects', language)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-bolt-elements-textPrimary">
                      {new Set(connection.stats.projects.map((p: SupabaseProject) => p.region)).size}
                    </div>
                    <div className="text-xs text-bolt-elements-textSecondary">{getTranslation('regionsUsed', language)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-bolt-elements-textPrimary">
                      {connection.stats.projects.filter((p: SupabaseProject) => p.status !== 'ACTIVE_HEALTHY').length}
                    </div>
                    <div className="text-xs text-bolt-elements-textSecondary">{getTranslation('inactiveProjects', language)}</div>
                  </div>
                </div>
              </div>
            ) : null}

            {connection.stats?.projects?.length ? (
              <div className="grid gap-3">
                {connection.stats.projects.map((project: SupabaseProject) => (
                  <div
                    key={project.id}
                    className={classNames(
                      'p-4 rounded-lg border transition-colors bg-bolt-elements-background-depth-1 cursor-pointer',
                      selectedProjectId === project.id
                        ? 'border-bolt-elements-item-contentAccent bg-bolt-elements-item-backgroundActive/10'
                        : 'border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive/70',
                    )}
                    onClick={() => handleProjectSelect(project.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-bolt-elements-textPrimary flex items-center gap-2">
                          <div className="i-ph:database w-4 h-4 text-bolt-elements-borderColorActive" />
                          {project.name}
                        </h5>
                        <div className="flex items-center gap-2 mt-2 text-xs text-bolt-elements-textSecondary">
                          <span className="flex items-center gap-1">
                            <div className="i-ph:globe w-3 h-3" />
                            {project.region}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <div className="i-ph:clock w-3 h-3" />
                            {new Date(project.created_at).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span
                            className={classNames(
                              'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs',
                              project.status === 'ACTIVE_HEALTHY'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : project.status === 'SUSPENDED'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                  : project.status === 'INACTIVE'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
                            )}
                          >
                            <div
                              className={classNames(
                                'w-2 h-2 rounded-full',
                                project.status === 'ACTIVE_HEALTHY'
                                  ? 'bg-green-500'
                                  : project.status === 'SUSPENDED'
                                    ? 'bg-red-500'
                                    : project.status === 'INACTIVE'
                                      ? 'bg-yellow-500'
                                      : 'bg-gray-500',
                              )}
                            />
                            {project.status.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Project Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-bolt-elements-borderColor">
                          <div className="text-center">
                            <div className="text-sm font-semibold text-bolt-elements-textPrimary">
                              {project.stats?.database?.tables ?? '--'}
                            </div>
                            <div className="text-xs text-bolt-elements-textSecondary flex items-center justify-center gap-1">
                              <div className="i-ph:table w-3 h-3" />
                              {getTranslation('tables', language)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-bolt-elements-textPrimary">
                              {project.stats?.storage?.buckets ?? '--'}
                            </div>
                            <div className="text-xs text-bolt-elements-textSecondary flex items-center justify-center gap-1">
                              <div className="i-ph:folder w-3 h-3" />
                              {getTranslation('buckets', language)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-bolt-elements-textPrimary">
                              {project.stats?.functions?.deployed ?? '--'}
                            </div>
                            <div className="text-xs text-bolt-elements-textSecondary flex items-center justify-center gap-1">
                              <div className="i-ph:code w-3 h-3" />
                              {getTranslation('functions', language)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-bolt-elements-textPrimary">
                              {project.stats?.database?.size_mb ? `${project.stats.database.size_mb} MB` : '--'}
                            </div>
                            <div className="text-xs text-bolt-elements-textSecondary flex items-center justify-center gap-1">
                              <div className="i-ph:database w-3 h-3" />
                              {getTranslation('dbSize', language)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedProjectId === project.id && (
                      <div className="space-y-4 mt-4 pt-4 border-t border-bolt-elements-borderColor">
                        <div className="flex flex-wrap items-center gap-1">
                          {projectActions.map((action) => (
                            <Button
                              key={action.name}
                              variant={action.variant || 'outline'}
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProjectAction(project.id, action);
                              }}
                              disabled={isProjectActionLoading || (action.id === 'get_api_keys' && fetchingApiKeys)}
                              className="flex items-center gap-1 text-xs px-2 py-1 text-bolt-elements-textPrimary dark:text-bolt-elements-textPrimary"
                            >
                              <div className={`${action.icon} w-2.5 h-2.5`} />
                              {action.id === 'get_api_keys' && fetchingApiKeys ? getTranslation('fetching', language) || 'Fetching...' : action.name}

                            </Button>
                          ))}
                        </div>

                        {/* Project Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-bolt-elements-background-depth-2 p-3 rounded-lg space-y-2">
                            <h6 className="text-xs font-medium text-bolt-elements-textPrimary flex items-center gap-2">
                              <div className="i-ph:database w-4 h-4 text-bolt-elements-item-contentAccent" />
                              {getTranslation('databaseSchema', language)}
                            </h6>
                            <div className="space-y-1 text-xs text-bolt-elements-textSecondary">
                              <div className="flex justify-between">
                                <span>{getTranslation('tables', language)}:</span>
                                <span>{project.stats?.database?.tables ?? '--'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>{getTranslation('views', language)}:</span>
                                <span>{project.stats?.database?.views ?? '--'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>{getTranslation('functions', language)}:</span>
                                <span>{project.stats?.database?.functions ?? '--'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>{getTranslation('size', language)}:</span>
                                <span>
                                  {project.stats?.database?.size_mb ? `${project.stats.database.size_mb} MB` : '--'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-bolt-elements-background-depth-2 p-3 rounded-lg space-y-2">
                            <h6 className="text-xs font-medium text-bolt-elements-textPrimary flex items-center gap-2">
                              <div className="i-ph:folder w-4 h-4 text-bolt-elements-item-contentAccent" />
                              {getTranslation('storage', language)}
                            </h6>
                            <div className="space-y-1 text-xs text-bolt-elements-textSecondary">
                              <div className="flex justify-between">
                                <span>{getTranslation('buckets', language)}:</span>
                                <span>{project.stats?.storage?.buckets ?? '--'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>{getTranslation('files', language)}:</span>
                                <span>{project.stats?.storage?.files ?? '--'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>{getTranslation('used', language)}:</span>
                                <span>
                                  {project.stats?.storage?.used_gb ? `${project.stats.storage.used_gb} GB` : '--'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>{getTranslation('available', language)}:</span>
                                <span>
                                  {project.stats?.storage?.available_gb
                                    ? `${project.stats.storage.available_gb} GB`
                                    : '--'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {connection.credentials && (
                          <div className="bg-bolt-elements-background-depth-2 p-3 rounded-lg space-y-2">
                            <h6 className="text-xs font-medium text-bolt-elements-textPrimary flex items-center gap-2">
                              <div className="i-ph:key w-4 h-4 text-bolt-elements-item-contentAccent" />
                              {getTranslation('projectCredentials', language)}
                            </h6>
                            <div className="space-y-2">
                              <div>
                                <label className="text-xs text-bolt-elements-textSecondary">{getTranslation('supabaseUrl', language)}</label>
                                <div className="flex items-center gap-2 mt-1">
                                  <input
                                    type="text"
                                    value={connection.credentials.supabaseUrl || ''}
                                    readOnly
                                    className="flex-1 px-2 py-1 text-xs bg-bolt-elements-background border border-bolt-elements-borderColor rounded"
                                  />
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      if (connection.credentials?.supabaseUrl) {
                                        navigator.clipboard.writeText(connection.credentials.supabaseUrl);
                                        toast.success(getTranslation('urlCopied', language));
                                      }
                                    }}
                                    className="w-8 h-8"
                                  >
                                    <div className="i-ph:copy w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-bolt-elements-textSecondary">{getTranslation('anonKey', language)}</label>
                                <div className="flex items-center gap-2 mt-1">
                                  <input
                                    type="password"
                                    value={connection.credentials.anonKey || ''}
                                    readOnly
                                    className="flex-1 px-2 py-1 text-xs bg-bolt-elements-background border border-bolt-elements-borderColor rounded"
                                  />
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      if (connection.credentials?.anonKey) {
                                        navigator.clipboard.writeText(connection.credentials.anonKey);
                                        toast.success(getTranslation('keyCopied', language));
                                      }
                                    }}
                                    className="w-8 h-8"
                                  >
                                    <div className="i-ph:copy w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-bolt-elements-textSecondary flex items-center gap-2 p-4">
                <div className="i-ph:info w-4 h-4" />
                {getTranslation('noSupabaseProjects', language)}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2">
          <div className="text-[#3ECF8E]">
            <SupabaseLogo />
          </div>
          <h2 className="text-lg font-medium text-bolt-elements-textPrimary dark:text-bolt-elements-textPrimary">
            {getTranslation('supabaseIntegration', language)}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {connection.user && (
            <Button
              onClick={testConnection}
              disabled={connectionTest?.status === 'testing'}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-bolt-elements-item-backgroundActive/10 hover:text-bolt-elements-textPrimary dark:hover:bg-bolt-elements-item-backgroundActive/10 dark:hover:text-bolt-elements-textPrimary transition-colors"
            >
              {connectionTest?.status === 'testing' ? (
                <>
                  <div className="i-ph:spinner-gap w-4 h-4 animate-spin" />
                  {getTranslation('testing', language)}
                </>
              ) : (
                <>
                  <div className="i-ph:plug-charging w-4 h-4" />
                  {getTranslation('testConnection', language)}
                </>
              )}
            </Button>
          )}
        </div>
      </motion.div>

      <p className="text-sm text-bolt-elements-textSecondary dark:text-bolt-elements-textSecondary">
        {getTranslation('supabaseDescription', language)}
      </p>

      {/* Connection Test Results */}
      {connectionTest && (
        <motion.div
          className={classNames('p-4 rounded-lg border', {
            'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700':
              connectionTest.status === 'success',
            'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700': connectionTest.status === 'error',
            'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700': connectionTest.status === 'testing',
          })}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2">
            {connectionTest.status === 'success' && (
              <div className="i-ph:check-circle w-5 h-5 text-green-600 dark:text-green-400" />
            )}
            {connectionTest.status === 'error' && (
              <div className="i-ph:warning-circle w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            {connectionTest.status === 'testing' && (
              <div className="i-ph:spinner-gap w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
            )}
            <span
              className={classNames('text-sm font-medium', {
                'text-green-800 dark:text-green-200': connectionTest.status === 'success',
                'text-red-800 dark:text-red-200': connectionTest.status === 'error',
                'text-blue-800 dark:text-blue-200': connectionTest.status === 'testing',
              })}
            >
              {connectionTest.message}
            </span>
          </div>
          {connectionTest.timestamp && (
            <p className="text-xs text-gray-500 mt-1">{new Date(connectionTest.timestamp).toLocaleString()}</p>
          )}
        </motion.div>
      )}

      {/* Main Connection Component */}
      <motion.div
        className="bg-bolt-elements-background dark:bg-bolt-elements-background border border-bolt-elements-borderColor dark:border-bolt-elements-borderColor rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="p-6 space-y-6">
          {!connection.user ? (
            <div className="space-y-4">
              <div className="text-xs text-bolt-elements-textSecondary bg-bolt-elements-background-depth-1 dark:bg-bolt-elements-background-depth-1 p-3 rounded-lg mb-4">
                <p className="flex items-center gap-1 mb-1">
                  <span className="i-ph:lightbulb w-3.5 h-3.5 text-bolt-elements-icon-success dark:text-bolt-elements-icon-success" />
                  <span className="font-medium">{getTranslation('tip', language)}:</span> {getTranslation('supabaseEnvTip', language).replace('{envVar}', 'VITE_SUPABASE_ACCESS_TOKEN')}
                </p>
              </div>

              <div>
                <label className="block text-sm text-bolt-elements-textSecondary mb-2">{getTranslation('accessToken', language)}</label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  disabled={connecting}
                  placeholder={getTranslation('enterSupabaseToken', language)}
                  className={classNames(
                    'w-full px-3 py-2 rounded-lg text-sm',
                    'bg-[#F8F8F8] dark:bg-[#1A1A1A]',
                    'border border-[#E5E5E5] dark:border-[#333333]',
                    'text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary',
                    'focus:outline-none focus:ring-1 focus:ring-bolt-elements-borderColorActive',
                    'disabled:opacity-50',
                  )}
                />
                <div className="mt-2 text-sm text-bolt-elements-textSecondary">
                  <a
                    href="https://supabase.com/dashboard/account/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bolt-elements-borderColorActive hover:underline inline-flex items-center gap-1"
                  >
                    {getTranslation('getYourToken', language)}
                    <div className="i-ph:arrow-square-out w-4 h-4" />
                  </a>
                </div>
              </div>

              <button
                onClick={handleConnect}
                disabled={connecting || !tokenInput}
                className={classNames(
                  'px-4 py-2 rounded-lg text-sm flex items-center gap-2',
                  'bg-[#303030] text-white',
                  'hover:bg-[#5E41D0] hover:text-white',
                  'disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200',
                  'transform active:scale-95',
                )}
              >
                {connecting ? (
                  <>
                    <div className="i-ph:spinner-gap animate-spin" />
                    {getTranslation('connecting', language)}
                  </>
                ) : (
                  <>
                    <div className="i-ph:plug-charging w-4 h-4" />
                    {getTranslation('connect', language)}
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDisconnect}
                    className={classNames(
                      'px-4 py-2 rounded-lg text-sm flex items-center gap-2',
                      'bg-red-500 text-white',
                      'hover:bg-red-600',
                    )}
                  >
                    <div className="i-ph:plug w-4 h-4" />
                    {getTranslation('disconnect', language)}
                  </button>
                  <span className="text-sm text-bolt-elements-textSecondary flex items-center gap-1">
                    <div className="i-ph:check-circle w-4 h-4 text-green-500" />
                    {getTranslation('connectedToSupabaseStatus', language)}
                  </span>
                </div>
              </div>

              {connection.user && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-bolt-elements-background-depth-1 dark:bg-bolt-elements-background-depth-1 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <div className="i-ph:user w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-bolt-elements-textPrimary">{connection.user.email}</h4>
                      <p className="text-sm text-bolt-elements-textSecondary">
                        {getTranslation(connection.user.role.toLowerCase(), language) || connection.user.role} • {getTranslation('memberSince', language)}{' '}
                        {new Date(connection.user.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-bolt-elements-textSecondary">
                        <span className="flex items-center gap-1">
                          <div className="i-ph:buildings w-3 h-3" />
                          {connection.stats?.totalProjects || 0} {getTranslation('projects', language) || 'Projects'}
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="i-ph:globe w-3 h-3" />
                          {new Set(connection.stats?.projects?.map((p: SupabaseProject) => p.region) || []).size}{' '}
                          {getTranslation('regions', language) || 'Regions'}
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="i-ph:activity w-3 h-3" />
                          {connection.stats?.projects?.filter((p: SupabaseProject) => p.status === 'ACTIVE_HEALTHY')
                            .length || 0}{' '}
                          {getTranslation('active', language) || 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Analytics */}
                  <div className="mb-6 space-y-4">
                    <h4 className="text-sm font-medium text-bolt-elements-textPrimary">{getTranslation('performanceAnalytics', language)}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-bolt-elements-background-depth-2 p-3 rounded-lg border border-bolt-elements-borderColor">
                        <h6 className="text-xs font-medium text-bolt-elements-textPrimary flex items-center gap-2 mb-2">
                          <div className="i-ph:chart-line w-4 h-4 text-bolt-elements-item-contentAccent" />
                          {getTranslation('databaseHealth', language)}
                        </h6>
                        <div className="space-y-1">
                          {(() => {
                            const totalProjects = connection.stats?.totalProjects || 0;
                            const activeProjects =
                              connection.stats?.projects?.filter((p: SupabaseProject) => p.status === 'ACTIVE_HEALTHY')
                                .length || 0;
                            const healthRate =
                              totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 100) : 0;
                            const avgTablesPerProject =
                              totalProjects > 0
                                ? Math.round(
                                  (connection.stats?.projects?.reduce(
                                    (sum, p) => sum + (p.stats?.database?.tables || 0),
                                    0,
                                  ) || 0) / totalProjects,
                                )
                                : 0;

                            return [
                              { label: getTranslation('healthRate', language), value: `${healthRate}%` },
                              { label: getTranslation('activeProjects', language), value: activeProjects },
                              { label: getTranslation('avgTablesPerProject', language), value: avgTablesPerProject },
                            ];
                          })().map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="text-bolt-elements-textSecondary">{item.label}:</span>
                              <span className="text-bolt-elements-textPrimary font-medium">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-bolt-elements-background-depth-2 p-3 rounded-lg border border-bolt-elements-borderColor">
                        <h6 className="text-xs font-medium text-bolt-elements-textPrimary flex items-center gap-2 mb-2">
                          <div className="i-ph:shield-check w-4 h-4 text-bolt-elements-item-contentAccent" />
                          {getTranslation('authSecurity', language)}
                        </h6>
                        <div className="space-y-1">
                          {(() => {
                            const totalProjects = connection.stats?.totalProjects || 0;
                            const projectsWithAuth =
                              connection.stats?.projects?.filter((p) => p.stats?.auth?.users !== undefined).length || 0;
                            const authEnabledRate =
                              totalProjects > 0 ? Math.round((projectsWithAuth / totalProjects) * 100) : 0;
                            const totalUsers =
                              connection.stats?.projects?.reduce((sum, p) => sum + (p.stats?.auth?.users || 0), 0) || 0;

                            return [
                              { label: getTranslation('authEnabled', language), value: `${authEnabledRate}%` },
                              { label: getTranslation('totalUsers', language), value: totalUsers },
                              {
                                label: getTranslation('avgUsersPerProject', language),
                                value: totalProjects > 0 ? Math.round(totalUsers / totalProjects) : 0,
                              },
                            ];
                          })().map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="text-bolt-elements-textSecondary">{item.label}:</span>
                              <span className="text-bolt-elements-textPrimary font-medium">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-bolt-elements-background-depth-2 p-3 rounded-lg border border-bolt-elements-borderColor">
                        <h6 className="text-xs font-medium text-bolt-elements-textPrimary flex items-center gap-2 mb-2">
                          <div className="i-ph:globe w-4 h-4 text-bolt-elements-item-contentAccent" />
                          {getTranslation('regionalDistribution', language)}
                        </h6>
                        <div className="space-y-1">
                          {(() => {
                            const regions =
                              connection.stats?.projects?.reduce(
                                (acc, p: SupabaseProject) => {
                                  acc[p.region] = (acc[p.region] || 0) + 1;
                                  return acc;
                                },
                                {} as Record<string, number>,
                              ) || {};

                            return Object.entries(regions)
                              .sort(([, a], [, b]) => b - a)
                              .slice(0, 3)
                              .map(([region, count]) => ({ label: region.toUpperCase(), value: count }));
                          })().map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="text-bolt-elements-textSecondary">{item.label}:</span>
                              <span className="text-bolt-elements-textPrimary font-medium">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resource Utilization */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">{getTranslation('resourceOverview', language)}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {(() => {
                        const totalDatabase =
                          connection.stats?.projects?.reduce((sum, p) => sum + (p.stats?.database?.size_mb || 0), 0) ||
                          0;
                        const totalStorage =
                          connection.stats?.projects?.reduce((sum, p) => sum + (p.stats?.storage?.used_gb || 0), 0) ||
                          0;
                        const totalFunctions =
                          connection.stats?.projects?.reduce(
                            (sum, p) => sum + (p.stats?.functions?.deployed || 0),
                            0,
                          ) || 0;
                        const totalTables =
                          connection.stats?.projects?.reduce((sum, p) => sum + (p.stats?.database?.tables || 0), 0) ||
                          0;
                        const totalBuckets =
                          connection.stats?.projects?.reduce((sum, p) => sum + (p.stats?.storage?.buckets || 0), 0) ||
                          0;

                        return [
                          {
                            label: getTranslation('database', language),
                            value: totalDatabase > 0 ? `${totalDatabase} MB` : '--',
                            icon: 'i-ph:database',
                            color: 'text-blue-500',
                            bgColor: 'bg-blue-100 dark:bg-blue-900/20',
                            textColor: 'text-blue-800 dark:text-blue-400',
                          },
                          {
                            label: getTranslation('storage', language),
                            value: totalStorage > 0 ? `${totalStorage} GB` : '--',
                            icon: 'i-ph:folder',
                            color: 'text-green-500',
                            bgColor: 'bg-green-100 dark:bg-green-900/20',
                            textColor: 'text-green-800 dark:text-green-400',
                          },
                          {
                            label: getTranslation('functions', language),
                            value: totalFunctions,
                            icon: 'i-ph:code',
                            color: 'text-purple-500',
                            bgColor: 'bg-purple-100 dark:bg-purple-900/20',
                            textColor: 'text-purple-800 dark:text-purple-400',
                          },
                          {
                            label: getTranslation('tables', language),
                            value: totalTables,
                            icon: 'i-ph:table',
                            color: 'text-orange-500',
                            bgColor: 'bg-orange-100 dark:bg-orange-900/20',
                            textColor: 'text-orange-800 dark:text-orange-400',
                          },
                          {
                            label: getTranslation('buckets', language),
                            value: totalBuckets,
                            icon: 'i-ph:archive',
                            color: 'text-teal-500',
                            bgColor: 'bg-teal-100 dark:bg-teal-900/20',
                            textColor: 'text-teal-800 dark:text-teal-400',
                          },
                        ];
                      })().map((metric, index) => (
                        <div
                          key={index}
                          className={`flex flex-col p-3 rounded-lg border border-bolt-elements-borderColor ${metric.bgColor}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`${metric.icon} w-4 h-4 ${metric.color}`} />
                            <span className="text-xs text-bolt-elements-textSecondary">{metric.label}</span>
                          </div>
                          <span className={`text-lg font-medium ${metric.textColor}`}>{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Usage Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-bolt-elements-background-depth-1 rounded-lg border border-bolt-elements-borderColor">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="i-ph:database w-4 h-4 text-bolt-elements-item-contentAccent" />
                        <span className="text-xs font-medium text-bolt-elements-textPrimary">{getTranslation('database', language)}</span>
                      </div>
                      <div className="text-sm text-bolt-elements-textSecondary">
                        <div>
                          {getTranslation('tables', language)}:{' '}
                          {connection.stats?.projects?.reduce((sum, p) => sum + (p.stats?.database?.tables || 0), 0) ||
                            '--'}
                        </div>
                        <div>
                          {getTranslation('size', language)}:{' '}
                          {(() => {
                            const totalSize =
                              connection.stats?.projects?.reduce(
                                (sum, p) => sum + (p.stats?.database?.size_mb || 0),
                                0,
                              ) || 0;
                            return totalSize > 0 ? `${totalSize} MB` : '--';
                          })()}
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-bolt-elements-background-depth-1 rounded-lg border border-bolt-elements-borderColor">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="i-ph:folder w-4 h-4 text-bolt-elements-item-contentAccent" />
                        <span className="text-xs font-medium text-bolt-elements-textPrimary">{getTranslation('storage', language)}</span>
                      </div>
                      <div className="text-sm text-bolt-elements-textSecondary">
                        <div>
                          {getTranslation('buckets', language)}:{' '}
                          {connection.stats?.projects?.reduce((sum, p) => sum + (p.stats?.storage?.buckets || 0), 0) ||
                            '--'}
                        </div>
                        <div>
                          {getTranslation('used', language)}:{' '}
                          {(() => {
                            const totalUsed =
                              connection.stats?.projects?.reduce(
                                (sum, p) => sum + (p.stats?.storage?.used_gb || 0),
                                0,
                              ) || 0;
                            return totalUsed > 0 ? `${totalUsed} GB` : '--';
                          })()}
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-bolt-elements-background-depth-1 rounded-lg border border-bolt-elements-borderColor">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="i-ph:code w-4 h-4 text-bolt-elements-item-contentAccent" />
                        <span className="text-xs font-medium text-bolt-elements-textPrimary">{getTranslation('functions', language)}</span>
                      </div>
                      <div className="text-sm text-bolt-elements-textSecondary">
                        <div>
                          {getTranslation('deployed', language)}:{' '}
                          {connection.stats?.projects?.reduce(
                            (sum, p) => sum + (p.stats?.functions?.deployed || 0),
                            0,
                          ) || '--'}
                        </div>
                        <div>
                          {getTranslation('invocations', language)}:{' '}
                          {connection.stats?.projects?.reduce(
                            (sum, p) => sum + (p.stats?.functions?.invocations || 0),
                            0,
                          ) || '--'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {renderProjects()}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
