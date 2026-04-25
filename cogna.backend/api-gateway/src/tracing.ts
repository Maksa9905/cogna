// Загружается через NODE_OPTIONS=--require **до** main (см. package.json) — иначе HTTP/Express уходят мимо patch’ей.
import 'dotenv/config';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

function resolveOtlpTracesUrl(): string {
  const direct = process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT;
  if (direct) {
    return direct;
  }
  const base = process.env.OTEL_EXPORTER_OTLP_ENDPOINT?.replace(/\/$/, '');
  if (base) {
    return `${base}/v1/traces`;
  }
  return 'http://127.0.0.1:4318/v1/traces';
}

const logLevel = process.env.OTEL_LOG_LEVEL;
diag.setLogger(
  new DiagConsoleLogger(),
  logLevel === 'debug' ? DiagLogLevel.DEBUG : DiagLogLevel.ERROR,
);

if (process.env.OTEL_SDK_DISABLED === 'true') {
  // eslint-disable-next-line no-console
  console.log('OpenTelemetry: disabled (OTEL_SDK_DISABLED=true)');
} else {
  const sdk = new NodeSDK({
    resource: new Resource({
      [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME ?? 'api-gateway',
    }),
    traceExporter: new OTLPTraceExporter({ url: resolveOtlpTracesUrl() }),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
      new GraphQLInstrumentation({ mergeItems: true, depth: 2 }),
    ],
  });
  sdk.start();
  // eslint-disable-next-line no-console
  console.log(`OpenTelemetry: started → traces → ${resolveOtlpTracesUrl()}`);

  const shutdown = () => {
    sdk
      .shutdown()
      .catch(() => undefined)
      .finally(() => process.exit(0));
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
