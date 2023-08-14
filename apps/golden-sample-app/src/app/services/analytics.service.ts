import {Injectable} from '@angular/core';
import {
    ScreenResizeTrackerEvent,
    ScreenViewTrackerEvent,
    TrackerEvent,
    TrackerEventPayload,
    TrackerHandler,
    UserActionTrackerEvent,
} from '@backbase/foundation-ang/observability';

import openTelemetry, {Span} from '@opentelemetry/api';

/*
This service will receive all the analytics events from your application and from here you can
send all your tracker events to the analytics system (eg: google analytics/segment stc)
 */
@Injectable()
export class AnalyticsService extends TrackerHandler {
    private tracer = openTelemetry.trace.getTracer('@backbase/observability');

    register(): void {
        this.tracker.subscribeAll((event) => {
            console.log('EVENT TRACKER', event);
            this.tracer.startActiveSpan('backbase-tracker-handler', (span) => {
                this.sendEvent(event, span);
                span.end();
            });
        });
    }

    private sendEvent(
        event: TrackerEvent<string, TrackerEventPayload>,
        activeSpan: Span
    ) {
        const payload = event.payload as TrackerEventPayload;
        let attributes = {} as any;
        if (event instanceof ScreenViewTrackerEvent) {
            attributes['event-type'] = 'screen-view';
            attributes['name'] = payload['name'];
            attributes['title'] = payload['title'];
            attributes['url'] = payload['url'];
        } else if (event instanceof ScreenResizeTrackerEvent) {
            attributes['event-type'] = 'screen-resize';
            attributes['width'] = payload['width'];
            attributes['height'] = payload['height'];
        } else if (event instanceof UserActionTrackerEvent) {
            attributes['event-type'] = 'user-action';
            attributes = payload;
        }
        console.log('Adding attributes to Active Span', activeSpan,  attributes);
        activeSpan.setAttributes(attributes);
    }
}
