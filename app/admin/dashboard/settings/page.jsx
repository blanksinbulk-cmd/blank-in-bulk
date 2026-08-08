import { createClient } from "@/lib/supabase/server";
import { updateSettings } from "@/actions/settings";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-extrabold text-2xl text-ink mb-6">Contact & About</h1>
      <SettingsForm settings={settings} updateAction={updateSettings} />
    </div>
  );
}
