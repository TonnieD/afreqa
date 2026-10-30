import { requireAuth } from "@/lib/auth";
import { EventForm } from "@/components/admin/EventForm";

export default async function NewEventPage() {
  await requireAuth("events:write");

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-afreqa-chrome-high/10">
        <h1 className="font-display font-extrabold text-2xl text-afreqa-chrome-high uppercase tracking-wide">
          Create Festival Edition
        </h1>
        <p className="text-xs text-afreqa-silver-mid mt-1 font-mono">
          Configure title, venue coordinates, poster art, and HustleSasa ticket tiers
        </p>
      </div>

      <EventForm />
    </div>
  );
}

