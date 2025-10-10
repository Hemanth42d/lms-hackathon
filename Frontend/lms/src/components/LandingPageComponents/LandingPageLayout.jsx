import React from "react";
import LandingNavbar from "./LandingNavbar";
import HeroSection from "./HeroSection";
import RolesSection from "./RolesSection";
import FeaturesSection from "./FeaturesSection";
import TestimonialsSection from "./TestimonialsSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";

const LandingPageLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LandingNavbar />
      <main>
        <HeroSection />
        <RolesSection />
        <FeaturesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPageLayout;
