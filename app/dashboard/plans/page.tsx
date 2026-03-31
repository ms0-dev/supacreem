import { PricingSection } from "@/components/pricing-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PlansPage() {
  return (
    <div className="flex flex-col gap-6">
      <PricingSection />

      <div className="hidden gap-2 max-w-lg w-full mx-auto items-end">
        <div className="space-y-2 w-full">
          <Label>Discount code</Label>
          <Input className="w-full" placeholder="SUPACREEM10" />
        </div>
        <Button>Apply</Button>
      </div>
    </div>
  );
}
