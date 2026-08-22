const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { trace } = require('@opentelemetry/api');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { PgInstrumentation } = require('@opentelemetry/instrumentation-pg');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');

const exporter = new JaegerExporter({
  endpoint: 'http://jaeger-all-in-one-inmemory-collector.opentelemetry-js-rhosdt.svc:14268/api/traces'
});

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'nodejs-rest-http-crud'
  })
});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

provider.register();

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new PgInstrumentation()
  ],
  tracerProvider: provider
});

trace.getTracer('nodejs-rest-http-crud');
