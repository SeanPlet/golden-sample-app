import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { AchPositivePayInterceptor } from '../app/interceptors/ach-positive-pay.interceptor';
import { Environment } from './type';

const mockProviders: Provider[] = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AchPositivePayInterceptor,
    multi: true,
  },
];

export const environment: Environment = {
  production: false,
  apiRoot: '/api',
  mockProviders,
  locales: ['en-US', 'nl-NL'],
  common: {
    designSlimMode: false,
  },
  mockEnabled: true,
  isTelemetryTracerEnabled: true,
  bbApiKey: 'a554d1b4-6514-4f33-8211-3f52a03ca142',
  telemetryCollectorURL: 'https://rum-collector.backbase.io/v1/traces',
  env: 'mock',
  firebase: {
    apiKey: "AIzaSyAftDUr8vQ1HtzEeeoT_4b6VdbSVD75fTs",
    authDomain: "golden-sample-app.firebaseapp.com",
    projectId: "golden-sample-app",
    storageBucket: "golden-sample-app.appspot.com",
    messagingSenderId: "53114529371",
    appId: "1:53114529371:web:71b4451da03be4072c817e",
    measurementId: "G-MFK6Q73XMH"
  }
};

export const authConfig: AuthConfig = {
  requireHttps: false,
  showDebugInformation: true,
  logoutUrl: document.baseURI + 'logout',
};
