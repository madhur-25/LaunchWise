// This component is a placeholder that mimics the structure of our ExperimentCard.
// The `animate-pulse` class from Tailwind CSS is what creates the cool loading effect.

export function SkeletonCard() {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        {/* Placeholder for Title */}
        <div className="h-6 w-3/4 bg-gray-700 rounded animate-pulse"></div>
        {/* Placeholder for Status Badge */}
        <div className="h-6 w-16 bg-gray-700 rounded-full animate-pulse"></div>
      </div>
      {/* Placeholder for Description */}
      <div className="h-4 w-full bg-gray-700 rounded animate-pulse mb-1"></div>
      <div className="h-4 w-5/6 bg-gray-700 rounded animate-pulse mb-4"></div>
      
      <div className="flex items-center text-sm text-gray-400 mt-4">
        {/* Placeholder for Variant Count */}
        <div className="h-5 w-24 bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
