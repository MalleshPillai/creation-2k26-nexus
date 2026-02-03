import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { NeonButton } from "@/components/ui/neon-button";
import { Separator } from "@/components/ui/separator";
import { EventData } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface EventModalProps {
  event: EventData;
  isOpen: boolean;
  onClose: () => void;
}

// Dynamic icon component
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Sparkles;
  return <Icon className={className} />;
};

const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRegistering, setIsRegistering] = useState(false);

  const isTechnical = event.category === "technical";

  const handleRegister = async () => {
    if (!user) {
      navigate("/auth?tab=signup");
      onClose();
      return;
    }

    setIsRegistering(true);
    try {
      const { error } = await supabase
        .from("event_registrations")
        .insert({
          user_id: user.id,
          event_id: event.id,
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Registered",
            description: "You are already registered for this event.",
            variant: "default",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Registration Successful! 🎉",
          description: `You are now registered for ${event.name}.`,
        });
        queryClient.invalidateQueries({ queryKey: ["registrations"] });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  // Parse rules into array
  const rulesArray = event.rules.split("\n").filter((rule) => rule.trim());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={`
                w-16 h-16 rounded-2xl flex items-center justify-center shrink-0
                ${isTechnical 
                  ? "bg-primary/10 text-primary" 
                  : "bg-secondary/10 text-secondary"
                }
              `}
            >
              <DynamicIcon name={event.icon_name} className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <Badge
                variant={isTechnical ? "default" : "secondary"}
                className={`
                  text-xs font-medium mb-2
                  ${isTechnical 
                    ? "bg-primary/20 text-primary border-primary/30" 
                    : "bg-secondary/20 text-secondary border-secondary/30"
                  }
                `}
              >
                {isTechnical ? "Technical" : "Non-Technical"}
              </Badge>
              <DialogTitle className="text-2xl font-bold">
                {event.name}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              About
            </h4>
            <p className="text-foreground">{event.description}</p>
          </div>

          <Separator className="bg-border/50" />

          {/* Rules */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Rules & Guidelines
            </h4>
            <ul className="space-y-2">
              {rulesArray.map((rule, index) => (
                <li key={index} className="flex items-start gap-2 text-foreground">
                  <LucideIcons.CheckCircle2 
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      isTechnical ? "text-primary" : "text-secondary"
                    }`} 
                  />
                  <span>{rule.replace(/^[•\-]\s*/, "")}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* IC Info */}
          {event.student_incharges && event.student_incharges.length > 0 && (
            <>
              <Separator className="bg-border/50" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <LucideIcons.User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Student Incharge</p>
                  <p className={`font-semibold ${isTechnical ? "text-primary" : "text-secondary"}`}>
                    {event.student_incharges[0].name}
                  </p>
                </div>
              </div>
            </>
          )}

          <Separator className="bg-border/50" />

          {/* Register Button */}
          <div className="flex justify-end gap-3">
            <NeonButton variant="ghost" onClick={onClose}>
              Close
            </NeonButton>
            <NeonButton
              variant={isTechnical ? "cyan" : "purple"}
              onClick={handleRegister}
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <LucideIcons.UserPlus className="w-4 h-4" />
                  {user ? "Register for Event" : "Sign Up to Register"}
                </>
              )}
            </NeonButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
