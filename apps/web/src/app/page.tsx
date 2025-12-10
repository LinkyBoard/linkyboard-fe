import { redirect } from "next/navigation";

import BenefitsSection from "@/components/landing/benefits-section";
import DemoSection from "@/components/landing/demo-section";
import FeaturesSection from "@/components/landing/features-section";
import Footer from "@/components/landing/footer";
import FourStepsSection from "@/components/landing/four-steps-section";
import Header from "@/components/landing/header";
import HeroSection from "@/components/landing/hero-section";
import { getCookie } from "@/utils/cookie";

export default async function Home() {
  const loggedIn = await getCookie("loggedIn");

  if (loggedIn === "true") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header />
      <HeroSection />
      <DemoSection />
      <FeaturesSection />
      <BenefitsSection />
      <FourStepsSection />
      <Footer />
    </main>
  );
}
