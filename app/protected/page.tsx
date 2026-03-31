import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/server";
import Link from "next/link";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-svh w-full items-center justify-center gap-2">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <p>
            Hello <span>{data.claims.email}</span>
          </p>
          <LogoutButton />
        </div>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
