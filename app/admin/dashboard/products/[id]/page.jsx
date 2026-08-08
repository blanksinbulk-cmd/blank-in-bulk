import { createClient } from "@/lib/supabase/server";
import { updateProduct, addProductMedia, deleteProductMedia, deleteProduct } from "@/actions/products";
import { notFound } from "next/navigation";
import EditProductClient from "./EditProductClient";

export default async function EditProductPage({ params }) {
  const supabase = createClient();

  const [{ data: product }, { data: categories }, { data: media }] = await Promise.all([
    supabase.from("products").select("*").eq("id", params.id).single(),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("product_media").select("*").eq("product_id", params.id).order("position"),
  ]);

  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, product.id);
  const boundUpload = addProductMedia.bind(null, product.id);
  const boundDeleteMedia = deleteProductMedia.bind(null, product.id);
  const boundDeleteProduct = deleteProduct.bind(null, product.id);

  return (
    <EditProductClient
      product={product}
      categories={categories}
      media={media}
      updateAction={boundUpdate}
      uploadAction={boundUpload}
      deleteMediaAction={boundDeleteMedia}
      deleteProductAction={boundDeleteProduct}
    />
  );
}
