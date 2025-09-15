import { useState, useEffect } from 'react';
import { Experiment } from '../types';
import { motion, AnimatePresence } from 'framer-motion'; // <-- Import motion

interface EditExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (experimentId: string, data: { name: string; description: string }) => void;
  experimentData: Experiment | null;
}

export function EditExperimentModal({ isOpen, onClose, onUpdate, experimentData }: EditExperimentModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (experimentData) {
      setName(experimentData.name);
      setDescription(experimentData.description || '');
    }
  }, [experimentData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !experimentData) return;
    onUpdate(experimentData.id, { name, description });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-white">Edit Experiment</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="edit-name" className="block text-gray-300 text-sm font-bold mb-2">
                  Experiment Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="edit-description" className="block text-gray-300 text-sm font-bold mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="edit-description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

