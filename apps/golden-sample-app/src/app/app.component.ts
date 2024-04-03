import { Component, OnInit, ChangeDetectorRef, Optional } from '@angular/core';
import { LayoutService } from '@backbase/ui-ang/layout';
import { triplets } from './services/entitlementsTriplets';
import { OAuthService } from 'angular-oauth2-oidc';
import { LogoutTrackerEvent, Tracker } from '@backbase/foundation-ang/observability';
import { environment } from '../environments/environment';
import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  triplets = triplets;
  isAuthenticated = false;
  isFeature1Enabled: boolean = false;

  constructor(
    private oAuthService: OAuthService,
    public layoutService: LayoutService,
    private remoteConfig: AngularFireRemoteConfig,
    private cdr: ChangeDetectorRef,
    @Optional() private readonly tracker?: Tracker
  ) {
    this.isAuthenticated = environment.mockEnabled ?? oAuthService.hasValidAccessToken();
    this.fetchFeatureFlag();
  }

  async fetchFeatureFlag() {
    try {
      await this.remoteConfig.fetchAndActivate();
      this.isFeature1Enabled = await this.remoteConfig.getBoolean("Feature_1");
      this.cdr.detectChanges();
    } catch (error) {
      console.error("Error fetching feature flag:", error);
    }
  }

  logout(): void {
    this.tracker?.publish(new LogoutTrackerEvent());
    this.oAuthService.logOut(true);
  }

  focusMainContainer(event: MouseEvent) {
    const element = event.view?.window.document.querySelector(
      '[role="main"]'
    ) as HTMLElement | undefined;
    element?.focus();
  }
}
