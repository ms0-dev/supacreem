"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Clipboard } from "lucide-react";
import { useState } from "react";

export default function ReferralsPage() {
  const [referralLink, setReferralLink] = useState(
    "https://creem.io?ref=123456",
  );
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Earn Credits</CardTitle>
        <CardDescription>
          Share your referral link and earn 100 credits for every friend who
          signs up
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <p>Share your unique referral link with friends</p>
          <div className="flex items-center gap-2">
            <Input type="text" value={referralLink} readOnly />
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              {isCopied ? <Check /> : <Clipboard />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
