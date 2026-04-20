import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/firebase-admin'
import { updateAdmin, deleteAdmin } from '@/lib/firestore'

export const dynamic = 'force-dynamic'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!await verifyAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const adminId = params.id
    const updates: Record<string, any> = {}

    if (body.role) updates.role = body.role
    if (body.email) updates.email = body.email.trim().toLowerCase()

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    await updateAdmin(adminId, updates)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update admin:', error)
    return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!await verifyAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const adminId = params.id
    await deleteAdmin(adminId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete admin:', error)
    return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 })
  }
}
