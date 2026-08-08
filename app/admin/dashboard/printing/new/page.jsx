"use client";

import { useRouter } from "next/navigation";
import { createService } from "@/actions/printing";
import ServiceForm from "@/components/ServiceForm";

export default function NewServicePage() {
  const router = useRouter();

  async function handleSubmit(formData) {
    const result = await createService(formData);
    if (result?.data) {
      router.push(`/admin/dashboard/printing/${result.data.id}`);
    }
    return result;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-extrabold text-2xl text-ink mb-6">Add printing service</h1>
      <ServiceForm onSubmit={handleSubmit} submitLabel="Create service" />
      <p className="text-xs text-muted mt-3">
        Save the service first, then you'll be able to upload photos and a video on the next screen.
      </p>
    </div>
  );
}
