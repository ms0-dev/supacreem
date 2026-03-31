"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/hooks/use-current-user";
import { createClient } from "@/supabase/client";
import { Loader2Icon, UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SettingsPage() {
  return (
    <div className="lg:px-8 w-full">
      <div className="mx-auto max-w-4xl">
        <ProfileSection />
      </div>
    </div>
  );
}

function ProfileSection() {
  const { name, email, uid, image } = useCurrentUser();
  const firstNameValue = name?.split(" ")[0] || "";
  const lastNameValue = name?.split(" ").slice(1).join(" ") || "";
  const initials = name
    ?.split(" ")
    ?.map((word: string) => word[0])
    ?.join("")
    ?.toUpperCase();

  const [firstName, setFirstName] = useState<string | null>(firstNameValue);
  const [lastName, setLastName] = useState<string | null>(lastNameValue);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setAvatarUrl(image);
    setFirstName(firstNameValue);
    setLastName(lastNameValue);
  }, [firstNameValue, image, lastNameValue, name]);

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }
      if (!uid) return;
      const supabase = createClient();
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);
      if (uploadError) {
        throw uploadError;
      }
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateTableError } = await supabase
        .from("users")
        .update({ avatar_url: data.publicUrl })
        .eq("id", uid);

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: data.publicUrl,
        },
      });

      if (updateTableError) {
        throw updateTableError;
      }

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(data.publicUrl);
    } catch (error) {
      console.error(error);
      alert("Error uploading avatar!");
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      if (!uid) return;
      const supabase = createClient();
      const { error: updateTableError } = await supabase
        .from("users")
        .update({ avatar_url: null })
        .eq("id", uid);
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: null,
        },
      });

      if (updateTableError) {
        throw updateTableError;
      }

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(null);
    } catch (error) {
      console.error(error);
      alert("Error removing avatar!");
    }
  };

  const handleSave = async () => {
    try {
      if (!uid) return;
      setSaving(true);
      const supabase = createClient();
      const fullName = [firstName, lastName].filter(Boolean).join(" ");

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
        },
      });

      const { error: updateTableError } = await supabase
        .from("users")
        .update({ full_name: fullName })
        .eq("id", uid);

      if (updateError) {
        throw updateError;
      }

      if (updateTableError) {
        throw updateTableError;
      }
    } catch (error) {
      console.error(error);
      alert("Error saving changes!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2 lg:space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-balance">
          Personal information
        </h1>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={initials} />}
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>

              <div className="flex gap-2 flex-wrap">
                <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                  {uploading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <UploadIcon />
                  )}
                  Upload image
                </Button>
                <Button variant="outline" size="sm" onClick={removeAvatar}>
                  Remove
                </Button>
              </div>
              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
                disabled={uploading}
              />
            </div>

            {/* Personal info form */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={firstName || ""}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={lastName || ""}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email || ""} disabled />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
