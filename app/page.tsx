import { createClient } from "@/lib/supabase/server";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { SupabaseTestButton } from "./components/SupabaseTestButton";
import MilvusStatus from "./components/MilvusStatus";

export default async function Home() {
  const supabase = await createClient();

  return (
    <div className="bg-background h-screen w-full flex flex-col justify-center items-center gap-8">
      <h1 className="text-2xl font-semibold">Start Hack 2025</h1>
      {supabase ?
        <p>Supabase client successfully initialized!</p> :
        <p>Supabase did not respond yet...</p>
      }
      <ThemeSwitcher />
      <SupabaseTestButton />
      <MilvusStatus />
    </div>
  );
}
