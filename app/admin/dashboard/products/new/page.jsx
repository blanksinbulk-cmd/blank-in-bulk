"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createProduct } from "@/actions/products";
import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("*")
      .order("sort_order")
      .then(({ data }) => setCategories(data || []));
  }, []);

  async function handleSubmit(formData) {
    const result = await createProduct(formData);
    if (result?.data) {
      router.push(`/admin/dashboard/products/${result.data.id}`);
    }
    return result;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-extrabold text-2xl text-ink mb-6">Add product</h1>
      <ProductForm categories={categories} onSubmit={handleSubmit} submitLabel="Create product" />
      <p className="text-xs text-muted mt-3">
        Save the product first, then you'll be able to upload photos and a video on the next screen.
      </p>
    </div>
  );
}
