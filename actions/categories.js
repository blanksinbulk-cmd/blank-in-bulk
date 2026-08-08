"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/format";
import { revalidatePath } from "next/cache";

export async function createCategory(formData) {
  const supabase = createClient();
  const name = formData.get("name")?.toString().trim();
  if (!name) return { error: "Category name is required." };

  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(name),
    sort_order: Number(formData.get("sort_order")) || 0,
  });
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/dashboard/categories");
  return { ok: true };
}

export async function updateCategory(categoryId, formData) {
  const supabase = createClient();
  const name = formData.get("name")?.toString().trim();
  if (!name) return { error: "Category name is required." };

  const { error } = await supabase
    .from("categories")
    .update({ name, sort_order: Number(formData.get("sort_order")) || 0 })
    .eq("id", categoryId);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/dashboard/categories");
  return { ok: true };
}

export async function deleteCategory(categoryId) {
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/dashboard/categories");
  return { ok: true };
}
