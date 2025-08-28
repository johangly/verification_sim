import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, RefreshCw, SquareCheckBig, List, LayoutGrid, Upload,SlidersHorizontal, X } from 'lucide-react';
import { PhoneNumber } from '../types/phoneNumber';
import { phoneNumberService } from '../services/api';
import { messagesService } from '../services/messagesService';
import { PhoneNumberCard } from '../components/PhoneNumberCard';
import { PhoneNumberForm } from '../components/PhoneNumberForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { toast } from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';
import { PhoneNumberFileForm } from '../components/PhoneNumberFileForm';
import type { CreatePhoneNumberByFileRequest, PhoneNumberStatus } from '../types/phoneNumber';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

import { ChevronDownIcon } from "lucide-react"
import { Button } from "../components/ui/button"
import { Calendar } from "../components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/ui/tooltip"

import { useTheme } from '../contexts/ThemeContext';

export const HomePage: React.FC = () => {
  // ============================================
  // Estados principales del componente
  // ============================================
  
  // Estados para la gestión de números telefónicos
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [filteredPhoneNumbers, setFilteredPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [selectedPhoneNumbers, setSelectedPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<PhoneNumber | undefined>();
  
  // Estados para la interfaz de usuario
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [areAllSelected, setAreAllSelected] = useState(false);
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PhoneNumberStatus | 'all'>('all');
  const [elementsPerPage, setElementsPerPage] = useState<number>(50);
  const [showAdvandeFilter, setShowAdvandeFilter] = useState(false);
  
  // Estados para el rango de fechas
  const [openStartCreationCalendar, setOpenStartCreationCalendar] = useState(false);
  const [openEndCreationCalendar, setOpenEndCreationCalendar] = useState(false);
  const [range, setRange] = React.useState<{ start: Date | undefined; end: Date | undefined }>({
    start: undefined,
    end: undefined
  });
  
  // Estados para los modales
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFileFormOpen, setIsFileFormOpen] = useState(false);

  const { isDark } = useTheme();
  
  // ============================================
  // Funciones para el envío de mensajes
  // ============================================
  
  /**
   * Maneja el envío de mensajes a los números seleccionados
   */
  const handleSendMessages = async () => {
    if (selectedPhoneNumbers.length === 0) {
      toast.error('No hay números seleccionados para enviar mensajes');
      return;
    }
    
    setIsSubmitting(true);
    const phoneNumbersToSend = selectedPhoneNumbers.map(phone => phone.phoneNumber);
    
    const loadingToast = toast.loading('Enviando mensajes...');
    
    try {
      const response = await messagesService.sendMessage({ phoneNumbers: phoneNumbersToSend });
      
      // Actualizar la lista de números con los estados actualizados
      setPhoneNumbers(prev => {
        const updatedNumbers = response.updatedNumbers as PhoneNumber[];
        return prev.map((phone: PhoneNumber) => {
          const updatedPhone = updatedNumbers.find((up: PhoneNumber) => up.id === phone.id);
          return updatedPhone ? { ...phone, ...updatedPhone } : phone;
        });
      });
      
      toast.dismiss(loadingToast);
      toast.success('Mensajes enviados exitosamente');
      setSelectedPhoneNumbers([]);
      setAreAllSelected(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Error al enviar mensajes');
      console.error('Error al enviar mensajes:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // Efectos secundarios
  // ============================================
  
  // Cargar números telefónicos al montar el componente
  useEffect(() => {
    loadPhoneNumbers();
  }, []);
  
  // Filtrar números telefónicos cuando cambian los filtros
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
  
  // ============================================
  // Funciones para la gestión de números telefónicos
  // ============================================
  
  /**
   * Carga los números telefónicos desde el servidor
   * @param elements Cantidad de elementos a cargar
   * @param range Rango de fechas para filtrar
   */
  const loadPhoneNumbers = async (elements?: number, range?: { start: Date | undefined; end: Date | undefined }) => {
    try {
      setIsLoading(true);
      const data = await phoneNumberService.getAllPhoneNumbers(
        elements || elementsPerPage,
        range
      );
      setPhoneNumbers(data);
      setFilteredPhoneNumbers(data);
    } catch (error) {
      console.error('Error loading phone numbers:', error);
      toast.error('Error al cargar los números de teléfono');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // Manejadores de eventos del formulario
  // ============================================
  
  /**
   * Maneja la creación de un nuevo número telefónico
   */
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

  /**
   * Maneja la creación de números telefónicos mediante archivo
   */
  const handleCreatePhoneNumberByFile = async ({file, status}: CreatePhoneNumberByFileRequest) => {
    setIsSubmitting(true);
    try {
      await phoneNumberService.createPhoneNumberByFile({file, status});
      await loadPhoneNumbers();
      toast.success('Números de teléfono creados exitosamente');
      return true;
    } catch (error) {
      console.error('Error creating phone numbers from file:', error);
      toast.error('Error al crear los números de teléfono');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // ============================================
  // Manejadores de eventos de la tabla
  // ============================================
  
  /**
   * Maneja la actualización de un número telefónico existente
   */
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

  /**
   * Maneja la selección/deselección de un número telefónico
   */
  const handleToggleSelection = (phoneNumber: PhoneNumber) => {
    console.log(phoneNumber.id, 'número seleccionado');
    setSelectedPhoneNumbers(prev => 
      prev.some(p => p.id === phoneNumber.id)
        ? prev.filter(p => p.id !== phoneNumber.id)
        : [...prev, phoneNumber]
    );
  };

  /**
   * Abre el formulario de edición para un número telefónico
   */
  const handleEdit = (phoneNumber: PhoneNumber) => {
    setSelectedPhoneNumber(phoneNumber);
    setIsFormOpen(true);
  };

  /**
   * Prepara la eliminación de un número telefónico
   */
  const handleDelete = (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Confirma y ejecuta la eliminación de un número telefónico
   */
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
  
  // ============================================
  // Funciones auxiliares para la interfaz de usuario
  // ============================================
  
  /**
   * Abre el formulario para crear un nuevo número
   */
  const openCreateForm = () => {
    setSelectedPhoneNumber(undefined);
    setIsFormOpen(true);
  };

  /**
   * Cierra el formulario de carga por archivo
   */
  const closeFileForm = () => {
    setIsFileFormOpen(false);
  };
  
  /**
   * Abre el formulario de carga por archivo
   */
  const openFileForm = () => {
    setIsFileFormOpen(true);
  };
  
  /**
   * Cierra el formulario de edición/creación
   */
  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedPhoneNumber(undefined);
  };

  return (
    <div className={twMerge("w-full flex justify-center items-start gap-5")}>
      {/* Principal content */}
      <div className='max-w-6xl space-y-6'>
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Clientes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestiona y verifica clientes
            </p>
          </motion.div>
        <div className="flex items-center space-x-2">
          <AnimatePresence>
            {selectedPhoneNumbers.length > 0 && (
              <Tooltip delayDuration={500}>
              <TooltipTrigger>
              <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={handleSendMessages}
              className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <SquareCheckBig className="w-4 h-4" />
                <span>Empezar validacion</span>
              </motion.button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>
                <p className='max-w-xs'>Envia un mensaje de WhatsApp a todos los numeros de telefono de los clientes seleccionados para validar si el numero es valido y/o esta en uso, segun la respuesta del cliente se actualizara el estado.</p>
              </TooltipContent>
            </Tooltip>
            )}
          </AnimatePresence>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openCreateForm}
            className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Cliente</span>
          </motion.button>
          <Tooltip delayDuration={500}>
            <TooltipTrigger>
              <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openFileForm}
              className="bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Subir CSV</span>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Crea clientes a partir de un archivo CSV</p>
            </TooltipContent>
          </Tooltip>
         
        </div>
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
            <Tooltip delayDuration={500}>
              <TooltipTrigger>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (areAllSelected) {
                      setSelectedPhoneNumbers([]);
                      setAreAllSelected(false);
                    } else {
                      setSelectedPhoneNumbers(filteredPhoneNumbers);
                      setAreAllSelected(true);
                    }
                  }}
                  className={twMerge(
                    'bg-transparent border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2 w-[205px]',
                    areAllSelected ? 'bg-gray-200 dark:bg-gray-600' : ''
                  )}
                >
                  <SquareCheckBig className="w-4 h-4" />
                  <span>{areAllSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{areAllSelected ? 'Deseleccionar todos los clientes mostrados' : 'Seleccionar todos los clientes mostrados'}</p>
              </TooltipContent>
            </Tooltip>
            <div className="flex items-center space-x-3">
              <Tooltip delayDuration={500}>
                <TooltipTrigger>
                  <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAdvandeFilter(!showAdvandeFilter)}
                  className={twMerge(
                    'bg-transparent border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2 w-[205px]',
                    showAdvandeFilter === true ? 'bg-gray-200 dark:bg-gray-600' : ''
                  )}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filtros Avanzados</span>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mostrar filtros avanzados</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={500}>
                <TooltipTrigger>
                  <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => loadPhoneNumbers()}
                  className="p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  disabled={isLoading}
                  title="Actualizar"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Volver a cargar la informacion de los clientes</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip delayDuration={500}>
                <TooltipTrigger>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title={viewMode === 'grid' ? 'Cambiar a vista de lista' : 'Cambiar a vista de cuadrícula'}
                  >
                    {viewMode === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cambiar la vista de los clientes</p>
                </TooltipContent>
              </Tooltip>
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
              className={twMerge(viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-3')}
            >
              {filteredPhoneNumbers.map((phone,index) => (
                <PhoneNumberCard
                  key={phone.id}
                  index={index}
                  viewMode={viewMode}
                  phoneNumber={phone}
                  onEdit={() => handleEdit(phone)}
                  onDelete={() => handleDelete(phone.id)}
                  isSelected={selectedPhoneNumbers.some(p => p.id === phone.id)}
                  onToggleSelection={handleToggleSelection}
                />
                ))}
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
      </div>

      {/* Advance filters */}
     <AnimatePresence>
      {showAdvandeFilter && (
          <motion.div 
          initial={{ width:0, x:20,opacity: 0 }}
          animate={{ width:280, x:0, opacity:1 }}
          exit={{ width: 0, x: 20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className='overflow-x-hidden overflow-y-auto sticky top-0 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700'
        >
          <div className='w-[280px] p-4 flex flex-col space-y-3'>
            <div className='flex flex-col justify-center items-start space-y-2'> 
              <label htmlFor="" className="text-sm font-medium text-gray-900 dark:text-white opacity-70">Estado</label>
              <Select value={statusFilter.toString()} onValueChange={(value) => setStatusFilter(value as PhoneNumberStatus | 'all')}>
                <SelectTrigger style={{padding: '.5rem 1rem',height:'42px'}} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-[1rem] font-inherit text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent className='bg-white dark:bg-gray-700'>
                  <SelectItem className={twMerge(statusFilter === 'all' && 'bg-blue-600 text-white')} value="all">Todos los estados</SelectItem>
                  <SelectItem className={twMerge(statusFilter === 'verificado' && 'bg-blue-600 text-white')} value="verificado">Verificado</SelectItem>
                  <SelectItem className={twMerge(statusFilter === 'por verificar' && 'bg-blue-600 text-white')} value="por verificar">Por Verificar</SelectItem>
                  <SelectItem className={twMerge(statusFilter === 'no verificado' && 'bg-blue-600 text-white')} value="no verificado">No Verificado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col justify-center items-start space-y-2'> 
              <label htmlFor="" className="text-sm font-medium text-gray-900 dark:text-white opacity-70">Clientes por pagina</label>
              <Select value={elementsPerPage.toString()} onValueChange={(value) => setElementsPerPage(Number(value))}>
                <SelectTrigger style={{padding: '.5rem 1rem',height:'42px'}} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-[1rem] font-inherit text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent className='bg-white dark:bg-gray-700'>
                  <SelectItem className={twMerge(elementsPerPage === 50 && 'bg-blue-600 text-white')} value="50">50</SelectItem>
                  <SelectItem className={twMerge(elementsPerPage === 100 && 'bg-blue-600 text-white')} value="100">100</SelectItem>
                  <SelectItem className={twMerge(elementsPerPage === 200 && 'bg-blue-600 text-white')} value="200">200</SelectItem>
                  <SelectItem className={twMerge(elementsPerPage === 500 && 'bg-blue-600 text-white')} value="500">500</SelectItem>
                  <SelectItem className={twMerge(elementsPerPage === 1000 && 'bg-blue-600 text-white')} value="1000">1000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label htmlFor="first_date" className="text-sm font-medium text-gray-900 dark:text-white opacity-70">Fecha de creacion</label>
            <div className="flex flex-col justify-center space-y-2 ml-2">
              <label htmlFor="first_date" className="text-sm font-medium text-gray-900 dark:text-white opacity-70">Inicio</label>
              <div className="flex items-center w-full gap-2">
                <Popover open={openStartCreationCalendar} onOpenChange={setOpenStartCreationCalendar}>
                  <PopoverTrigger className='w-full'>
                    <Button
                      variant="outline"
                      id="first_date"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-base font-normal text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{height:'42px'}}
                    >
                      <div className="flex w-full items-center justify-between">
                        {range.start ? range.start.toLocaleDateString() : "Seleccione fecha"}
                        <ChevronDownIcon />
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={range.start}
                      captionLayout="dropdown"
                      style={isDark ? {background: 'var(--color-gray-700)'} : {background: 'var(--color-gray-50)'}}
                      onSelect={(date) => {
                        setRange((prev) => ({ ...prev, start: date }))
                        setOpenStartCreationCalendar(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
                  <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRange((prev) => ({ ...prev, start: undefined }))}
                  className="p-3 bg-red-500/50 text-white dark:bg-red-500/50 dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-red-500/70 dark:hover:bg-red-500/70 rounded-lg transition-colors"
                  title="Limpiar fecha"
                  >
                    <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-2 ml-2">
              <label htmlFor="first_date" className="text-sm font-medium text-gray-900 dark:text-white opacity-70">Final</label>
              <div className="flex items-center w-full gap-2">
                <Popover open={openEndCreationCalendar} onOpenChange={setOpenEndCreationCalendar}>
                  <PopoverTrigger className='w-full'>
                    <Button
                      variant="outline"
                      id="first_date"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-base font-normal text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{height:'42px'}}
                    >
                      <div className="flex w-full items-center justify-between">
                        {range.end ? range.end.toLocaleDateString() : "Seleccione fecha"}
                        <ChevronDownIcon />
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={range.end}
                      captionLayout="dropdown"
                      style={isDark ? {background: 'var(--color-gray-700)'} : {background: 'var(--color-gray-50)'}}
                      onSelect={(date) => {
                        setRange((prev) => ({ ...prev, end: date }))
                        setOpenEndCreationCalendar(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
                  <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRange((prev) => ({ ...prev, end: undefined }))}
                  className="p-3 bg-red-500/50 text-white dark:bg-red-500/50 dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-red-500/70 dark:hover:bg-red-500/70 rounded-lg transition-colors"
                  title="Limpiar fecha"
                  >
                    <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => loadPhoneNumbers(elementsPerPage, range)}
                className="p-2 bg-blue-600 text-white dark:bg-blue-600 dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-blue-600/70 dark:hover:bg-blue-600/70 rounded-lg transition-colors"
                title="Buscar"
                >
                  Buscar
              </motion.button>
            </div>
          </div>
         
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

      <PhoneNumberFileForm
        isOpen={isFileFormOpen}
        onClose={closeFileForm}
        onSubmit={handleCreatePhoneNumberByFile}
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