import { useEffect, useState } from "react";

import { createClient } from "@/supabase/client";

interface CurrentUser {
  uid: string | null;
  name: string | null;
  image: string | null;
  email: string | null;
}

export const useCurrentUser = () => {
  const [user, setUser] = useState<CurrentUser>({
    uid: null,
    name: null,
    image: null,
    email: null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await createClient().auth.getSession();

      if (error) {
        console.error(error);
      }

      setUser({
        uid: data.session?.user.id ?? null,
        name: data.session?.user.user_metadata.full_name ?? "?",
        image: data.session?.user.user_metadata.avatar_url ?? null,
        email: data.session?.user.email ?? null,
      });
    };

    fetchUser();
  }, []);

  return user;
};
