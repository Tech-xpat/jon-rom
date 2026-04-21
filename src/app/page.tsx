import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSlider from '@/components/sections/home/HeroSlider'
import { WelcomeBanner } from '@/components/sections/home/WelcomeBanner'
import YouTubeClips from '@/components/sections/home/YouTubeClips'
import LatestNews from '@/components/sections/home/LatestNews'
import Gallery from '@/components/sections/home/Gallery'
import SocialSection from '@/components/sections/home/SocialSection'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header variant="main" />
      <main className="pt-0">
        <HeroSlider />
        <WelcomeBanner />
        
        {/* Fan Login & Card CTA */}
        <section className="py-16 px-4 bg-gradient-to-b from-transparent to-red-900/10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-white text-3xl md:text-4xl font-black mb-4 tracking-widest">
              GET YOUR FAN CARD
            </h2>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">
              Own an official Jonathan Roumie Fan Card. Sign in to your account or apply now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/apply-card"
                className="inline-block bg-jcvd-red hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold tracking-widest transition-colors"
              >
                APPLY FOR CARD
              </Link>
              <Link
                href="/auth"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold tracking-widest transition-colors"
              >
                LOGIN / SIGNUP
              </Link>
            </div>
          </div>
        </section>

        {/* Store CTA */}
        <section className="py-16 px-4 bg-gradient-to-b from-transparent to-blue-900/10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-white text-3xl md:text-4xl font-black mb-4 tracking-widest">
              JONATHAN ROUMIE STORE
            </h2>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">
              Shop exclusive merchandise, fan cards, and VIP event passes.
            </p>
            <Link
              href="/store"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold tracking-widest transition-colors"
            >
              VISIT STORE
            </Link>
          </div>
        </section>

        <YouTubeClips />
        <LatestNews />
        <Gallery />
        <SocialSection />
      </main>
      <Footer variant="main" />
    </div>
  )
}
