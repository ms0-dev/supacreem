import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    error: string;
    error_code?: string;
    error_description?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Sorry, something went wrong.
              </CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Error: {params.error}</p>
                  {params.error_code && <p>Code: {params.error_code}</p>}
                  {params.error_description && (
                    <p>Description: {params.error_description}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  An unspecified error occurred.
                </p>
              )}
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/sign-in">Go back</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
