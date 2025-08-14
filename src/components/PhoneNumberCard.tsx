import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Phone, Clock, CheckCircle, XCircle } from 'lucide-react';
import { PhoneNumber } from '../types/phoneNumber';
import { Checkbox } from "../components/ui/checkbox"
import { twMerge } from 'tailwind-merge';

interface PhoneNumberCardProps {
  phoneNumber: PhoneNumber;
  onEdit: (phoneNumber: PhoneNumber) => void;
  onDelete: (id: number) => void;
  isSelected: boolean;
  onToggleSelection: (phoneNumber: PhoneNumber) => void;
}

export const PhoneNumberCard: React.FC<PhoneNumberCardProps> = ({
  phoneNumber,
  onEdit,
  onDelete,
  isSelected,
  onToggleSelection,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verificado':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'no verificado':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verificado':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'no verificado':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className={twMerge("bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow", isSelected && "border-blue-600 dark:border-blue-400 bg-blue-100 dark:bg-blue-900/20")}
    >
      <div className="flex items-start justify-between h-[122px]">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {phoneNumber.phoneNumber}
            </h3>
          </div>
          
          <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(phoneNumber.status)}`}>
            {getStatusIcon(phoneNumber.status)}
            <span className="capitalize">{phoneNumber.status}</span>
          </div>
          
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>Creado: {new Date(phoneNumber.createdAt).toLocaleDateString('es-ES')}</p>
            <p>Actualizado: {new Date(phoneNumber.updatedAt).toLocaleDateString('es-ES')}</p>
          </div>
        </div>

        <div className='flex flex-col justify-between items-center h-full'>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(phoneNumber)}
              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(phoneNumber.id)}
              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
          <Checkbox className="w-6 h-6 ml-auto" style={{backgroundColor: isSelected ? "var(--color-blue-400)" : "transparent", borderColor: isSelected ? "var(--color-blue-400)" : "var(--color-slate-300)"}} checked={isSelected} onCheckedChange={() => onToggleSelection(phoneNumber)} />
        </div>
      </div>
    </motion.div>
  );
};