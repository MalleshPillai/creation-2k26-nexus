import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Type for message data from queries
export interface MessageData {
  id: string;
  sender_id: string;
  event_id: string | null;
  content: string;
  message_type: "announcement" | "event_update" | "global";
  is_global: boolean;
  created_at: string;
  profiles?: {
    id: string;
    name: string;
    email: string;
  } | null;
  events?: {
    id: string;
    name: string;
  } | null;
}

export const useMyMessages = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["messages", "my", user?.id],
    queryFn: async (): Promise<MessageData[]> => {
      if (!user?.id) return [];
      
      // Fetch messages separately - can't use relation syntax with sender_id
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Fetch related data separately
      const messageIds = data?.map(m => m.id) || [];
      const senderIds = [...new Set(data?.map(m => m.sender_id) || [])];
      const eventIds = [...new Set(data?.filter(m => m.event_id).map(m => m.event_id!) || [])];
      
      const [profilesRes, eventsRes] = await Promise.all([
        supabase.from("profiles").select("id, name, email").in("id", senderIds),
        eventIds.length > 0 
          ? supabase.from("events").select("id, name").in("id", eventIds)
          : { data: [] as any[], error: null }
      ]);
      
      const profilesMap = new Map((profilesRes.data || []).map(p => [p.id, p]));
      const eventsMap = new Map((eventsRes.data || []).map(e => [e.id, e]));
      
      return (data || []).map(msg => ({
        ...msg,
        profiles: profilesMap.get(msg.sender_id) || null,
        events: msg.event_id ? eventsMap.get(msg.event_id) || null : null,
      })) as MessageData[];
    },
    enabled: !!user?.id,
  });
};

export const useEventMessages = (eventId: string | undefined) => {
  return useQuery({
    queryKey: ["messages", "event", eventId],
    queryFn: async (): Promise<MessageData[]> => {
      if (!eventId) return [];
      
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Fetch sender profiles
      const senderIds = [...new Set(data?.map(m => m.sender_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, email")
        .in("id", senderIds);
      
      const profilesMap = new Map((profiles || []).map(p => [p.id, p]));
      
      return (data || []).map(msg => ({
        ...msg,
        profiles: profilesMap.get(msg.sender_id) || null,
      })) as MessageData[];
    },
    enabled: !!eventId,
  });
};

export const useGlobalMessages = () => {
  return useQuery({
    queryKey: ["messages", "global"],
    queryFn: async (): Promise<MessageData[]> => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("is_global", true)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Fetch sender profiles
      const senderIds = [...new Set(data?.map(m => m.sender_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, email")
        .in("id", senderIds);
      
      const profilesMap = new Map((profiles || []).map(p => [p.id, p]));
      
      return (data || []).map(msg => ({
        ...msg,
        profiles: profilesMap.get(msg.sender_id) || null,
      })) as MessageData[];
    },
  });
};

export const useSendMessage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      eventId,
      isGlobal = false,
      messageType = "announcement",
    }: {
      content: string;
      eventId?: string;
      isGlobal?: boolean;
      messageType?: "announcement" | "event_update" | "global";
    }) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("messages")
        .insert({
          sender_id: user.id,
          event_id: eventId || null,
          content,
          is_global: isGlobal,
          message_type: messageType,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast({
        title: "Message Sent! 📨",
        description: "Your message has been sent successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAllMessages = () => {
  return useQuery({
    queryKey: ["messages", "all"],
    queryFn: async (): Promise<MessageData[]> => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Fetch related data separately
      const senderIds = [...new Set(data?.map(m => m.sender_id) || [])];
      const eventIds = [...new Set(data?.filter(m => m.event_id).map(m => m.event_id!) || [])];
      
      const [profilesRes, eventsRes] = await Promise.all([
        supabase.from("profiles").select("id, name, email").in("id", senderIds),
        eventIds.length > 0 
          ? supabase.from("events").select("id, name").in("id", eventIds)
          : { data: [] as any[], error: null }
      ]);
      
      const profilesMap = new Map((profilesRes.data || []).map(p => [p.id, p]));
      const eventsMap = new Map((eventsRes.data || []).map(e => [e.id, e]));
      
      return (data || []).map(msg => ({
        ...msg,
        profiles: profilesMap.get(msg.sender_id) || null,
        events: msg.event_id ? eventsMap.get(msg.event_id) || null : null,
      })) as MessageData[];
    },
  });
};
