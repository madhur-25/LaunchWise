// now importing from our new, centralized types file
import { Experiment } from "../types"; 
import { Pencil, Trash2, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion'; // <-- Import motion

interface ExperimentCardProps {
  experiment: Experiment;
  onDelete: (experimentId: string) => void;
  onEdit: (experiment: Experiment) => void;
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

  // Define the animation variants for the card
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    // Wrap the card in a motion.div and apply the variants
    <motion.div 
      variants={cardVariants}
      className="bg-gray-800 rounded-lg p-4 flex flex-col justify-between group relative shadow-lg hover:shadow-cyan-500/10 transition-shadow"
      layout // This animates the card's position if other cards are deleted
      exit={{ opacity: 0, scale: 0.8 }} // Animate out when deleted
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-lg text-white">{experiment.name}</h3>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => onEdit(experiment)}
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
    </motion.div>
  );
}

