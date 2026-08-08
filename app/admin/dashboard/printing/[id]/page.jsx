import { createClient } from "@/lib/supabase/server";
import { updateService, addServiceMedia, deleteServiceMedia, deleteService } from "@/actions/printing";
import { notFound } from "next/navigation";
import EditServiceClient from "./EditServiceClient";

export default async function EditServicePage({ params }) {
  const supabase = createClient();

  const [{ data: service }, { data: media }] = await Promise.all([
    supabase.from("printing_services").select("*").eq("id", params.id).single(),
    supabase.from("printing_service_media").select("*").eq("service_id", params.id).order("position"),
  ]);

  if (!service) notFound();

  const boundUpdate = updateService.bind(null, service.id);
  const boundUpload = addServiceMedia.bind(null, service.id);
  const boundDeleteMedia = deleteServiceMedia.bind(null, service.id);
  const boundDeleteService = deleteService.bind(null, service.id);

  return (
    <EditServiceClient
      service={service}
      media={media}
      updateAction={boundUpdate}
      uploadAction={boundUpload}
      deleteMediaAction={boundDeleteMedia}
      deleteServiceAction={boundDeleteService}
    />
  );
}
