export const sessions: Record<
  string,
  { sessionId: string; email: string; name: string; valid: boolean; userId: string, role: string }
> = {};

export const getSession = (sessionId: string) => {
  const session = sessions[sessionId];

  return session && session.valid ? session : null;
};

export const invalidateSession = (sessionId: string) => {
  const session = sessions[sessionId];
  if (session) {
    session.valid = false;
  }

  return sessions[sessionId];
};

export const createSession = (email: string, name: string, userId: string, role: string) => {
  const sessionId = String(Object.keys(sessions).length + 1);

  const session = { sessionId, email, name, userId, role, valid: true };
  sessions[sessionId] = session;

  return session;
};
