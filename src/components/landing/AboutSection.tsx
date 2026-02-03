import { Trophy, Users, Calendar, Lightbulb } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";

const stats = [
  {
    icon: Trophy,
    value: "10+",
    label: "Events",
    color: "primary",
  },
  {
    icon: Users,
    value: "500+",
    label: "Expected Participants",
    color: "secondary",
  },
  {
    icon: Calendar,
    value: "1",
    label: "Day of Innovation",
    color: "accent",
  },
  {
    icon: Lightbulb,
    value: "∞",
    label: "Ideas to Explore",
    color: "primary",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About <span className="gradient-text">CREATION 2K26</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            CREATION 2K26 is the flagship technical and cultural symposium that brings together
            the brightest minds to compete, collaborate, and create. Join us for a day filled
            with innovation, creativity, and unforgettable experiences.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <GlassPanel
              key={stat.label}
              variant="hover"
              className="p-6 text-center animate-slide-up opacity-0"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "forwards",
              }}
            >
              <div
                className={`
                  w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center
                  ${stat.color === "primary" ? "bg-primary/10 text-primary" : ""}
                  ${stat.color === "secondary" ? "bg-secondary/10 text-secondary" : ""}
                  ${stat.color === "accent" ? "bg-accent/10 text-accent" : ""}
                `}
              >
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </GlassPanel>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8">
          <GlassPanel variant="hover" className="p-8">
            <h3 className="text-xl font-bold mb-4 text-primary">Technical Events</h3>
            <p className="text-muted-foreground mb-4">
              Put your coding skills to the test with our technical events. From debugging
              challenges to web design competitions, showcase your technical expertise and
              win exciting prizes.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Quiz - Test your knowledge
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Paper Presentation - Present your research
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Debugging - Find and fix bugs
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Web Design - Create stunning websites
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                AI Prompt Engineering - Master AI prompts
              </li>
            </ul>
          </GlassPanel>

          <GlassPanel variant="hover" className="p-8">
            <h3 className="text-xl font-bold mb-4 text-secondary">Non-Technical Events</h3>
            <p className="text-muted-foreground mb-4">
              Let your creativity shine with our non-technical events. From ad creation
              to movie spoofing, these events are designed to bring out your artistic
              side and entertainment skills.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Ad Zap - Creative advertising
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Personality Contest - Showcase yourself
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Memory Matrix - Test your memory
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                IPL Auction - Strategic bidding game
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Movie Spoofing - Entertainment and fun
              </li>
            </ul>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
