import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { json, urlencoded } from 'body-parser';
import express from 'express';
import { proxyMiddleware } from './middlewares/Proxy';

const PORT = process.env.GATEWAY_PORT || 3000;

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use('*', urlencoded({ extended: true }));
app.use('*', json());

app.use('/api/twitter', proxyMiddleware);

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.get('/debug-sentry', (_req, _res) => {
  throw new Error('My first Sentry error!');
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
