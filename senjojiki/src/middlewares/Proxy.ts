import { createProxyMiddleware } from 'http-proxy-middleware';

export const proxyMiddleware = createProxyMiddleware({
  target: 'http://backend:8080',
  changeOrigin: false,
  ws: false,
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
