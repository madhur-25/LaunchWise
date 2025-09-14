import { Experiment } from "../App";
import { Pencil, Trash2, GitBranch } from 'lucide-react';

// This interface defines what props the component accepts
interface ExperimentCardProps {
  experiment: Experiment;
  onDelete: (experimentId: string) => void;
  onEdit: (experiment: Experiment) => void; // <-- Add the onEdit prop
}

export function ExperimentCard({ experiment, onDelete, onEdit }: ExperimentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-500';
      case 'RUNNING': return 'bg-green-500';
      case 'COMPLETED': return 'bg-blue-500';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col justify-between group relative shadow-lg hover:shadow-cyan-500/10 transition-shadow">
      <div>
        <div className="flex justify-between items-start mb-2">
          {/* Container for the title and the hover-buttons */}
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-lg text-white">{experiment.name}</h3>
            {/* The Buttons: Now appear next to the title on hover */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => onEdit(experiment)} // <-- Add onClick handler
                className="text-gray-400 hover:text-white"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => onDelete(experiment.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* The Status Badge: Now always visible */}
          <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${getStatusColor(experiment.status)}`}>
            {experiment.status}
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-4">{experiment.description}</p>
      </div>
      <div className="flex items-center text-sm text-gray-400 mt-4">
        <GitBranch size={16} className="mr-2" />
        <span>{experiment.variants.length} Variants</span>
      </div>
    </div>
  );
}

