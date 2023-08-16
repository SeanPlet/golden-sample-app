import { registerInstrumentations } from '@opentelemetry/instrumentation';
import {
  WebTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  BatchSpanProcessor,
  TraceIdRatioBasedSampler,
  Span,
} from '@opentelemetry/sdk-trace-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

type Environments = 'prd' | 'stg' | 'dev' | 'local' | 'mock' | string;

export interface OpenTelemetryConfig {
  apiKey: string;
  appVersion: string;
  appName: string;
  env?: Environments;
  isEnabled: boolean;
  isProduction: boolean;
  url: string;
}

export function instrumentOpenTelemetry(
  opentelemetryConfig: OpenTelemetryConfig
) {
  if (!opentelemetryConfig.isEnabled) {
    console.log('Tracer is disabled');
    return;
  }

  const resource = Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: opentelemetryConfig.appName,
      [SemanticResourceAttributes.SERVICE_VERSION]:
        opentelemetryConfig.appVersion,
    })
  );

  const provider = new WebTracerProvider({
    resource,
    sampler: new TraceIdRatioBasedSampler(1),
  });

  const SpanProcessor = opentelemetryConfig.isProduction
    ? BatchSpanProcessor
    : SimpleSpanProcessor;

  // For demo purposes only, immediately log traces to the console
  provider.addSpanProcessor(new SpanProcessor(new ConsoleSpanExporter()));

  // Batch traces before sending them to backend server
  provider.addSpanProcessor(
    new SpanProcessor(
      new OTLPTraceExporter({
        url: opentelemetryConfig.url,
        headers: {
          'BB-App-Key': opentelemetryConfig.apiKey,
        },
      })
    )
  );

  provider.getActiveSpanProcessor().onStart = (span: Span) => {
    span.setAttribute('view.name', document.title);
    span.setAttribute('view.url', document.location.href);
    span.setAttribute('custom', 'Ankit is awesome!');
  };

  provider.register({ contextManager: new ZoneContextManager() });

  registerInstrumentations({
    instrumentations: [
      getWebAutoInstrumentations({
        '@opentelemetry/instrumentation-document-load': {},
        '@opentelemetry/instrumentation-user-interaction': {
          eventNames: ['click', 'submit', 'error', 'input'],
        },
        '@opentelemetry/instrumentation-fetch': {},
        '@opentelemetry/instrumentation-xml-http-request': {},
      }),
    ],
  });
}
