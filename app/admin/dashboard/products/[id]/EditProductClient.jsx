"use client";

import ProductForm from "@/components/ProductForm";
import MediaUploader from "@/components/MediaUploader";
import DeleteButton from "@/components/DeleteButton";
import { useRouter } from "next/navigation";

export default function EditProductClient({
  product,
  categories,
  media,
  updateAction,
  uploadAction,
  deleteMediaAction,
  deleteProductAction,
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
        <h1 className="font-display font-extrabold text-2xl text-ink">Edit product</h1>
        <DeleteButton
          action={async () => {
            await deleteProductAction();
            router.push("/admin/dashboard/products");
          }}
          confirmText={`Delete "${product.name}"? This can't be undone.`}
          className="text-xs bg-[#B23B3B]/10 text-[#B23B3B] hover:bg-[#B23B3B]/20 px-3 py-1.5 rounded-full"
        />
      </div>

      <div className="bg-white border border-line rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-sm text-ink mb-3">Photos & video</h2>
        <MediaUploader media={media} uploadAction={uploadAction} deleteAction={deleteMediaAction} maxItems={6} />
      </div>

      <ProductForm product={product} categories={categories} onSubmit={handleSubmit} submitLabel="Save changes" />
    </div>
  );
}
