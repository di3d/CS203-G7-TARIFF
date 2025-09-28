import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import HeroMinimal from "@/components/hero-minimal";
import FeaturesMinimal from "@/components/features-minimal";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroMinimal />
      <FeaturesMinimal />
      <Footer />
    </>
  );
}
