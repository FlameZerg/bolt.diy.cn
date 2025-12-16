import React from 'react';
import { Button } from '~/components/ui/Button';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import {
  Cpu,
  Server,
  Settings,
  ExternalLink,
  Package,
  Code,
  Database,
  CheckCircle,
  AlertCircle,
  Activity,
  Cable,
  ArrowLeft,
  Download,
  Shield,
  Globe,
  Terminal,
  Monitor,
  Wifi,
} from 'lucide-react';
import { useStore } from '@nanostores/react';
import { getTranslation, languageStore } from '~/utils/i18n';

// Setup Guide Component
function SetupGuide({ onBack }: { onBack: () => void }) {
  const language = useStore(languageStore);
  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="bg-transparent hover:bg-transparent text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-all duration-200 p-2"
          aria-label={getTranslation('backToDashboard', language)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-bolt-elements-textPrimary">{getTranslation('setupGuideTitle', language)}</h2>
          <p className="text-sm text-bolt-elements-textSecondary">
            {getTranslation('setupGuideDesc', language)}
          </p>
        </div>
      </div>

      {/* Hardware Requirements Overview */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">{getTranslation('systemRequirements', language)}</h3>
              <p className="text-sm text-bolt-elements-textSecondary">{getTranslation('systemRequirementsDesc', language)}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-green-500" />
                <span className="font-medium text-bolt-elements-textPrimary">CPU</span>
              </div>
              <p className="text-bolt-elements-textSecondary">{getTranslation('cpuRequirement', language)}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-bolt-elements-textPrimary">RAM</span>
              </div>
              <p className="text-bolt-elements-textSecondary">{getTranslation('ramRequirement', language)}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-bolt-elements-textPrimary">GPU</span>
              </div>
              <p className="text-bolt-elements-textSecondary">{getTranslation('gpuRequirement', language)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ollama Setup Section */}
      <Card className="bg-bolt-elements-background-depth-2 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center ring-1 ring-purple-500/30">
              <Server className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-bolt-elements-textPrimary">{getTranslation('ollamaSetup', language)}</h3>
              <p className="text-sm text-bolt-elements-textSecondary">
                {getTranslation('ollamaSetupDesc', language)}
              </p>
            </div>
            <span className="px-3 py-1 bg-purple-500/10 text-purple-500 text-xs font-medium rounded-full">
              {getTranslation('recommended', language)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Installation Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-bolt-elements-textPrimary flex items-center gap-2">
              <Download className="w-4 h-4" />
              {getTranslation('chooseInstallMethod', language)}
            </h4>

            {/* Desktop App - New and Recommended */}
            <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="w-5 h-5 text-green-500" />
                <h5 className="font-medium text-green-500">🆕 {getTranslation('desktopAppRecommended', language)}</h5>
              </div>
              <p className="text-sm text-bolt-elements-textSecondary mb-3">
                {getTranslation('desktopAppDesc', language)}
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-bolt-elements-background-depth-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor className="w-4 h-4 text-bolt-elements-textPrimary" />
                    <strong className="text-bolt-elements-textPrimary">macOS</strong>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 gap-2 group shadow-sm hover:shadow-lg hover:shadow-purple-500/20 font-medium"
                    _asChild
                  >
                    <a
                      href="https://ollama.com/download/mac"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 flex-shrink-0" />
                      <span className="flex-1 text-center font-medium">{getTranslation('downloadDesktopApp', language)}</span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" />
                    </a>
                  </Button>
                </div>
                <div className="p-3 rounded-lg bg-bolt-elements-background-depth-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor className="w-4 h-4 text-bolt-elements-textPrimary" />
                    <strong className="text-bolt-elements-textPrimary">Windows</strong>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 gap-2 group shadow-sm hover:shadow-lg hover:shadow-purple-500/20 font-medium"
                    _asChild
                  >
                    <a
                      href="https://ollama.com/download/windows"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 flex-shrink-0" />
                      <span className="flex-1 text-center font-medium">{getTranslation('downloadDesktopApp', language)}</span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" />
                    </a>
                  </Button>
                </div>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-blue-500 text-sm">{getTranslation('builtInWebInterface', language)}</span>
                </div>
                <p className="text-xs text-bolt-elements-textSecondary">
                  {getTranslation('desktopAppWebInterface', language)}{' '}
                  <code className="bg-bolt-elements-background-depth-4 px-1 rounded">http://localhost:11434</code>
                </p>
              </div>
            </div>

            {/* CLI Installation */}
            <div className="p-4 rounded-lg bg-bolt-elements-background-depth-3">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-5 h-5 text-bolt-elements-textPrimary" />
                <h5 className="font-medium text-bolt-elements-textPrimary">{getTranslation('commandLineAdvanced', language)}</h5>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-bolt-elements-background-depth-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor className="w-4 h-4 text-bolt-elements-textPrimary" />
                    <strong className="text-bolt-elements-textPrimary">Windows</strong>
                  </div>
                  <div className="text-xs bg-bolt-elements-background-depth-4 p-2 rounded font-mono text-bolt-elements-textPrimary">
                    winget install Ollama.Ollama
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-bolt-elements-background-depth-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor className="w-4 h-4 text-bolt-elements-textPrimary" />
                    <strong className="text-bolt-elements-textPrimary">macOS</strong>
                  </div>
                  <div className="text-xs bg-bolt-elements-background-depth-4 p-2 rounded font-mono text-bolt-elements-textPrimary">
                    brew install ollama
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-bolt-elements-background-depth-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal className="w-4 h-4 text-bolt-elements-textPrimary" />
                    <strong className="text-bolt-elements-textPrimary">Linux</strong>
                  </div>
                  <div className="text-xs bg-bolt-elements-background-depth-4 p-2 rounded font-mono text-bolt-elements-textPrimary">
                    curl -fsSL https://ollama.com/install.sh | sh
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Latest Model Recommendations */}
          <div className="space-y-4">
            <h4 className="font-medium text-bolt-elements-textPrimary flex items-center gap-2">
              <Package className="w-4 h-4" />
              {getTranslation('downloadLatestModels', language)}
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-bolt-elements-background-depth-3">
                <h5 className="font-medium text-bolt-elements-textPrimary mb-3 flex items-center gap-2">
                  <Code className="w-4 h-4 text-green-500" />
                  {getTranslation('codeDevelopment', language)}
                </h5>
                <div className="space-y-2 text-xs bg-bolt-elements-background-depth-4 p-3 rounded font-mono text-bolt-elements-textPrimary">
                  <div>{getTranslation('commentLatestLlama', language)}</div>
                  <div>ollama pull llama3.2:3b</div>
                  <div>ollama pull codellama:13b</div>
                  <div>ollama pull deepseek-coder-v2</div>
                  <div>ollama pull qwen2.5-coder:7b</div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-bolt-elements-background-depth-3">
                <h5 className="font-medium text-bolt-elements-textPrimary mb-3 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-500" />
                  {getTranslation('generalPurposeChat', language)}
                </h5>
                <div className="space-y-2 text-xs bg-bolt-elements-background-depth-4 p-3 rounded font-mono text-bolt-elements-textPrimary">
                  <div>{getTranslation('commentLatestGeneral', language)}</div>
                  <div>ollama pull llama3.2:3b</div>
                  <div>ollama pull mistral:7b</div>
                  <div>ollama pull phi3.5:3.8b</div>
                  <div>ollama pull qwen2.5:7b</div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-purple-500">{getTranslation('performanceOptimized', language)}</span>
                </div>
                <ul className="text-xs text-bolt-elements-textSecondary space-y-1">
                  <li>• {getTranslation('llamaModelDesc', language)}</li>
                  <li>• {getTranslation('phiModelDesc', language)}</li>
                  <li>• {getTranslation('qwenModelDesc', language)}</li>
                  <li>• {getTranslation('mistralModelDesc', language)}</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium text-yellow-500">{getTranslation('proTips', language)}</span>
                </div>
                <ul className="text-xs text-bolt-elements-textSecondary space-y-1">
                  <li>• {getTranslation('proTip1', language)}</li>
                  <li>• {getTranslation('proTip2', language)}</li>
                  <li>• {getTranslation('proTip3', language)}</li>
                  <li>• {getTranslation('proTip4', language)}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Desktop App Features */}
          <div className="space-y-4">
            <h4 className="font-medium text-bolt-elements-textPrimary flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              {getTranslation('desktopAppFeatures', language)}
            </h4>
            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-blue-500 mb-3">🖥️ {getTranslation('userInterface', language)}</h5>
                  <ul className="text-sm text-bolt-elements-textSecondary space-y-1">
                    <li>• {getTranslation('modelLibraryBrowser', language)}</li>
                    <li>• {getTranslation('oneClickDownloads', language)}</li>
                    <li>• {getTranslation('builtInChatInterface', language)}</li>
                    <li>• {getTranslation('systemResourceMonitoring', language)}</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-500 mb-3">🔧 {getTranslation('managementTools', language)}</h5>
                  <ul className="text-sm text-bolt-elements-textSecondary space-y-1">
                    <li>• {getTranslation('automaticUpdates', language)}</li>
                    <li>• {getTranslation('modelSizeOptimization', language)}</li>
                    <li>• {getTranslation('gpuAccelerationDetection', language)}</li>
                    <li>• {getTranslation('crossPlatformCompatibility', language)}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="space-y-4">
            <h4 className="font-medium text-bolt-elements-textPrimary flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {getTranslation('troubleshootingCommands', language)}
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                <h5 className="font-medium text-red-500 mb-2">{getTranslation('commonIssues', language)}</h5>
                <ul className="text-xs text-bolt-elements-textSecondary space-y-1">
                  <li>• {getTranslation('issueDesktopNotStarting', language)}</li>
                  <li>• {getTranslation('issueGpuNotDetected', language)}</li>
                  <li>• {getTranslation('issuePortBlocked', language)}</li>
                  <li>• {getTranslation('issueModelsNotLoading', language)}</li>
                  <li>• {getTranslation('issueSlowPerformance', language)}</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <h5 className="font-medium text-green-500 mb-2">{getTranslation('usefulCommands', language)}</h5>
                <div className="text-xs bg-bolt-elements-background-depth-4 p-3 rounded font-mono text-bolt-elements-textPrimary space-y-1">
                  <div>{getTranslation('commentCheckInstalled', language)}</div>
                  <div>ollama list</div>
                  <div></div>
                  <div>{getTranslation('commentRemoveUnused', language)}</div>
                  <div>ollama rm model_name</div>
                  <div></div>
                  <div>{getTranslation('commentCheckGpu', language)}</div>
                  <div>ollama ps</div>
                  <div></div>
                  <div>{getTranslation('commentViewLogs', language)}</div>
                  <div>ollama logs</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LM Studio Setup Section */}
      <Card className="bg-bolt-elements-background-depth-2 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center ring-1 ring-blue-500/30">
              <Monitor className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-bolt-elements-textPrimary">{getTranslation('lmStudioSetup', language)}</h3>
              <p className="text-sm text-bolt-elements-textSecondary">
                {getTranslation('lmStudioSetupDesc', language)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Installation */}
          <div className="space-y-4">
            <h4 className="font-medium text-bolt-elements-textPrimary flex items-center gap-2">
              <Download className="w-4 h-4" />
              {getTranslation('downloadInstall', language)}
            </h4>
            <div className="p-4 rounded-lg bg-bolt-elements-background-depth-3">
              <p className="text-sm text-bolt-elements-textSecondary mb-3">
                {getTranslation('downloadLMStudioDesc', language)}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 gap-2 group shadow-sm hover:shadow-lg hover:shadow-blue-500/20 font-medium"
                _asChild
              >
                <a
                  href="https://lmstudio.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 flex-shrink-0" />
                  <span className="flex-1 text-center font-medium">{getTranslation('downloadLMStudio', language)}</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" />
                </a>
              </Button>
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            <h4 className="font-medium text-bolt-elements-textPrimary flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {getTranslation('configureLocalServer', language)}
            </h4>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-bolt-elements-background-depth-3">
                <h5 className="font-medium text-bolt-elements-textPrimary mb-2">{getTranslation('startLocalServer', language)}</h5>
                <ol className="text-xs text-bolt-elements-textSecondary space-y-1 list-decimal list-inside">
                  <li>{getTranslation('lmStudioStep1', language)}</li>
                  <li>{getTranslation('lmStudioStep2', language)}</li>
                  <li>{getTranslation('lmStudioStep3', language)}</li>
                  <li>{getTranslation('lmStudioStep4', language)}</li>
                  <li>{getTranslation('lmStudioStep5', language)}</li>
                </ol>
              </div>

              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="font-medium text-red-500">{getTranslation('criticalEnableCors', language)}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-bolt-elements-textSecondary">
                    {getTranslation('corsInstructions', language)}
                  </p>
                  <ol className="text-xs text-bolt-elements-textSecondary space-y-1 list-decimal list-inside ml-2">
                    <li>{getTranslation('corsStep1', language)}</li>
                    <li>{getTranslation('corsStep2', language)}</li>
                    <li>
                      {getTranslation('corsStep3Cli', language)}{' '}
                      <code className="bg-bolt-elements-background-depth-4 px-1 rounded">lms server start --cors</code>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Advantages */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-blue-500">{getTranslation('lmStudioAdvantages', language)}</span>
            </div>
            <ul className="text-xs text-bolt-elements-textSecondary space-y-1 list-disc list-inside">
              <li>{getTranslation('lmAdvModelDownloader', language)}</li>
              <li>{getTranslation('lmAdvModelSwitching', language)}</li>
              <li>{getTranslation('lmAdvChatInterface', language)}</li>
              <li>{getTranslation('lmAdvGgufSupport', language)}</li>
              <li>{getTranslation('lmAdvRegularUpdates', language)}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* LocalAI Setup Section */}
      <Card className="bg-bolt-elements-background-depth-2 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center ring-1 ring-green-500/30">
              <Globe className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-bolt-elements-textPrimary">{getTranslation('localAISetup', language)}</h3>
              <p className="text-sm text-bolt-elements-textSecondary">
                {getTranslation('localAISetupDesc', language)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Installation */}
          <div className="space-y-4">
            <h4 className="font-medium text-bolt-elements-textPrimary flex items-center gap-2">
              <Download className="w-4 h-4" />
              {getTranslation('installationOptions', language)}
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-bolt-elements-background-depth-3">
                <h5 className="font-medium text-bolt-elements-textPrimary mb-2">{getTranslation('quickInstall', language)}</h5>
                <div className="text-xs bg-bolt-elements-background-depth-4 p-3 rounded font-mono text-bolt-elements-textPrimary space-y-1">
                  <div>{getTranslation('commentOneLineInstall', language)}</div>
                  <div>curl https://localai.io/install.sh | sh</div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-bolt-elements-background-depth-3">
                <h5 className="font-medium text-bolt-elements-textPrimary mb-2">{getTranslation('dockerRecommended', language)}</h5>
                <div className="text-xs bg-bolt-elements-background-depth-4 p-3 rounded font-mono text-bolt-elements-textPrimary space-y-1">
                  <div>docker run -p 8080:8080</div>
                  <div>quay.io/go-skynet/local-ai:latest</div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            <h4 className="font-medium text-bolt-elements-textPrimary flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {getTranslation('configuration', language)}
            </h4>
            <div className="p-4 rounded-lg bg-bolt-elements-background-depth-3">
              <p className="text-sm text-bolt-elements-textSecondary mb-3">
                {getTranslation('localAIConfigDesc', language)}
              </p>
              <div className="text-xs bg-bolt-elements-background-depth-4 p-3 rounded font-mono text-bolt-elements-textPrimary space-y-1">
                <div>{getTranslation('commentExampleConfig', language)}</div>
                <div>models:</div>
                <div>- name: llama3.1</div>
                <div>backend: llama</div>
                <div>parameters:</div>
                <div>model: llama3.1.gguf</div>
              </div>
            </div>
          </div>

          {/* Advantages */}
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="font-medium text-green-500">{getTranslation('localAIAdvantages', language)}</span>
            </div>
            <ul className="text-xs text-bolt-elements-textSecondary space-y-1 list-disc list-inside">
              <li>{getTranslation('localAIAdvApiCompat', language)}</li>
              <li>{getTranslation('localAIAdvModelFormats', language)}</li>
              <li>{getTranslation('localAIAdvDocker', language)}</li>
              <li>{getTranslation('localAIAdvGallery', language)}</li>
              <li>{getTranslation('localAIAdvRestApi', language)}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Performance Optimization */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">{getTranslation('performanceOptimizationTitle', language)}</h3>
              <p className="text-sm text-bolt-elements-textSecondary">{getTranslation('performanceOptimizationDesc', language)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-bolt-elements-textPrimary">{getTranslation('hardwareOptimizations', language)}</h4>
              <ul className="text-sm text-bolt-elements-textSecondary space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{getTranslation('perfHwGpu', language)}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{getTranslation('perfHwRam', language)}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{getTranslation('perfHwSsd', language)}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{getTranslation('perfHwCloseApps', language)}</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-bolt-elements-textPrimary">{getTranslation('softwareOptimizations', language)}</h4>
              <ul className="text-sm text-bolt-elements-textSecondary space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{getTranslation('perfSwSmallerModels', language)}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{getTranslation('perfSwQuantization', language)}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{getTranslation('perfSwContextLength', language)}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{getTranslation('perfSwStreaming', language)}</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Options */}
      <Card className="bg-bolt-elements-background-depth-2 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center ring-1 ring-orange-500/30">
              <Wifi className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-bolt-elements-textPrimary">{getTranslation('alternativeOptions', language)}</h3>
              <p className="text-sm text-bolt-elements-textSecondary">
                {getTranslation('alternativeOptionsDesc', language)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-bolt-elements-textPrimary">{getTranslation('otherLocalSolutions', language)}</h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-bolt-elements-background-depth-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-bolt-elements-textPrimary">Jan.ai</span>
                  </div>
                  <p className="text-xs text-bolt-elements-textSecondary">
                    {getTranslation('janAiDesc', language)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-bolt-elements-background-depth-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Terminal className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-bolt-elements-textPrimary">Oobabooga</span>
                  </div>
                  <p className="text-xs text-bolt-elements-textSecondary">
                    {getTranslation('oobaboogaDesc', language)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-bolt-elements-background-depth-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Cable className="w-4 h-4 text-purple-500" />
                    <span className="font-medium text-bolt-elements-textPrimary">KoboldAI</span>
                  </div>
                  <p className="text-xs text-bolt-elements-textSecondary">{getTranslation('koboldAiDesc', language)}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-bolt-elements-textPrimary">{getTranslation('cloudAlternatives', language)}</h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-bolt-elements-background-depth-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-bolt-elements-textPrimary">OpenRouter</span>
                  </div>
                  <p className="text-xs text-bolt-elements-textSecondary">{getTranslation('openRouterDesc', language)}</p>
                </div>
                <div className="p-3 rounded-lg bg-bolt-elements-background-depth-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Server className="w-4 h-4 text-red-500" />
                    <span className="font-medium text-bolt-elements-textPrimary">Together AI</span>
                  </div>
                  <p className="text-xs text-bolt-elements-textSecondary">{getTranslation('togetherAiDesc', language)}</p>
                </div>
                <div className="p-3 rounded-lg bg-bolt-elements-background-depth-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-pink-500" />
                    <span className="font-medium text-bolt-elements-textPrimary">Groq</span>
                  </div>
                  <p className="text-xs text-bolt-elements-textSecondary">{getTranslation('groqDesc', language)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SetupGuide;
