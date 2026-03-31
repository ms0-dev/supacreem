"use client";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { createClient } from "@/supabase/client";
import { Loader2Icon, UploadIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function AvatarUpload({
  uid,
  url,
  onUpload,
}: {
  uid: string | null;
  url: string | null;
  onUpload: (url: string) => void;
}) {
  const { image: profileImage, name } = useCurrentUser();

  const initials = name
    ?.split(" ")
    ?.map((word: string) => word[0])
    ?.join("")
    ?.toUpperCase();

  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);
        if (error) {
          throw error;
        }

        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    }

    if (url) downloadImage(url);
  }, [url, supabase]);

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert("Error uploading avatar!");
    } finally {
      setUploading(false);
    }
  };

  return (
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
        <Button variant="outline" size="sm">
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
  );
}
