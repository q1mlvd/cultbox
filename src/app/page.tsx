import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CurrencySection from "@/components/CurrencySection";
import CasesSection from "@/components/CasesSection";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <CurrencySection />
      <CasesSection />
      <ProductGrid />
    </>
  );
}
