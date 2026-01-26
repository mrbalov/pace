import { describe, test, expect } from 'bun:test';
import setTokens from './set-tokens';
import type { ServerConfig } from '../../types';
import { COOKIE_NAMES } from '../../types';

describe('setTokens', () => {
  const cookieConfig: ServerConfig['cookies'] = {
    secure: false,
    sameSite: 'lax',
  };

  test('sets tokens as cookies with correct attributes', () => {
    const response = new Response();
    const accessToken = 'access-token-123';
    const refreshToken = 'refresh-token-123';
    const expiresAt = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

    const result = setTokens(response, accessToken, refreshToken, expiresAt, cookieConfig);

    const setCookieHeaders = result.headers.getSetCookie();
    expect(setCookieHeaders.length).toBe(3);

    const cookies = setCookieHeaders.join('; ');
    expect(cookies).toContain(`${COOKIE_NAMES.ACCESS_TOKEN}=${accessToken}`);
    expect(cookies).toContain(`${COOKIE_NAMES.REFRESH_TOKEN}=${refreshToken}`);
    expect(cookies).toContain(`${COOKIE_NAMES.TOKEN_EXPIRES_AT}=${expiresAt}`);
    expect(cookies).toContain('HttpOnly');
    expect(cookies).toContain('SameSite=lax');
    expect(cookies).toContain('Path=/');
  });

  test('includes secure flag when configured', () => {
    const secureConfig: ServerConfig['cookies'] = {
      ...cookieConfig,
      secure: true,
    };

    const response = new Response();
    const result = setTokens(response, 'token', 'refresh', 1234567890, secureConfig);

    const cookies = result.headers.getSetCookie().join('; ');
    expect(cookies).toContain('Secure');
  });

  test('includes domain when configured', () => {
    const domainConfig: ServerConfig['cookies'] = {
      ...cookieConfig,
      domain: 'example.com',
    };

    const response = new Response();
    const result = setTokens(response, 'token', 'refresh', 1234567890, domainConfig);

    const cookies = result.headers.getSetCookie().join('; ');
    expect(cookies).toContain('Domain=example.com');
  });

  test('sets Max-Age based on expiration time', () => {
    const response = new Response();
    const expiresAt = Math.floor(Date.now() / 1000) + 7200; // 2 hours from now

    const result = setTokens(response, 'token', 'refresh', expiresAt, cookieConfig);

    const cookies = result.headers.getSetCookie().join('; ');
    expect(cookies).toMatch(/Max-Age=\d+/);
  });
});
