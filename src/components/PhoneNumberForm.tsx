import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus } from 'lucide-react';
import { phoneNumberSchema, updatePhoneNumberSchema } from '../schemas/phoneNumber';
import { PhoneNumber, PhoneNumberStatus } from '../types/phoneNumber';
import { toast } from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { twMerge } from 'tailwind-merge';

interface PhoneNumberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { phoneNumber: string; status: PhoneNumberStatus }) => Promise<boolean>;
  phoneNumber?: PhoneNumber;
  isLoading?: boolean;
}

export const PhoneNumberForm: React.FC<PhoneNumberFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  phoneNumber,
  isLoading = false,
}) => {

  const [formData, setFormData] = useState<{
    phoneNumber: string;
    status: PhoneNumberStatus;
  }>({
    phoneNumber: '',
    status: 'no verificado',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (phoneNumber) {
      setFormData({
        phoneNumber: phoneNumber.phoneNumber,
        status: phoneNumber.status,
      });
    } else {
      setFormData({
        phoneNumber: '',
        status: 'no verificado',
      });
    }
    setErrors({});
  }, [phoneNumber, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const schema = phoneNumber ? updatePhoneNumberSchema : phoneNumberSchema;
      const validation = schema.safeParse(formData);
      if (validation.success === false) {
        validation.error.issues.forEach(err => {
          const errorMessage = err.message;
          toast.error(errorMessage);
        });
        return;
      }
      const response = await onSubmit(validation.data);
      if (response) {
        onClose();
      }
    } catch (error) {
      console.error(`Error al ${phoneNumber ? 'actualizar' : 'crear'} el número de teléfono:`, error);
      toast.error(`Error al ${phoneNumber ? 'actualizar' : 'crear'} el número de teléfono`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                {phoneNumber ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                <span>{phoneNumber ? 'Editar' : 'Agregar'} Número</span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número de Teléfono
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.phoneNumber
                      ? 'border-red-500 dark:border-red-400'
                      : 'border-gray-300 dark:border-gray-600'
                    }`}
                  placeholder="Ej: +57 3123456789"
                />
                {errors.phoneNumber && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    {errors.phoneNumber}
                  </motion.p>
                )}
              </div>

              <div>
                {/* <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="por verificar">Por Verificar</option>
                  <option value="verificado">Verificado</option>
                  <option value="no verificado">No Verificado</option>
                </select> */}
                <div className='flex flex-col justify-center items-start space-y-2'>
                  <label htmlFor="status" className="text-sm font-medium text-gray-900 dark:text-white opacity-70">Estado</label>
                  <Select  value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as PhoneNumberStatus }))}>
                    <SelectTrigger id="status" name="status" style={{ padding: '.5rem 1rem', height: '42px' }} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-[1rem] font-inherit text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-white dark:bg-gray-700'>
                      <SelectItem className={twMerge(formData.status === 'verificado' && 'bg-blue-600 text-white')} value="verificado">Verificado</SelectItem>
                      <SelectItem className={twMerge(formData.status === 'por verificar' && 'bg-blue-600 text-white')} value="por verificar">Por Verificar</SelectItem>
                      <SelectItem className={twMerge(formData.status === 'no verificado' && 'bg-blue-600 text-white')} value="no verificado">No Verificado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      {phoneNumber ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{phoneNumber ? 'Actualizar' : 'Crear'}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};