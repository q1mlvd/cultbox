import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CurrencySection from "@/components/CurrencySection";
import CasesSection from "@/components/CasesSection";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <CurrencySection />
      <CasesSection />
      <ProductGrid />
      <Footer />
    </>
  );
}
