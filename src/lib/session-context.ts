import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

/**
 * Get the active session for the current user
 */
export async function getActiveSession(userId: string) {
  const userSession = await prisma.userSession.findFirst({
    where: {
      userId,
      isActive: true,
    },
    include: {
      session: {
        include: {
          jurisdiction: true,
          _count: {
            select: {
              bills: true,
              hearings: true,
            },
          },
        },
      },
    },
  })

  return userSession?.session || null
}

/**
 * Get all sessions the user has access to
 */
export async function getUserSessions(userId: string) {
  const userSessions = await prisma.userSession.findMany({
    where: {
      userId,
    },
    include: {
      session: {
        include: {
          jurisdiction: true,
          _count: {
            select: {
              bills: true,
            },
          },
        },
      },
    },
    orderBy: {
      joinedAt: "desc",
    },
  })

  return userSessions.map((us: { session: any; role: string; isActive: boolean }) => ({
    ...us.session,
    role: us.role,
    isActive: us.isActive,
  }))
}

/**
 * Switch user's active session
 */
export async function switchActiveSession(userId: string, sessionId: string) {
  // First, deactivate all sessions for this user
  await prisma.userSession.updateMany({
    where: {
      userId,
      isActive: true,
    },
    data: {
      isActive: false,
    },
  })

  // Then activate the requested session
  // Ensure user has access to this session
  const userSession = await prisma.userSession.findUnique({
    where: {
      userId_sessionId: {
        userId,
        sessionId,
      },
    },
  })

  if (!userSession) {
    throw new Error("User does not have access to this session")
  }

  await prisma.userSession.update({
    where: {
      id: userSession.id,
    },
    data: {
      isActive: true,
    },
  })

  return prisma.legislativeSession.findUnique({
    where: { id: sessionId },
    include: {
      jurisdiction: true,
    },
  })
}

/**
 * Get session context for current authenticated user
 */
export async function getSessionContext() {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }

  const activeSession = await getActiveSession(session.user.id)
  return {
    user: session.user,
    activeSession,
  }
}

/**
 * Check if user has access to a session
 */
export async function hasSessionAccess(userId: string, sessionId: string) {
  const userSession = await prisma.userSession.findUnique({
    where: {
      userId_sessionId: {
        userId,
        sessionId,
      },
    },
  })

  return !!userSession
}

/**
 * Get user's role in a session
 */
export async function getSessionRole(userId: string, sessionId: string) {
  const userSession = await prisma.userSession.findUnique({
    where: {
      userId_sessionId: {
        userId,
        sessionId,
      },
    },
  })

  return userSession?.role || null
}

