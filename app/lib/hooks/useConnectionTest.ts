import { useState, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import type { ConnectionTestResult } from '~/components/@settings/shared/service-integration';
import { getTranslation, languageStore } from '~/utils/i18n';

interface UseConnectionTestOptions {
  testEndpoint: string;
  serviceName: string;
  getUserIdentifier?: (data: any) => string;
}

export function useConnectionTest({ testEndpoint, serviceName, getUserIdentifier }: UseConnectionTestOptions) {
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const language = useStore(languageStore);

  const testConnection = useCallback(async () => {
    setTestResult({
      status: 'testing',
      message: getTranslation('testingConnection', language),
    });

    try {
      const response = await fetch(testEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userIdentifier = getUserIdentifier ? getUserIdentifier(data) : getTranslation('user', language);

        setTestResult({
          status: 'success',
          message: getTranslation('connectedSuccessfullyTo', language).replace('{service}', serviceName).replace('{user}', userIdentifier),
          timestamp: Date.now(),
        });
      } else {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string };
        const errorMsg = errorData.error || `${response.status} ${response.statusText}`;
        // Map common error messages to translations
        let translatedError = errorMsg;
        if (errorMsg.includes('token not found')) {
          translatedError = getTranslation('tokenNotFound', language);
        }
        setTestResult({
          status: 'error',
          message: getTranslation('connectionFailed', language).replace('{error}', translatedError),
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      setTestResult({
        status: 'error',
        message: getTranslation('connectionFailed', language).replace('{error}', error instanceof Error ? error.message : getTranslation('unknownError', language)),
        timestamp: Date.now(),
      });
    }
  }, [testEndpoint, serviceName, getUserIdentifier, language]);

  const clearTestResult = useCallback(() => {
    setTestResult(null);
  }, []);

  return {
    testResult,
    testConnection,
    clearTestResult,
    isTestingConnection: testResult?.status === 'testing',
  };
}
