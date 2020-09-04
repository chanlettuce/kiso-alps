export const PORT = +(process.env.GATEWAY_PORT || 3000);

export const FRONTEND_CONFIG = (() => {
  const { FRONTEND_HOST, FRONTEND_PORT } = process.env;

  if (!FRONTEND_HOST || !FRONTEND_PORT) {
    throw new Error('フロントエンド設定の不備');
  }

  return {
    host: FRONTEND_HOST,
    port: FRONTEND_PORT,
  };
})();
