import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import About from '../components/landing/About'
import CTA from '../components/landing/CTA'
import Footer from '../components/common/Footer'
import SkipLink from '../components/common/SkipLink'

export default function Home() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <Features />
        <HowItWorks />
        <About />
        <CTA />
      </main>
      <Footer />
    </>
  )
}