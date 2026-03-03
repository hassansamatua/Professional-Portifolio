import { createSupabaseBrowserClient } from "./browser-client";

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: "development" | "design" | "teaching";
  image_url?: string;
  link?: string;
  technologies?: string[];
  year?: number;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface AdminSettings {
  portfolio_title: string;
  portfolio_description: string;
  admin_email: string;
}

const supabase = createSupabaseBrowserClient();

// Portfolio Item Operations
export async function getPortfolioItems() {
  try {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        code: error.code,
        hint: error.hint,
      });
      throw new Error(`Failed to fetch portfolio items: ${error.message}`);
    }

    if (!data) {
      console.warn("No data returned from portfolio_items query");
      return [];
    }

    return data as PortfolioItem[];
  } catch (error) {
    console.error("Error fetching portfolio items:", error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function getPortfolioItemsByCategory(category: string) {
  try {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("category", category)
      .order("display_order", { ascending: true });

    if (error) {
      console.error(`Supabase error fetching ${category} items:`, {
        message: error.message,
        code: error.code,
        hint: error.hint,
      });
      throw new Error(`Failed to fetch ${category} items: ${error.message}`);
    }

    if (!data) {
      console.warn(`No data returned for ${category} items`);
      return [];
    }

    return data as PortfolioItem[];
  } catch (error) {
    console.error(`Error fetching ${category} items:`, error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function getFeaturedPortfolioItems() {
  try {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("featured", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data as PortfolioItem[];
  } catch (error) {
    console.error("Error fetching featured items:", error);
    throw error;
  }
}

export async function getPortfolioItem(id: string) {
  try {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as PortfolioItem;
  } catch (error) {
    console.error("Error fetching portfolio item:", error);
    throw error;
  }
}

export async function createPortfolioItem(item: Omit<PortfolioItem, "id" | "created_at" | "updated_at">) {
  try {
    const { data, error } = await supabase
      .from("portfolio_items")
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        code: error.code,
        hint: error.hint,
      });
      throw new Error(`Failed to create portfolio item: ${error.message}`);
    }
    return data as PortfolioItem;
  } catch (error) {
    console.error("Error creating portfolio item:", error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function updatePortfolioItem(
  id: string,
  updates: Partial<Omit<PortfolioItem, "id" | "created_at" | "updated_at">>
) {
  try {
    const { data, error } = await supabase
      .from("portfolio_items")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        code: error.code,
        hint: error.hint,
      });
      throw new Error(`Failed to update portfolio item: ${error.message}`);
    }
    return data as PortfolioItem;
  } catch (error) {
    console.error("Error updating portfolio item:", error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function deletePortfolioItem(id: string) {
  try {
    const { error } = await supabase
      .from("portfolio_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        code: error.code,
        hint: error.hint,
      });
      throw new Error(`Failed to delete portfolio item: ${error.message}`);
    }
    return true;
  } catch (error) {
    console.error("Error deleting portfolio item:", error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function reorderPortfolioItems(items: Array<{ id: string; display_order: number }>) {
  try {
    for (const item of items) {
      await updatePortfolioItem(item.id, { display_order: item.display_order });
    }
    return true;
  } catch (error) {
    console.error("Error reordering portfolio items:", error);
    throw error;
  }
}

// Admin Settings Operations
export async function getAdminSettings(): Promise<AdminSettings> {
  try {
    const { data, error } = await supabase.from("admin_settings").select("*").single();

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        code: error.code,
        hint: error.hint,
      });
      throw new Error(`Failed to fetch admin settings: ${error.message}`);
    }

    return {
      portfolio_title: data?.portfolio_title || "Hansco Dev",
      portfolio_description: data?.portfolio_description || "",
      admin_email: data?.admin_email || "",
    };
  } catch (error) {
    console.error("Error fetching admin settings:", error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function updateAdminSettings(settings: Partial<AdminSettings>) {
  try {
    const { error } = await supabase
      .from("admin_settings")
      .update({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .eq("id", (await supabase.from("admin_settings").select("id").single()).data?.id);

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        code: error.code,
        hint: error.hint,
      });
      throw new Error(`Failed to update admin settings: ${error.message}`);
    }
    return true;
  } catch (error) {
    console.error("Error updating admin settings:", error instanceof Error ? error.message : error);
    throw error;
  }
}
