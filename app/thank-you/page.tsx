import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage({
  // use anything from searchParams if needed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchParams,
}: {
  searchParams: {
    checkout_id: string;
    order_id: string;
    customer_id: string;
    subscription_id: string;
    product_id: string;
    signature: string;
  };
}) {
  return (
    <div className="flex flex-col h-screen items-center justify-center gap-6 p-6 text-center">
      <div className="relative w-full max-w-sm">
        <h1 className="text-5xl font-bold">Thank You!</h1>
        <p className="mt-4 text-lg">Your subscription has been processed.</p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
