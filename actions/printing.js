"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const MAX_SERVICE_MEDIA = 6; // 5 images + 1 video

export async function createService(formData) {
  const supabase = createClient();
  const name = formData.get("name")?.toString().trim();
  if (!name) return { error: "Service name is required." };

  const { data, error } = await supabase
    .from("printing_services")
    .insert({
      name,
      description: formData.get("description")?.toString() || "",
      starting_price: formData.get("starting_price")?.toString() || "Contact for pricing",
      sort_order: Number(formData.get("sort_order")) || 0,
    })
    .select()
    .single();
  if (error) return { error: error.message };

  revalidatePath("/printing");
  revalidatePath("/admin/dashboard/printing");
  return { data };
}

export async function updateService(serviceId, formData) {
  const supabase = createClient();
  const { error } = await supabase
    .from("printing_services")
    .update({
      name: formData.get("name")?.toString().trim(),
      description: formData.get("description")?.toString() || "",
      starting_price: formData.get("starting_price")?.toString() || "Contact for pricing",
      sort_order: Number(formData.get("sort_order")) || 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", serviceId);
  if (error) return { error: error.message };

  revalidatePath("/printing");
  revalidatePath("/admin/dashboard/printing");
  revalidatePath(`/admin/dashboard/printing/${serviceId}`);
  return { ok: true };
}

export async function deleteService(serviceId) {
  const supabase = createClient();

  const { data: media } = await supabase
    .from("printing_service_media")
    .select("url")
    .eq("service_id", serviceId);

  if (media?.length) {
    const paths = media.map((m) => pathFromUrl(m.url)).filter(Boolean);
    if (paths.length) await supabase.storage.from("media").remove(paths);
  }

  const { error } = await supabase.from("printing_services").delete().eq("id", serviceId);
  if (error) return { error: error.message };

  revalidatePath("/printing");
  revalidatePath("/admin/dashboard/printing");
  return { ok: true };
}

export async function addServiceMedia(serviceId, formData) {
  const supabase = createClient();
  const file = formData.get("file");
  if (!file || typeof file === "string") return { error: "No file provided." };

  const { count } = await supabase
    .from("printing_service_media")
    .select("id", { count: "exact", head: true })
    .eq("service_id", serviceId);

  if ((count || 0) >= MAX_SERVICE_MEDIA) {
    return { error: `You can upload at most ${MAX_SERVICE_MEDIA} files per service (5 images + 1 video).` };
  }

  const mediaType = file.type.startsWith("video") ? "video" : "image";
  const ext = file.name.split(".").pop();
  const path = `printing/${serviceId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) return { error: uploadError.message };

  const { data: pub } = supabase.storage.from("media").getPublicUrl(path);

  const { error: insertError } = await supabase.from("printing_service_media").insert({
    service_id: serviceId,
    media_type: mediaType,
    url: pub.publicUrl,
    position: count || 0,
  });
  if (insertError) return { error: insertError.message };

  revalidatePath(`/admin/dashboard/printing/${serviceId}`);
  revalidatePath("/printing");
  return { ok: true };
}

export async function deleteServiceMedia(serviceId, mediaId) {
  const supabase = createClient();

  const { data: row } = await supabase
    .from("printing_service_media")
    .select("url")
    .eq("id", mediaId)
    .single();
  if (row?.url) {
    const path = pathFromUrl(row.url);
    if (path) await supabase.storage.from("media").remove([path]);
  }

  const { error } = await supabase.from("printing_service_media").delete().eq("id", mediaId);
  if (error) return { error: error.message };

  revalidatePath(`/admin/dashboard/printing/${serviceId}`);
  revalidatePath("/printing");
  return { ok: true };
}

function pathFromUrl(url) {
  const marker = "/object/public/media/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}
