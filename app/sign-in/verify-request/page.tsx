import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-1">
      <Card className="w-full max-w-sm relative overflow-visible">
        <span className="absolute -top-4 -right-4 rotate-20">
          <Mail className="text-purple-400 animate-pulse" size={48} />
        </span>
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent you a login link. Please check your email to
            continue.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="flex-col gap-2">
          <p className="text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder.
          </p>
          <Button variant="link" asChild>
            <Link href="/sign-in">
              <ArrowLeft />
              Back to sign in
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
