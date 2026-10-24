import { HeroSection } from './components/HeroSection';
import { ServiceCards } from './components/ServiceCards';
import { BenefitsSection } from './components/BenefitsSection';
import { LandingFooter } from './components/LandingFooter';

export function LandingScreen() {
  return (
    <div className="flex-1 w-full bg-brand-bg dark:bg-brand-navy-dark min-h-screen flex flex-col transition-colors duration-300">
      <main className="flex-1 w-full">
        <HeroSection />
        <ServiceCards />
        <BenefitsSection />
      </main>
      <LandingFooter />
    </div>
  );
}

export default LandingScreen;
