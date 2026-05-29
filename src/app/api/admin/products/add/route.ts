import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { getDb } from '@/lib/firestore'
import { verifyAdminRequest } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    if (!await verifyAdminRequest(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const name = String(formData.get('name') || '').trim()
    const description = String(formData.get('description') || '').trim()
    const price = Number(formData.get('price') || 0)
    const category = String(formData.get('category') || 'cards').trim()
    const imageFile = formData.get('image') as File | null

    let imagePath = '/images/shop/WhatsApp_Image_2026-04-23_at_19.13.27.jpeg'
    if (imageFile && typeof imageFile.name === 'string') {
      const safeName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`
      const filePath = path.join(process.cwd(), 'public', 'images', 'shop', safeName)
      await writeFile(filePath, Buffer.from(await imageFile.arrayBuffer()))
      imagePath = `/images/shop/${safeName}`
    }

    const ref = await getDb().collection('products').add({
      name,
      description,
      price,
      category,
      image: imagePath,
      inStock: true,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ id: ref.id, success: true, image: imagePath }, { status: 201 })
  } catch (err: any) {
    console.error('Failed to add product:', err)
    return NextResponse.json({ error: err.message || 'Failed to add product' }, { status: 500 })
  }
}
