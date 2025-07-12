import { describe, it, expect } from '@jest/globals';

// 复制自 trpc.ts
function getUserIdFromSession(session: unknown): string | undefined {
  if (
    session && typeof session === 'object'
  ) {
    if ('user' in session && typeof (session as { user?: { id?: unknown } }).user === 'object') {
      const user = (session as { user?: { id?: unknown } }).user;
      if (user && typeof user === 'object' && 'id' in user && typeof (user as { id?: unknown }).id === 'string') {
        return (user as { id: string }).id;
      }
    }
    if ('userId' in session && typeof (session as { userId?: unknown }).userId === 'string') {
      return (session as { userId: string }).userId;
    }
    if ('id' in session && typeof (session as { id?: unknown }).id === 'string') {
      return (session as { id: string }).id;
    }
  }
  return undefined;
}

describe('getUserIdFromSession', () => {
  it('should extract user.id from session.user', () => {
    expect(getUserIdFromSession({ user: { id: 'abc123' } })).toBe('abc123');
  });
  it('should extract userId from session', () => {
    expect(getUserIdFromSession({ userId: 'def456' })).toBe('def456');
  });
  it('should extract id from session', () => {
    expect(getUserIdFromSession({ id: 'ghi789' })).toBe('ghi789');
  });
  it('should return undefined for empty session', () => {
    expect(getUserIdFromSession({})).toBeUndefined();
    expect(getUserIdFromSession(null)).toBeUndefined();
    expect(getUserIdFromSession(undefined)).toBeUndefined();
  });
  it('should return undefined for session.user without id', () => {
    expect(getUserIdFromSession({ user: {} })).toBeUndefined();
  });
  it('should return undefined for non-string id', () => {
    expect(getUserIdFromSession({ user: { id: 123 } })).toBeUndefined();
    expect(getUserIdFromSession({ userId: 456 })).toBeUndefined();
    expect(getUserIdFromSession({ id: 789 })).toBeUndefined();
  });
}); 