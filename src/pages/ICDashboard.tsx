import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MessageSquare,
  Trophy,
  Send,
  LogOut,
  User,
  Calendar,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEventRegistrations } from "@/hooks/useRegistrations";
import { useEventMessages, useSendMessage } from "@/hooks/useMessages";

const ICDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [messageContent, setMessageContent] = useState("");
  const sendMessage = useSendMessage();

  // Get IC's assigned event
  const { data: icData, isLoading: loadingIC } = useQuery({
    queryKey: ["student_incharge", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("student_incharges")
        .select(`
          *,
          events (*)
        `)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const event = icData?.events;
  const { data: registrations, isLoading: loadingRegistrations } = useEventRegistrations(event?.id);
  const { data: messages, isLoading: loadingMessages } = useEventMessages(event?.id);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !event?.id) return;

    await sendMessage.mutateAsync({
      content: messageContent,
      eventId: event.id,
      messageType: "announcement",
    });

    setMessageContent("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loadingIC) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!icData || !event) {
    return (
      <div className="min-h-screen bg-background dark">
        <Navbar />
        <main className="container mx-auto px-4 pt-28 pb-16">
          <GlassPanel className="p-8 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Not Assigned</h2>
            <p className="text-muted-foreground mb-4">
              You are not assigned as an IC for any event yet.
            </p>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Go to Participant Dashboard
            </Button>
          </GlassPanel>
        </main>
        <Footer />
      </div>
    );
  }

  const isTechnical = event.category === "technical";

  return (
    <div className="min-h-screen bg-background dark">
      <Navbar />

      <main className="container mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Badge
              variant={isTechnical ? "default" : "secondary"}
              className={`mb-2 ${
                isTechnical
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary/20 text-secondary"
              }`}
            >
              Student Incharge
            </Badge>
            <h1 className="text-3xl font-bold">
              <span className={isTechnical ? "text-primary" : "text-secondary"}>
                {event.name}
              </span>{" "}
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage participants and send announcements
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GlassPanel className="p-4 text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{registrations?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Participants</p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center">
            <MessageSquare className="w-6 h-6 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold">{messages?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Messages Sent</p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center">
            <Calendar className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">{isTechnical ? "Tech" : "Non-Tech"}</p>
            <p className="text-xs text-muted-foreground">Category</p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center">
            <Trophy className="w-6 h-6 text-neon-gold mx-auto mb-2" />
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">Winners Declared</p>
          </GlassPanel>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Participants Table */}
          <div className="lg:col-span-2">
            <GlassPanel className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Registered Participants</h2>
                  <p className="text-sm text-muted-foreground">
                    {registrations?.length || 0} participants
                  </p>
                </div>
              </div>

              {loadingRegistrations ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />
                  ))}
                </div>
              ) : registrations && registrations.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Registered</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrations.map((reg: any) => (
                        <TableRow key={reg.id}>
                          <TableCell className="font-medium">
                            {reg.profiles?.name || "Unknown"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {reg.profiles?.email || "-"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {reg.profiles?.department || "-"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(reg.registered_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No participants registered yet</p>
                </div>
              )}
            </GlassPanel>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Send Message */}
            <GlassPanel className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Send Announcement</h3>
                  <p className="text-xs text-muted-foreground">
                    Message all participants
                  </p>
                </div>
              </div>

              <Textarea
                placeholder="Type your announcement..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={4}
                className="bg-muted/50 mb-4"
              />

              <NeonButton
                variant="purple"
                className="w-full"
                onClick={handleSendMessage}
                disabled={!messageContent.trim() || sendMessage.isPending}
              >
                {sendMessage.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send to All
              </NeonButton>
            </GlassPanel>

            {/* Recent Messages */}
            <GlassPanel className="p-6">
              <h3 className="font-semibold mb-4">Recent Messages</h3>

              {loadingMessages ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted/50 rounded animate-pulse" />
                  ))}
                </div>
              ) : messages && messages.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {messages.slice(0, 5).map((message) => (
                    <div
                      key={message.id}
                      className="p-3 rounded-lg bg-muted/30 border-l-2 border-secondary"
                    >
                      <p className="text-sm line-clamp-2">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(message.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No messages sent yet
                </p>
              )}
            </GlassPanel>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ICDashboard;
