import { cn } from "@/lib/utils";

import { createClient } from "@/lib/supabase/server";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { secondary_font } from "@/lib/fonts";

export default async function Home() {
  return <>
    <header className="p-5 h-14 w-screen flex align-center">
      <h1 className="h-fit">SIX</h1>
      <ThemeSwitcher />
    </header>
  </>
}

