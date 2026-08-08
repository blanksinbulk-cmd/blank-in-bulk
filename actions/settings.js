"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData) {
  const supabase = createClient();

  const { error } = await supabase
    .from("site_settings")
    .update({
      email: formData.get("email")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      note: formData.get("note")?.toString() || "",
      about_heading: formData.get("about_heading")?.toString() || "",
      about_text: formData.get("about_text")?.toString() || "",
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/printing");
  return { ok: true };
}
