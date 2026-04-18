import { getUserByEmail, createUser, getUser } from '@/lib/firestore'
import { verifyUserToken } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    const verified = token ? await verifyUserToken(token) : null

    if (!verified) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email, googleId } = await request.json()

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if user already exists
    let user = await getUserByEmail(email)

    if (!user) {
      // Create new user with whitelisted = false by default
      user = await createUser(email, googleId)
    } else {
      // Update google ID if not set
      if (googleId && !user.googleId) {
        user.googleId = googleId
      }
    }

    return Response.json({
      id: user.id,
      email: user.email,
      whitelisted: user.whitelisted,
      fanStatus: user.fanStatus,
      paymentStatus: user.paymentStatus,
    })
  } catch (error: any) {
    console.error('Register error:', error)
    return Response.json({ error: error.message || 'Failed to register user' }, { status: 500 })
  }
}
