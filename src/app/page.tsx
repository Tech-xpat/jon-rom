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
        
        {/* Fan Login & Card CTA with Image */}
        <section className="py-16 px-4 bg-gradient-to-b from-transparent to-red-900/10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <img
                  src="/images/shop/category-tshirts.jpg"
                  alt="Fan Card"
                  className="w-full h-64 object-cover rounded-xl shadow-2xl"
                />
              </div>
              <div className="order-1 md:order-2 text-center md:text-left">
                <h2 className="text-white text-3xl md:text-4xl font-black mb-4 tracking-widest">
                  GET YOUR FAN CARD
                </h2>
                <p className="text-gray-400 mb-8">
                  Own an official Jonathan Roumie Fan Card. Sign in to your account or apply now.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/apply-card"
                    className="inline-block bg-jcvd-red hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold tracking-widest transition-colors text-center"
                  >
                    APPLY FOR CARD
                  </Link>
                  <Link
                    href="/auth"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold tracking-widest transition-colors text-center"
                  >
                    LOGIN / SIGNUP
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Store CTA with Image */}
        <section className="py-16 px-4 bg-gradient-to-b from-transparent to-blue-900/10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src="/images/shop/shop-hero.jpg"
                  alt="Store"
                  className="w-full h-64 object-cover rounded-xl shadow-2xl"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-white text-3xl md:text-4xl font-black mb-4 tracking-widest">
                  JONATHAN ROUMIE STORE
                </h2>
                <p className="text-gray-400 mb-8">
                  Shop exclusive merchandise, fan cards, and VIP event passes.
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
