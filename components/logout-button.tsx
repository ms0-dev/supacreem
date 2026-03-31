"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  return <Button onClick={logout}>Logout</Button>;
}
