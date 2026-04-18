import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSlider from '@/components/sections/home/HeroSlider'
import { WelcomeBanner } from '@/components/sections/home/WelcomeBanner'
import YouTubeClips from '@/components/sections/home/YouTubeClips'
import LatestNews from '@/components/sections/home/LatestNews'
import Gallery from '@/components/sections/home/Gallery'
import SocialSection from '@/components/sections/home/SocialSection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header variant="main" />
      <main className="pt-0">
        <HeroSlider />
        <WelcomeBanner />
        <YouTubeClips />
        <LatestNews />
        <Gallery />
        <SocialSection />
      </main>
      <Footer variant="main" />
    </div>
  )
}
