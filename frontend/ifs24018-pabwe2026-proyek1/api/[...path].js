const API_PREFIX = '/api';
const ALLOWED_RESPONSE_HEADERS = ['cache-control', 'content-type', 'retry-after', 'www-authenticate'];

function sendJson(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

export default async function apiProxy(req, res) {
  const backendUrl = process.env.BACKEND_API_URL;
  if (!backendUrl) {
    return sendJson(res, 503, 'API_NOT_CONFIGURED', 'Backend API belum dikonfigurasi di Vercel.');
  }

  let backendOrigin;
  try {
    const configuredUrl = new URL(backendUrl);
    if (!['http:', 'https:'].includes(configuredUrl.protocol) || configuredUrl.pathname !== '/' || configuredUrl.search || configuredUrl.hash) {
      return sendJson(res, 500, 'INVALID_BACKEND_URL', 'BACKEND_API_URL harus berupa URL origin backend tanpa path.');
    }
    backendOrigin = configuredUrl.origin;
  } catch {
    return sendJson(res, 500, 'INVALID_BACKEND_URL', 'BACKEND_API_URL bukan URL yang valid.');
  }

  const incomingUrl = new URL(req.url || API_PREFIX, 'https://vercel.invalid');
  if (incomingUrl.pathname !== API_PREFIX && !incomingUrl.pathname.startsWith(`${API_PREFIX}/`)) {
    return sendJson(res, 404, 'NOT_FOUND', 'Endpoint API tidak ditemukan.');
  }

  const headers = {};
  for (const name of ['accept', 'authorization', 'content-type']) {
    const value = req.headers[name];
    if (typeof value === 'string') headers[name] = value;
  }

  let body;
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body !== undefined) {
    body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  try {
    const response = await fetch(`${backendOrigin}${incomingUrl.pathname}${incomingUrl.search}`, {
      method: req.method,
      headers,
      body,
    });

    res.status(response.status);
    for (const name of ALLOWED_RESPONSE_HEADERS) {
      const value = response.headers.get(name);
      if (value) res.setHeader(name, value);
    }

    if (req.method === 'HEAD' || response.status === 204 || response.status === 304) return res.end();
    return res.send(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error('Backend API proxy request failed:', error);
    return sendJson(res, 502, 'BACKEND_UNAVAILABLE', 'Backend tidak dapat dihubungi. Periksa deployment backend.');
  }
}
