"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/format";
import { revalidatePath } from "next/cache";

const MAX_PRODUCT_MEDIA = 6; // 5 images + 1 video

export async function createProduct(formData) {
  const supabase = createClient();

  const name = formData.get("name")?.toString().trim();
  if (!name) return { error: "Product name is required." };

  const payload = {
    name,
    slug: slugify(name) + "-" + Math.random().toString(36).slice(2, 6),
    description: formData.get("description")?.toString() || "",
    category_id: formData.get("category_id") || null,
    price: Number(formData.get("price")) || 0,
    was_price: formData.get("was_price") ? Number(formData.get("was_price")) : null,
    sku: formData.get("sku")?.toString() || null,
    sizes: splitList(formData.get("sizes")),
    colours: splitList(formData.get("colours")),
    stock_status: formData.get("stock_status")?.toString() || "in_stock",
    moq: formData.get("moq")?.toString() || "1 unit",
  };

  const { data, error } = await supabase.from("products").insert(payload).select().single();
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/dashboard/products");
  return { data };
}

export async function updateProduct(productId, formData) {
  const supabase = createClient();

  const payload = {
    name: formData.get("name")?.toString().trim(),
    description: formData.get("description")?.toString() || "",
    category_id: formData.get("category_id") || null,
    price: Number(formData.get("price")) || 0,
    was_price: formData.get("was_price") ? Number(formData.get("was_price")) : null,
    sku: formData.get("sku")?.toString() || null,
    sizes: splitList(formData.get("sizes")),
    colours: splitList(formData.get("colours")),
    stock_status: formData.get("stock_status")?.toString() || "in_stock",
    moq: formData.get("moq")?.toString() || "1 unit",
    is_published: formData.get("is_published") === "on",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("products").update(payload).eq("id", productId);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/dashboard/products");
  revalidatePath(`/admin/dashboard/products/${productId}`);
  return { ok: true };
}

export async function deleteProduct(productId) {
  const supabase = createClient();

  // Remove media files from storage first
  const { data: media } = await supabase
    .from("product_media")
    .select("url")
    .eq("product_id", productId);

  if (media?.length) {
    const paths = media.map((m) => pathFromUrl(m.url)).filter(Boolean);
    if (paths.length) await supabase.storage.from("media").remove(paths);
  }

  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/dashboard/products");
  return { ok: true };
}

export async function addProductMedia(productId, formData) {
  const supabase = createClient();
  const file = formData.get("file");
  if (!file || typeof file === "string") return { error: "No file provided." };

  const { count } = await supabase
    .from("product_media")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  if ((count || 0) >= MAX_PRODUCT_MEDIA) {
    return { error: `You can upload at most ${MAX_PRODUCT_MEDIA} files per product (5 images + 1 video).` };
  }

  const mediaType = file.type.startsWith("video") ? "video" : "image";
  const ext = file.name.split(".").pop();
  const path = `products/${productId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) return { error: uploadError.message };

  const { data: pub } = supabase.storage.from("media").getPublicUrl(path);

  const { error: insertError } = await supabase.from("product_media").insert({
    product_id: productId,
    media_type: mediaType,
    url: pub.publicUrl,
    position: count || 0,
  });
  if (insertError) return { error: insertError.message };

  revalidatePath(`/admin/dashboard/products/${productId}`);
  revalidatePath("/");
  return { ok: true };
}

export async function deleteProductMedia(productId, mediaId) {
  const supabase = createClient();

  const { data: row } = await supabase.from("product_media").select("url").eq("id", mediaId).single();
  if (row?.url) {
    const path = pathFromUrl(row.url);
    if (path) await supabase.storage.from("media").remove([path]);
  }

  const { error } = await supabase.from("product_media").delete().eq("id", mediaId);
  if (error) return { error: error.message };

  revalidatePath(`/admin/dashboard/products/${productId}`);
  revalidatePath("/");
  return { ok: true };
}

function splitList(value) {
  return (value?.toString() || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function pathFromUrl(url) {
  const marker = "/object/public/media/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}
