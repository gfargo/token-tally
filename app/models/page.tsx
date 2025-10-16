import { AnimatedMainContainer } from "@/components/animated-main-container";
import { getAdditionalPricingCatalog } from "@/lib/additional-models";
import { getAllModels, getUniqueProviders } from "@/lib/models";
import Link from "next/link";
import { ModelList } from "./_components/ModelList";
import { metadata } from "./metadata";

export { metadata };

export default function ModelsPage() {
  const allModels = getAllModels();
  const additionalCatalog = getAdditionalPricingCatalog();
  const additionalProviders = Array.from(
    new Set(additionalCatalog.map((entry) => entry.provider))
  );
  const providers = [
    "All",
    ...Array.from(new Set([...getUniqueProviders(), ...additionalProviders])),
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold sr-only">Full AI Model List</h1>
        <Link
          href="/models/compare"
          className="text-sm underline text-muted-foreground"
        >
          Compare providers →
        </Link>
      </div>
      <AnimatedMainContainer>
        <ModelList
          allModels={allModels}
          providers={providers}
          additionalCatalog={additionalCatalog}
        />
      </AnimatedMainContainer>
    </div>
  );
}
