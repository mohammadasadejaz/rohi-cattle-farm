import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useSettings() {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { error } = await supabase.from("site_settings").update(values as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Saved. The public website now shows these details.");
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      queryClient.invalidateQueries({ queryKey: ["site-data"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

type TableName =
  | "animals"
  | "animal_cards"
  | "breeds"
  | "services"
  | "gallery_images"
  | "inquiries";

export function useRows<T>(table: TableName, order: { column: string; ascending?: boolean }[]) {
  return useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      let query = supabase.from(table).select("*");
      for (const rule of order) {
        query = query.order(rule.column, { ascending: rule.ascending ?? true });
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

export function useSaveRow(table: TableName) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id?: string | undefined; values: Record<string, unknown> }) => {
      if (id) {
        const { error } = await supabase.from(table).update(values as never).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table).insert(values as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved");
      queryClient.invalidateQueries({ queryKey: ["admin", table] });
      queryClient.invalidateQueries({ queryKey: ["site-data"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteRow(table: TableName) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", table] });
      queryClient.invalidateQueries({ queryKey: ["site-data"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
