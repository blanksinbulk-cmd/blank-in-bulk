"use client";

import ServiceForm from "@/components/ServiceForm";
import MediaUploader from "@/components/MediaUploader";
import DeleteButton from "@/components/DeleteButton";
import { useRouter } from "next/navigation";

export default function EditServiceClient({
  service,
  media,
  updateAction,
  uploadAction,
  deleteMediaAction,
  deleteServiceAction,
}) {
  const router = useRouter();

  async function handleSubmit(formData) {
    const result = await updateAction(formData);
    if (result?.ok) router.refresh();
    return result;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-extrabold text-2xl text-ink">Edit printing service</h1>
        <DeleteButton
          action={async () => {
            await deleteServiceAction();
            router.push("/admin/dashboard/printing");
          }}
          confirmText={`Delete "${service.name}"? This can't be undone.`}
          className="text-xs bg-[#B23B3B]/10 text-[#B23B3B] hover:bg-[#B23B3B]/20 px-3 py-1.5 rounded-full"
        />
      </div>

      <div className="bg-white border border-line rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-sm text-ink mb-3">Photos & video</h2>
        <MediaUploader media={media} uploadAction={uploadAction} deleteAction={deleteMediaAction} maxItems={6} />
      </div>

      <ServiceForm service={service} onSubmit={handleSubmit} submitLabel="Save changes" />
    </div>
  );
}
