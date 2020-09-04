import { createProxyMiddleware } from 'http-proxy-middleware';
import { FRONTEND_CONFIG } from '../Config';

export const proxyMiddleware = createProxyMiddleware({
  target: `http://${FRONTEND_CONFIG.host}:${FRONTEND_CONFIG.port}`,
  changeOrigin: false,
  ws: true,
  // NOTE: body-parserにバラされたrequestを再び組み立てる
  // 参考URL: https://github.com/chimurai/http-proxy-middleware/issues/40
  onProxyReq: (proxyReq, req) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
});
