import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const products = [
    {
      id: '1',
      name: 'Jonathan Roumie Fan Card',
      description: 'Exclusive personalized fan card with your name',
      price: 50,
      image: 'https://i.ibb.co/m5Xz2Vy2/image.png',
      category: 'cards',
    },
    {
      id: '2',
      name: 'Exclusive Merchandise Bundle',
      description: 'Limited edition Jonathan Roumie merchandise',
      price: 75,
      image: 'https://i.ibb.co/m5Xz2Vy2/image.png',
      category: 'merchandise',
    },
    {
      id: '3',
      name: 'VIP Event Pass',
      description: 'Access to exclusive VIP events and meet-and-greets',
      price: 150,
      image: 'https://i.ibb.co/m5Xz2Vy2/image.png',
      category: 'events',
    },
  ]
  return NextResponse.json(products)
}
