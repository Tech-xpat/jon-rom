import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSlider from '@/components/sections/home/HeroSlider'
import { WelcomeBanner } from '@/components/sections/home/WelcomeBanner'
import YouTubeClips from '@/components/sections/home/YouTubeClips'
import LatestNews from '@/components/sections/home/LatestNews'
import Gallery from '@/components/sections/home/Gallery'
import SocialSection from '@/components/sections/home/SocialSection'
import FanCardSection from '@/components/sections/home/FanCardSection'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header variant="main" />
      <main className="pt-0">
        <HeroSlider />
        <WelcomeBanner />
        
        {/* Fan Card Section - Adaptive for auth status */}
        <FanCardSection />

        {/* Store CTA with Image */}
        <section className="py-24 px-4 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <img
                  src="/images/shop/shop-hero.jpg"
                  alt="Store"
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                />
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <h2 className="text-white text-4xl md:text-5xl font-black tracking-widest">
                  JONATHAN ROUMIE STORE
                </h2>
                <p className="text-gray-400 text-lg">
                  Shop exclusive merchandise, apparel, and collectibles.
                </p>
                <Link
                  href="/store"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold tracking-widest transition-colors"
                >
                  VISIT STORE
                </Link>
              </div>
            </div>
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
