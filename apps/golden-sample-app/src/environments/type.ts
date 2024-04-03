import { Provider } from '@angular/core';
import { FirebaseOptions } from 'firebase/app';

export interface sharedJourneyConfiguration {
  designSlimMode: boolean;
}

export interface Environment {
  production: boolean;
  apiRoot: string;
  locales: string[];
  mockProviders?: Provider[];
  mockEnabled?: boolean;
  common: sharedJourneyConfiguration;
  isTelemetryTracerEnabled?: boolean;
  bbApiKey?: string;
  telemetryCollectorURL?: string;
  env?: string;
  firebase: FirebaseOptions;
}