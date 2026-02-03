import { Mail, Phone, MapPin, Send } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VENUE } from "@/lib/constants";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Have questions about CREATION 2K26? We'd love to hear from you.
            Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <GlassPanel variant="hover" className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Venue</h3>
                  <p className="text-muted-foreground text-sm">
                    {VENUE.name}<br />
                    {VENUE.college}<br />
                    {VENUE.address}
                  </p>
                </div>
              </div>
            </GlassPanel>

            <GlassPanel variant="hover" className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a
                    href="mailto:contact@creation2k26.com"
                    className="text-muted-foreground text-sm hover:text-primary transition-colors"
                  >
                    contact@creation2k26.com
                  </a>
                </div>
              </div>
            </GlassPanel>

            <GlassPanel variant="hover" className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <a
                    href="tel:+911234567890"
                    className="text-muted-foreground text-sm hover:text-primary transition-colors"
                  >
                    +91 12345 67890
                  </a>
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* Contact Form */}
          <GlassPanel className="p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="bg-muted/50 border-border/50"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-muted/50 border-border/50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="How can we help?"
                  className="bg-muted/50 border-border/50"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us more..."
                  rows={5}
                  className="bg-muted/50 border-border/50 resize-none"
                />
              </div>

              <NeonButton type="submit" variant="cyan" className="w-full">
                <Send className="w-4 h-4" />
                Send Message
              </NeonButton>
            </form>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
