import { afterEach, describe, expect, it, vi } from 'vitest';
import apiProxy from './[...path].js';

function createResponse() {
  return {
    headers: {},
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    setHeader(name, value) { this.headers[name] = value; },
    json(value) { this.body = value; return this; },
    send(value) { this.body = value; return this; },
    end() { this.ended = true; return this; },
  };
}

describe('Vercel API proxy', () => {
  afterEach(() => {
    delete process.env.BACKEND_API_URL;
    vi.unstubAllGlobals();
  });

  it('returns a clear configuration error when backend URL is missing', async () => {
    const response = createResponse();

    await apiProxy({ url: '/api/auth/login', method: 'POST', headers: {}, body: {} }, response);

    expect(response.statusCode).toBe(503);
    expect(response.body.error.code).toBe('API_NOT_CONFIGURED');
  });

  it('forwards login URL, body and authorization and passes backend response back', async () => {
    process.env.BACKEND_API_URL = 'https://planner-api.example';
    const fetch = vi.fn().mockResolvedValue({
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      arrayBuffer: async () => new TextEncoder().encode('{"token":"session-token"}').buffer,
    });
    vi.stubGlobal('fetch', fetch);
    const response = createResponse();

    await apiProxy({
      url: '/api/auth/login?source=web',
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer previous-token' },
      body: { email: 'user@example.com', password: 'password123' },
    }, response);

    expect(fetch).toHaveBeenCalledWith('https://planner-api.example/api/auth/login?source=web', {
      method: 'POST',
      headers: {
        authorization: 'Bearer previous-token',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email: 'user@example.com', password: 'password123' }),
    });
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('application/json');
    expect(response.body.toString()).toBe('{"token":"session-token"}');
  });

  it('returns an actionable error for an invalid backend URL', async () => {
    process.env.BACKEND_API_URL = 'not-a-url';
    const response = createResponse();

    await apiProxy({ url: '/api/auth/login', method: 'POST', headers: {}, body: {} }, response);

    expect(response.statusCode).toBe(500);
    expect(response.body.error.code).toBe('INVALID_BACKEND_URL');
  });
});
