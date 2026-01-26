import { describe, test, expect } from 'bun:test';
import getTokens from './get-tokens';
import { COOKIE_NAMES } from '../../types';

describe('getTokens', () => {
  test('extracts tokens from cookies', () => {
    const cookies = [
      `${COOKIE_NAMES.ACCESS_TOKEN}=access-token-123`,
      `${COOKIE_NAMES.REFRESH_TOKEN}=refresh-token-123`,
      `${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`,
    ].join('; ');

    const request = new Request('http://localhost:3000', {
      headers: {
        Cookie: cookies,
      },
    });

    const tokens = getTokens(request);

    expect(tokens).not.toBeNull();
    expect(tokens!.accessToken).toBe('access-token-123');
    expect(tokens!.refreshToken).toBe('refresh-token-123');
    expect(tokens!.expiresAt).toBe(1234567890);
  });

  test('returns null when cookies are missing', () => {
    const request = new Request('http://localhost:3000');
    const tokens = getTokens(request);

    expect(tokens).toBeNull();
  });

  test('returns null when access token is missing', () => {
    const cookies = [
      `${COOKIE_NAMES.REFRESH_TOKEN}=refresh-token-123`,
      `${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`,
    ].join('; ');

    const request = new Request('http://localhost:3000', {
      headers: {
        Cookie: cookies,
      },
    });

    const tokens = getTokens(request);
    expect(tokens).toBeNull();
  });

  test('returns null when refresh token is missing', () => {
    const cookies = [
      `${COOKIE_NAMES.ACCESS_TOKEN}=access-token-123`,
      `${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`,
    ].join('; ');

    const request = new Request('http://localhost:3000', {
      headers: {
        Cookie: cookies,
      },
    });

    const tokens = getTokens(request);
    expect(tokens).toBeNull();
  });

  test('returns null when expires_at is invalid', () => {
    const cookies = [
      `${COOKIE_NAMES.ACCESS_TOKEN}=access-token-123`,
      `${COOKIE_NAMES.REFRESH_TOKEN}=refresh-token-123`,
      `${COOKIE_NAMES.TOKEN_EXPIRES_AT}=invalid`,
    ].join('; ');

    const request = new Request('http://localhost:3000', {
      headers: {
        Cookie: cookies,
      },
    });

    const tokens = getTokens(request);
    expect(tokens).toBeNull();
  });

  test('handles URL-encoded cookie values', () => {
    const cookies = [
      `${COOKIE_NAMES.ACCESS_TOKEN}=access%2Dtoken%2D123`,
      `${COOKIE_NAMES.REFRESH_TOKEN}=refresh%2Dtoken%2D123`,
      `${COOKIE_NAMES.TOKEN_EXPIRES_AT}=1234567890`,
    ].join('; ');

    const request = new Request('http://localhost:3000', {
      headers: {
        Cookie: cookies,
      },
    });

    const tokens = getTokens(request);

    expect(tokens).not.toBeNull();
    expect(tokens!.accessToken).toBe('access-token-123');
    expect(tokens!.refreshToken).toBe('refresh-token-123');
  });
});
