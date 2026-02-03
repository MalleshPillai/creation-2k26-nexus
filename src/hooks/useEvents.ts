import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Raw types from Supabase queries
export interface EventData {
  id: string;
  name: string;
  description: string;
  rules: string;
  category: "technical" | "non_technical";
  icon_name: string;
  accent_color: string;
  created_at: string;
  student_incharges?: Array<{
    id: string;
    user_id: string;
    event_id: string;
    name: string;
    created_at: string;
  }>;
}

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async (): Promise<EventData[]> => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          student_incharges (*)
        `)
        .order("category", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return (data as unknown as EventData[]) || [];
    },
  });
};

export const useEvent = (eventId: string | undefined) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async (): Promise<EventData | null> => {
      if (!eventId) return null;
      
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          student_incharges (*)
        `)
        .eq("id", eventId)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as EventData | null;
    },
    enabled: !!eventId,
  });
};

export const useTechnicalEvents = () => {
  return useQuery({
    queryKey: ["events", "technical"],
    queryFn: async (): Promise<EventData[]> => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          student_incharges (*)
        `)
        .eq("category", "technical")
        .order("name", { ascending: true });

      if (error) throw error;
      return (data as unknown as EventData[]) || [];
    },
  });
};

export const useNonTechnicalEvents = () => {
  return useQuery({
    queryKey: ["events", "non_technical"],
    queryFn: async (): Promise<EventData[]> => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          student_incharges (*)
        `)
        .eq("category", "non_technical")
        .order("name", { ascending: true });

      if (error) throw error;
      return (data as unknown as EventData[]) || [];
    },
  });
};
