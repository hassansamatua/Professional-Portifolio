import { createSupabaseBrowserClient } from "./browser-client";

const supabase = createSupabaseBrowserClient();

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  message: string;
  avatar_url?: string;
  rating?: number;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching testimonials:", {
        message: error.message,
        code: error.code,
        hint: error.hint,
      });
      throw new Error(`Failed to fetch testimonials: ${error.message}`);
    }

    return (data || []) as Testimonial[];
  } catch (error) {
    console.error(
      "Error fetching testimonials:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("featured", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Supabase error fetching featured testimonials:", {
        message: error.message,
        code: error.code,
        hint: error.hint,
      });
      throw new Error(`Failed to fetch featured testimonials: ${error.message}`);
    }

    return (data || []) as Testimonial[];
  } catch (error) {
    console.error(
      "Error fetching featured testimonials:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

export async function createTestimonial(
  testimonial: Omit<Testimonial, "id" | "created_at" | "updated_at">
): Promise<Testimonial> {
  try {
    const { data, error } = await supabase
      .from("testimonials")
      .insert([testimonial])
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating testimonial:", {
        message: error.message,
        code: error.code,
        hint: error.hint,
      });
      throw new Error(`Failed to create testimonial: ${error.message}`);
    }

    return data as Testimonial;
  } catch (error) {
    console.error(
      "Error creating testimonial:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

export async function updateTestimonial(
  id: string,
  updates: Partial<Omit<Testimonial, "id" | "created_at" | "updated_at">>
): Promise<Testimonial> {
  try {
    const { data, error } = await supabase
      .from("testimonials")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error updating testimonial:", {
        message: error.message,
        code: error.code,
        hint: error.hint,
      });
      throw new Error(`Failed to update testimonial: ${error.message}`);
    }

    return data as Testimonial;
  } catch (error) {
    console.error(
      "Error updating testimonial:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) {
      console.error("Supabase error deleting testimonial:", {
        message: error.message,
        code: error.code,
        hint: error.hint,
      });
      throw new Error(`Failed to delete testimonial: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error(
      "Error deleting testimonial:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

