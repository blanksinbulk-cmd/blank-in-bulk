import { createClient } from "@/lib/supabase/server";
import { createCategory, updateCategory, deleteCategory } from "@/actions/categories";
import CategoryManager from "./CategoryManager";

export default async function CategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-extrabold text-2xl text-ink mb-6">Categories</h1>
      <CategoryManager
        categories={categories || []}
        createAction={createCategory}
        updateAction={updateCategory}
        deleteAction={deleteCategory}
      />
    </div>
  );
}
