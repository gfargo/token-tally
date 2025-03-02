import { getAllModels, getUniqueProviders } from '@/lib/models';
import { ModelList } from "./_components/ModelList";
import { metadata } from "./metadata";

export { metadata };

export default function ModelsPage() {
  const allModels = getAllModels()
  const providers = ["All", ...getUniqueProviders()];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold sr-only">Full AI Model List</h1>
        </div>
      </div>
      <ModelList
        allModels={allModels}
        providers={providers}
      />
    </div>
  );
}
