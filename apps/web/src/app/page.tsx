import BenefitsSection from "@/components/landing/benefits-section";
import DemoSection from "@/components/landing/demo-section";
import FeaturesSection from "@/components/landing/features-section";
import Footer from "@/components/landing/footer";
import Header from "@/components/landing/header";
import HeroSection from "@/components/landing/hero-section";
import HowItWorksSection from "@/components/landing/how-it-works-section";
import ProblemSolutionSection from "@/components/landing/problem-solution-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <DemoSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <BenefitsSection />
      <HowItWorksSection />
      <Footer />
    </main>
  );
}
