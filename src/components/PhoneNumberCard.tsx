import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Phone, Clock, CheckCircle, XCircle } from 'lucide-react';
import { PhoneNumber } from '../types/phoneNumber';
import { Checkbox } from "./ui/checkbox";
import { cn } from '../lib/utils';

interface PhoneNumberCardBaseProps {
  phoneNumber: PhoneNumber;
  onEdit: (phoneNumber: PhoneNumber) => void;
  onDelete: (id: number) => void;
  isSelected: boolean;
  onToggleSelection: (phoneNumber: PhoneNumber) => void;
  showSelectBox?: boolean;
  children?: ReactNode;
  className?: string;
  index?: string;
}

interface GridViewProps extends PhoneNumberCardBaseProps {
  isSelected: boolean;
}

interface ListViewProps extends PhoneNumberCardBaseProps {
  isSelected: boolean;
}

interface PhoneNumberCardProps extends Omit<PhoneNumberCardBaseProps, 'className' | 'children'> {
  viewMode: 'grid' | 'list';
}

const PhoneNumberCardBase: React.FC<PhoneNumberCardBaseProps> = ({
  children
}) => {
  return (
    children
  );
};

const GridView: React.FC<Omit<GridViewProps, 'children'>> = ({
  phoneNumber,
  onEdit,
  onDelete,
  isSelected,
  className,
  index,
  onToggleSelection,
  showSelectBox
}) => {
  console.log(index);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4,delay: Number(index) * 0.02, type: 'spring', stiffness: 100 }}
      key={phoneNumber.id} 
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-colors",
        isSelected && "border-blue-600 dark:border-blue-400 bg-blue-100 dark:bg-blue-900/20",
        className
      )}
    >
      <div className="flex items-start justify-between p-6 h-[164px]">
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
        
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <p>Creado: {new Date(phoneNumber.createdAt).toLocaleDateString('es-ES')}</p>
          <p>Actualizado: {new Date(phoneNumber.updatedAt).toLocaleDateString('es-ES')}</p>
        </div>
      </div>

      <div className="flex flex-col justify-between items-center h-full">
        <div className="flex space-x-2">
          <ActionButton onClick={() => onEdit(phoneNumber)} color="blue">
            <Edit className="w-4 h-4" />
          </ActionButton>
          <ActionButton onClick={() => onDelete(phoneNumber.id)} color="red">
            <Trash2 className="w-4 h-4" />
          </ActionButton>
        </div>
        {showSelectBox && (
          <Checkbox 
            className="w-6 h-6 ml-auto mt-4" 
            style={{
              backgroundColor: isSelected ? "var(--color-blue-400)" : "transparent", 
              borderColor: isSelected ? "var(--color-blue-400)" : "var(--color-slate-300)"
            }} 
            checked={isSelected} 
            onCheckedChange={() => onToggleSelection(phoneNumber)} 
          />
        )}
      </div>
    </div>
    </motion.div>
  );
};

const ListView: React.FC<Omit<ListViewProps, 'children'>> = ({
  phoneNumber,
  onEdit,
  onDelete,
  isSelected,
  className,
  index,
  onToggleSelection,
  showSelectBox
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4,delay: Number(index) * 0.1, type: 'spring', stiffness: 100 }}
      key={phoneNumber.id} 
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-colors",
        isSelected && "border-blue-600 dark:border-blue-400 bg-blue-100 dark:bg-blue-900/20",
        className
      )}
    >
    <div className="flex items-center justify-between w-full p-4">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2 min-w-[180px]">
          <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {phoneNumber.phoneNumber}
          </h3>
        </div>
        
        <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(phoneNumber.status)}`}>
          {getStatusIcon(phoneNumber.status)}
          <span className="capitalize">{phoneNumber.status}</span>
        </div>
        
        <div className="flex justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
          <p>Creado: {new Date(phoneNumber.createdAt).toLocaleDateString('es-ES')}</p>
          <p>Actualizado: {new Date(phoneNumber.updatedAt).toLocaleDateString('es-ES')}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <ActionButton onClick={() => onEdit(phoneNumber)} color="blue">
          <Edit className="w-4 h-4" />
        </ActionButton>
        <ActionButton onClick={() => onDelete(phoneNumber.id)} color="red">
          <Trash2 className="w-4 h-4" />
        </ActionButton>
        {showSelectBox && (
          <Checkbox 
            className="w-6 h-6 ml-2" 
            style={{
              backgroundColor: isSelected ? "var(--color-blue-400)" : "transparent", 
              borderColor: isSelected ? "var(--color-blue-400)" : "var(--color-slate-300)"
            }} 
            checked={isSelected} 
            onCheckedChange={() => onToggleSelection(phoneNumber)} 
          />
        )}
      </div>
    </div>
    </motion.div>

  );
};

const ActionButton: React.FC<{
  onClick: () => void;
  color: 'blue' | 'red';
  children: ReactNode;
}> = ({ onClick, color, children }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={cn(
      "p-2 rounded-lg transition-colors",
      color === 'blue' 
        ? "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
    )}
  >
    {children}
  </motion.button>
);

export const PhoneNumberCard: React.FC<PhoneNumberCardProps> = ({
  viewMode,
  phoneNumber,
  onEdit,
  index,
  onDelete,
  isSelected,
  onToggleSelection,
  showSelectBox = true,
}) => {
  const commonProps = {
    phoneNumber,
    onEdit,
    index,
    onDelete,
    isSelected,
    onToggleSelection,
    showSelectBox,
  };
  return (
    <PhoneNumberCardBase {...commonProps}>
      {viewMode === 'grid' ? (
        <GridView {...commonProps} />
      ) : (
        <ListView {...commonProps} />
      )}
    </PhoneNumberCardBase>
  );
};
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
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:border-green-800/50 dark:text-green-400';
    case 'no verificado':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400';
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/50 dark:text-yellow-400';
  }
};