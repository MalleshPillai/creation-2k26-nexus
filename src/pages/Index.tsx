import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import ContactSection from "@/components/landing/ContactSection";
import EventsGrid from "@/components/events/EventsGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Events Section */}
      <section id="events" className="py-24 relative">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Our <span className="gradient-text">Events</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose from 10 exciting events spanning technical challenges and creative competitions.
              Register for multiple events and showcase your talents!
            </p>
          </div>

          <EventsGrid />
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Contact Section */}
      <ContactSection />

      <Footer />
    </div>
  );
};

export default Index;
