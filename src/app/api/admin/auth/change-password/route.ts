import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, verifyAdminRequest } from '@/lib/firebase-admin'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword, updatePassword } from 'firebase/auth'

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    if (!(await verifyAdminRequest(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Get current user from token
    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.replace(/^Bearer\s+/i, '').trim()

    if (!adminAuth) {
      return NextResponse.json({ error: 'Admin auth not initialized' }, { status: 500 })
    }

    const decodedToken = await adminAuth.verifyIdToken(token)
    const userEmail = decodedToken.email

    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found in token' }, { status: 400 })
    }

    // Import auth dynamically to avoid initialization issues
    const { auth } = await import('@/lib/firebase')
    if (!auth) {
      return NextResponse.json({ error: 'Firebase auth not initialized' }, { status: 500 })
    }

    // Verify current password by attempting to sign in
    try {
      await signInWithEmailAndPassword(auth, userEmail, currentPassword)
    } catch (error: any) {
      console.error('Current password verification failed:', error.message)
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Get the current user after verification
    const currentUser = auth.currentUser
    if (!currentUser) {
      return NextResponse.json({ error: 'User session not found' }, { status: 400 })
    }

    // Update password
    try {
      await updatePassword(currentUser, newPassword)
      console.log(`Password updated successfully for admin: ${userEmail}`)
    } catch (error: any) {
      console.error('Password update failed:', error.message)
      return NextResponse.json(
        { error: 'Failed to update password. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully' })

  } catch (error: any) {
    console.error('Password change API error:', error.message)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}