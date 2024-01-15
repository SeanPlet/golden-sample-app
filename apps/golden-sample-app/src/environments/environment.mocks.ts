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
};

export const authConfig: AuthConfig = {
  issuer:
    'https://identity.prd.sdbxaz.azure.backbaseservices.com/auth/realms/customer',
  // URL of the SPA to redirect the user to after login
  redirectUri: document.baseURI,
  // The SPA's id. The SPA is registered with this id at the auth-server
  clientId: 'bb-web-client',
  responseType: 'code',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  scope: 'openid',

  requireHttps: false,
  showDebugInformation: true,
  logoutUrl: document.baseURI + 'logout',
};
