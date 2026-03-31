import { creem } from "@/lib/creem";

export async function POST(req: Request) {
  const { subscriptionId } = await req.json();

  if (!subscriptionId) {
    return Response.json({ error: "Missing subscriptionId" }, { status: 400 });
  }

  try {
    await creem.subscriptions.cancel({
      subscriptionId,
      mode: "scheduled",
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to cancel subscription:", error);

    return Response.json(
      { error: "Failed to cancel subscription" },
      { status: 500 },
    );
  }
}
