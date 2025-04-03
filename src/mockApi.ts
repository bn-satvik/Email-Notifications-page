
interface ResultConfiguration {
    confidenceThreshold: number;
    showSensitiveOnly: boolean;
}

interface AlertConfiguration {
    endUserAlertsLastModifiedThresholdInMinutes: number;
    notifierIds: string[];
    sendEndUserAlerts: boolean;
    sendRemediationAlerts: boolean;
    alertsBatchingHourlyInterval: number;
}

interface DigestConfiguration {
    digestHourlyInterval: number;
    emailDestinations: string[];
    findingConfidenceThreshold: number;
    notifierIds: string[];
    sendDigests: boolean;
}

interface CodeusAccountConfig {
    accountId: string;
    previewExpirationDays: number;
    reportExpirationDays: number | undefined;
    limitMode: string;
    resultConfiguration: ResultConfiguration;
    alertConfiguration: AlertConfiguration;
    digestConfiguration: DigestConfiguration;
    storageRegion: string;
    onboardedTime: string;
}
// Mock API responses for testing
let mockData = {
    accountId: "dfsdsdsdsdsd",
    previewExpirationDays: 0, // Default to a valid number
    reportExpirationDays: undefined,
    limitMode: "Normal",
    resultConfiguration: {
      confidenceThreshold: 0.8,
      showSensitiveOnly: true,
    },
    alertConfiguration: {
      endUserAlertsLastModifiedThresholdInMinutes: 60,
      notifierIds: [],
      sendEndUserAlerts: true,
      sendRemediationAlerts: true,
      alertsBatchingHourlyInterval: 1,
    },
    digestConfiguration: {
      digestHourlyInterval: 24,
      emailDestinations: [],
      findingConfidenceThreshold: 0.8,
      notifierIds: [],
      sendDigests: true,
    },
    storageRegion: "US",
    onboardedTime: "2024-10-01T13:27:51.08Z",
  };
  

  export function getMockApiResponse(): Promise<CodeusAccountConfig> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockData);
          }, 1000);
    });
}
  
  // Mock PATCH Request


export const patchMockApiResponse = (updates: Partial<CodeusAccountConfig>): Promise<CodeusAccountConfig> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            mockData = { ...mockData, ...updates };
            resolve(mockData);
        }, 500); 
    });
};
  