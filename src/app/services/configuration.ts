import { Injectable } from '@angular/core';

// Kielten tyypit
export interface LanguageData {
  name: string;
  flag: string;
  translation: string;
}

// REST-palvelun konfiguraatio
export interface ServiceQueueConfig {
  viewId?: string;
  homeViewId?: string;
  authorization: string;
  URI: string;
  ptjId?: number;
}

// Sovelluksen konfiguraatio
export interface AppConfiguration {
  productVersion: string;
  assemblyLineTest: string;
  brand: string;
  guiTimeout: number;
  guiReservationIdentifyQueueButton: boolean;
  guiReservationCheckQueueButton: boolean;
  guiReservationInfoPage: boolean;
  guiOnErrorPatientToCS: boolean;
  isTestingMode: boolean;
  guiInitialZoom: number;
  checkInterval: number;
  idleTime: number;
  timeout: number;
  keepaliveInterval: number;
  helpAvailable: number;
  helpCustomerId: number;
  guidanceAvailable: number;
  supportedLanguages: string[];
  preferredLanguage: string;
  fallbackLanguage: string[];
  queues: {
    [key: string]: {
      active: boolean;
    };
  };
  languageData: {
    [key: string]: LanguageData;
  };
  restService: {
    requestTimeout: number;
    viewId: string;
    homeViewId: string;
    serviceQueueRegistrations: ServiceQueueConfig[];
    calendar: {
      authorization: string;
      URI: string;
    };
    services: {
      authorization: string;
      URI: string;
    };
    configs: {
      authorization: string;
      URI: string;
    };
    translations: {
      authorization: string;
      URI: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class Configuration {

  // Sovelluksen konfiguraatio
  private config: AppConfiguration = {
    productVersion: '4.0.23',
    assemblyLineTest: 'B0470AF41EC028000=00001TE',
    brand: 'siunsote',
    guiTimeout: 60000,
    guiReservationIdentifyQueueButton: true,
    guiReservationCheckQueueButton: true,
    guiReservationInfoPage: true,
    guiOnErrorPatientToCS: false,
    isTestingMode: true, // Muuta false tuotannossa!
    guiInitialZoom: 1,
    checkInterval: 10, // sekunteina
    idleTime: 10, // sekunteina
    timeout: 10, // sekunteina
    keepaliveInterval: 600, // sekunteina
    helpAvailable: 0,
    helpCustomerId: 0,
    guidanceAvailable: 0,
    supportedLanguages: ['fi', 'se', 'en', 'ru', 'de', 'fr', 'ee', 'es', 'nl'],
    preferredLanguage: 'fi',
    fallbackLanguage: ['fi'],
    queues: {
      Q0: { active: true }, // ilman ajanvarausta
      Q1: { active: true }  // asiakaspalvelu
    },
    languageData: {
      fi: { name: 'fi', flag: 'flag-fi', translation: 'LANG_FIN' },
      se: { name: 'se', flag: 'flag-se', translation: 'LANG_SWE' },
      en: { name: 'en', flag: 'flag-gb', translation: 'LANG_ENG' },
      ru: { name: 'ru', flag: 'flag-ru', translation: 'LANG_RUS' },
      de: { name: 'de', flag: 'flag-de', translation: 'LANG_DE' },
      fr: { name: 'fr', flag: 'flag-fr', translation: 'LANG_FR' },
      ee: { name: 'ee', flag: 'flag-ee', translation: 'LANG_EE' },
      es: { name: 'es', flag: 'flag-es', translation: 'LANG_ES' },
      nl: { name: 'nl', flag: 'flag-nl', translation: 'LANG_NL' }
    },
    restService: {
      requestTimeout: 40000,
      viewId: '444-123456',
      homeViewId: '444-123456',
      serviceQueueRegistrations: [
        {
          // MEDIATRI/NEARIS TK
          authorization: 'Basic ZmhLQ3gxV3lvQ3krdW85aWhLTmxDOG10dTRvRm5mSmZKeXZnaGZxVW1Jbz06eDNYbnQxZnQ1akROQ3FFUk85RUNaaHF6aUNuS1VxWkNLcmVDaGk4bWhrWT0=',
          URI: 'https://localhost/WebTimmi/rest/servicequeueregistrations/1'
        }
      ],
      calendar: {
        authorization: 'Basic ZmhLQ3gxV3lvQ3krdW85aWhLTmxDOG10dTRvRm5mSmZKeXZnaGZxVW1Jbz06eDNYbnQxZnQ1akROQ3FFUk85RUNaaHF6aUNuS1VxWkNLcmVDaGk4bWhrWT0=',
        URI: 'https://localhost/WebTimmi/rest/calendar/1'
      },
      services: {
        authorization: 'Basic ZmhLQ3gxV3lvQ3krdW85aWhLTmxDOG10dTRvRm5mSmZKeXZnaGZxVW1Jbz06eDNYbnQxZnQ1akROQ3FFUk85RUNaaHF6aUNuS1VxWkNLcmVDaGk4bWhrWT0=',
        URI: 'https://localhost/WebTimmi/rest/kioskservices/1'
      },
      configs: {
        authorization: 'Basic ZmhLQ3gxV3lvQ3krdW85aWhLTmxDOG10dTRvRm5mSmZKeXZnaGZxVW1Jbz06eDNYbnQxZnQ1akROQ3FFUk85RUNaaHF6aUNuS1VxWkNLcmVDaGk4bWhrWT0=',
        URI: 'https://localhost/WebTimmi/rest/selfservicekiosk/1'
      },
      translations: {
        authorization: 'Basic ZmhLQ3gxV3lvQ3krdW85aWhLTmxDOG10dTRvRm5mSmZKeXZnaGZxVW1Jbz06eDNYbnQxZnQ1akROQ3FFUk85RUNaaHF6aUNuS1VxWkNLcmVDaGk4bWhrWT0=',
        URI: 'https://localhost/WebTimmi/rest/translate/1/1'
      }
    }
  };

  constructor() { }

  /**
   * Palauttaa koko konfiguraation
   */
  getConfig(): AppConfiguration {
    return this.config;
  }

  /**
   * Palauttaa REST-palvelun konfiguraation
   */
  getRestConfig() {
    return this.config.restService;
  }

  /**
   * Palauttaa serviceQueueRegistrations-konfiguraatiot
   */
  getServiceQueueConfigs(): ServiceQueueConfig[] {
    return this.config.restService.serviceQueueRegistrations;
  }

  /**
   * Palauttaa kalenterin konfiguraation
   */
  getCalendarConfig() {
    return this.config.restService.calendar;
  }

  /**
   * Palauttaa palveluiden konfiguraation
   */
  getServicesConfig() {
    return this.config.restService.services;
  }

  /**
   * Palauttaa käännösten konfiguraation
   */
  getTranslationsConfig() {
    return this.config.restService.translations;
  }

  /**
   * Palauttaa kielten tiedot
   */
  getLanguageData() {
    return this.config.languageData;
  }

  /**
   * Palauttaa tuetut kielet
   */
  getSupportedLanguages(): string[] {
    return this.config.supportedLanguages;
  }

  /**
   * Palauttaa oletuskielen
   */
  getPreferredLanguage(): string {
    return this.config.preferredLanguage;
  }

  /**
   * Palauttaa varakielet
   */
  getFallbackLanguages(): string[] {
    return this.config.fallbackLanguage;
  }

  /**
   * Palauttaa onko testaustila päällä
   */
  isTestingMode(): boolean {
    return this.config.isTestingMode;
  }

  /**
   * Palauttaa timeout-ajan
   */
  getRequestTimeout(): number {
    return this.config.restService.requestTimeout;
  }

  /**
   * Palauttaa idle-ajan
   */
  getIdleTime(): number {
    return this.config.idleTime;
  }

  /**
   * Palauttaa GUI timeout-ajan
   */
  getGuiTimeout(): number {
    return this.config.guiTimeout;
  }
}