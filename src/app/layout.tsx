import type { Metadata } from 'next'
import './globals.css'
import { UserAuthProvider } from '@/components/user/UserAuthProvider'

export const metadata: Metadata = {
  title: 'Jonathan Roumie World – Official Website',
  description:
    'The official website of Jonathan Roumie. News, shop, gallery, clips and more.',
  openGraph: {
    title: 'Jonathan Roumie World',
    description: 'Official Jonathan Roumie Website',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <UserAuthProvider>
          {children}
        </UserAuthProvider>
      </body>
    </html>
  )
}
