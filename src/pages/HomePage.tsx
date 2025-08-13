import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';
import { PhoneNumber } from '../types/phoneNumber';
import { phoneNumberService } from '../services/api';
import { PhoneNumberCard } from '../components/PhoneNumberCard';
import { PhoneNumberForm } from '../components/PhoneNumberForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { toast } from 'react-hot-toast';

export const HomePage: React.FC = () => {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [filteredPhoneNumbers, setFilteredPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<PhoneNumber | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPhoneNumbers = async () => {
    try {
      setIsLoading(true);
      const data = await phoneNumberService.getAllPhoneNumbers();
      setPhoneNumbers(data);
      setFilteredPhoneNumbers(data);
    } catch (error) {
      console.error('Error loading phone numbers:', error);
      toast.error('Error al cargar los números de teléfono');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPhoneNumbers();
  }, []);

  useEffect(() => {
    let filtered = phoneNumbers;

    if (searchTerm) {
      filtered = filtered.filter(phone =>
        phone.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(phone => phone.status === statusFilter);
    }

    setFilteredPhoneNumbers(filtered);
  }, [phoneNumbers, searchTerm, statusFilter]);

  const handleCreatePhoneNumber = async (data: any) => {
    setIsSubmitting(true);
    try {
      await phoneNumberService.createPhoneNumber(data);
      await loadPhoneNumbers();
      toast.success('Número de teléfono creado exitosamente');
      return true;
    } catch (error) {
      console.error('Error creating phone number:', error);
      toast.error('Error al crear el número de teléfono');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePhoneNumber = async (data: any): Promise<boolean> => {
    if (!selectedPhoneNumber) {
      toast.error('No se ha seleccionado un número de teléfono');
      return false;
    }
    
    setIsSubmitting(true);
    try {
      await phoneNumberService.updatePhoneNumber(selectedPhoneNumber.id, data);
      await loadPhoneNumbers();
      toast.success('Número de teléfono actualizado exitosamente');
      return true;
    } catch (error) {
      console.error('Error updating phone number:', error);
      toast.error('Error al actualizar el número de teléfono');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePhoneNumber = async () => {
    if (!deleteId) return;
    
    setIsSubmitting(true);
    try {
      await phoneNumberService.deletePhoneNumber(deleteId);
      await loadPhoneNumbers();
      toast.success('Número de teléfono eliminado exitosamente');
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
      return true;
    } catch (error) {
      console.error('Error deleting phone number:', error);
      toast.error('Error al eliminar el número de teléfono');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditForm = (phoneNumber: PhoneNumber) => {
    setSelectedPhoneNumber(phoneNumber);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setSelectedPhoneNumber(undefined);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedPhoneNumber(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Números de Teléfono
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona y verifica números telefónicos
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreateForm}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Número</span>
        </motion.button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por número de teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="verificado">Verificado</option>
              <option value="por verificar">Por Verificar</option>
              <option value="no verificado">No Verificado</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => loadPhoneNumbers()}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
            />
          </motion.div>
        ) : filteredPhoneNumbers.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredPhoneNumbers.map((phoneNumber) => (
                <PhoneNumberCard
                  key={phoneNumber.id}
                  phoneNumber={phoneNumber}
                  onEdit={openEditForm}
                  onDelete={openDeleteDialog}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No se encontraron números
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Intenta cambiar los filtros de búsqueda'
                : 'Comienza agregando tu primer número de teléfono'
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openCreateForm}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Agregar Número
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Modal */}
      <PhoneNumberForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={selectedPhoneNumber ? handleUpdatePhoneNumber : handleCreatePhoneNumber}
        phoneNumber={selectedPhoneNumber}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleDeletePhoneNumber}
        title="Eliminar Número"
        message="¿Estás seguro de que quieres eliminar este número de teléfono? Esta acción no se puede deshacer."
        isLoading={isSubmitting}
      />
    </div>
  );
};