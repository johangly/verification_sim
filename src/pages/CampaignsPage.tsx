import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import CampaignCard from "../components/CampaignCard";
import useCampaigns from "../hooks/useCampaigns";
import LoadingSpinner from "../components/LoadingSpinner";
import { useEffect, useState } from "react";
import { CampaignType } from "../types/campaigns";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, LayoutGrid, List, Plus, Search, SquareCheckBig, Upload } from "lucide-react";
import { PhoneNumberFileForm } from "../components/PhoneNumberFileForm";
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "../components/ui/tooltip"
import toast from "react-hot-toast";
import { CreatePhoneNumberByFileRequest, PhoneNumber, PhoneNumberStatus } from "../types/phoneNumber";
import { campaignsService } from "../services/campaignsService";
import { PhoneNumberCard } from "../components/PhoneNumberCard";
import { PhoneNumberForm } from "../components/PhoneNumberForm";
import { StartCampaignDialog } from "../components/StartCampaignDialog";
import { io, Socket } from 'socket.io-client';

const VITE_SOCKET_API_URL = import.meta.env.VITE_SOCKET_API_URL;

export default function CampaignsPage() {

	const { allCampaigns, loading } = useCampaigns();
	const [createNewCampaign, setCreateNewCampaign] = useState(false);

	if (loading) return <LoadingSpinner />;

	return (
		<div
			className={twMerge(
				"w-full flex justify-center items-start gap-5"
			)}
		>
			<AnimatePresence>
				{createNewCampaign ? <CampaignForm setCreateNewCampaign={setCreateNewCampaign} /> : <CampaignList campaigns={allCampaigns} setCreateNewCampaign={setCreateNewCampaign} />}
			</AnimatePresence>
		</div>
	);
}

function CampaignForm({ setCreateNewCampaign }: { setCreateNewCampaign: (value: boolean) => void }) {
	const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
	const [openFileForm, setOpenFileForm] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [filteredPhoneNumbers, setFilteredPhoneNumbers] = useState<PhoneNumber[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [sendingCreateCampaign, setSendingCreateCampaign] = useState(false);
	const [
		statusFilter,
		// setStatusFilter
	] = useState<PhoneNumberStatus | 'all'>('all');
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<PhoneNumber | undefined>(undefined);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [deleteId, setDeleteId] = useState<number | null>(null);
	const [isStartCampaignDialogOpen, setIsStartCampaignDialogOpen] = useState(false);

	const closeForm = () => {
		setSelectedPhoneNumber(undefined);
		setIsFormOpen(false);
	};

	const handleCreatePhoneNumberByFile = async ({ file, status }: CreatePhoneNumberByFileRequest) => {
		setIsLoading(true);
		try {
			const { phoneNumbersToCreate } = await campaignsService.readClientsByFile({ file, status });
			// Verificar duplicados
			const existingNumbers = new Set(phoneNumbers.map(p => p.phoneNumber));
			const duplicates: string[] = [];
			const uniqueNewNumbers = phoneNumbersToCreate.filter((phone: PhoneNumber) => {
				const isDuplicate = existingNumbers.has(phone.phoneNumber);
				if (isDuplicate) {
					duplicates.push(phone.phoneNumber);
				}
				return !isDuplicate;
			});

			// Mostrar errores para duplicados
			if (duplicates.length > 0) {
				duplicates.forEach(number => {
					toast.error(`El cliente con el numero "${number}" ya existe y será omitido`);
				});
			}

			// Agregar solo números únicos
			setPhoneNumbers(prev => [...prev, ...uniqueNewNumbers]);

			const successMessage = uniqueNewNumbers.length > 0
				? `Se agregaron ${uniqueNewNumbers.length} clientes exitosamente`
				: 'No se agregaron nuevos clientes (todos eran duplicados)';

			if (uniqueNewNumbers.length > 0) {
				toast.success(successMessage);
			} else {
				toast(successMessage, { icon: 'ℹ️' });
			}

			return true;
		} catch (error) {
			console.error('Error al crear clientes desde el archivo:', error);
			toast.error('Error al procesar el archivo');
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const openCreateForm = () => {
		setSelectedPhoneNumber(undefined);
		setIsFormOpen(true);
	};

	const handleEdit = (phoneNumber: PhoneNumber) => {
		setSelectedPhoneNumber(phoneNumber);
		setIsFormOpen(true);
	};

	const handleDelete = (id: number) => {
		setDeleteId(id);
		setIsDeleteDialogOpen(true);
	};

	const handleDeletePhoneNumber = async () => {
		if (!deleteId) return;

		setIsLoading(true);
		try {
			setPhoneNumbers((prev) => prev.filter((item) => item.id !== deleteId))

			toast.success('Número de teléfono eliminado exitosamente');
			setIsDeleteDialogOpen(false);
			setDeleteId(null);
			return true;
		} catch (error) {
			console.error('Error deleting phone number:', error);
			toast.error('Error al eliminar el cliente');
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdatePhoneNumber = async (data: { phoneNumber: string, status: PhoneNumberStatus }): Promise<boolean> => {
		if (!selectedPhoneNumber) {
			toast.error('No se ha seleccionado un número de teléfono');
			return false;
		}

		// Verificar si el nuevo número ya existe (excluyendo el actual)
		const numberExists = phoneNumbers.some(
			phone => phone.phoneNumber === data.phoneNumber && phone.id !== selectedPhoneNumber.id
		);

		if (numberExists) {
			toast.error('Este número de teléfono ya existe');
			return false;
		}

		setIsLoading(true);
		try {
			// Actualizar el estado local
			setPhoneNumbers(prev =>
				prev.map(phone =>
					phone.id === selectedPhoneNumber.id
						? {
							...phone,
							...data,
							updatedAt: new Date().toISOString()
						}
						: phone
				)
			);

			toast.success('Número de teléfono actualizado exitosamente');
			setSelectedPhoneNumber(undefined);
			setIsFormOpen(false);
			return true;
		} catch (error) {
			console.error('Error al actualizar el número de teléfono:', error);
			toast.error('Error al actualizar el número de teléfono');
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const handleCreatePhoneNumber = async (data: {
		phoneNumber: string, status: PhoneNumberStatus,
	}) => {
		setIsLoading(true);
		try {
			// Verificar si el número ya existe
			const exists = phoneNumbers.some(
				phone => phone.phoneNumber === data.phoneNumber
			);

			if (exists) {
				toast.error('Este número de teléfono ya existe');
				return false;
			}

			// Crear el número localmente primero
			const newPhoneNumber: PhoneNumber = {
				...data,
				id: Date.now(), // Usamos el timestamp como ID temporal
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			// Actualizar el estado local
			setPhoneNumbers(prev => [...prev, newPhoneNumber]);

			// Opcional: Llamar al servicio si es necesario
			// await phoneNumberService.createPhoneNumber(data);

			toast.success('Número de teléfono agregado exitosamente');
			setSelectedPhoneNumber(undefined);
			setIsFormOpen(false);
			return true;
		} catch (error) {
			console.error('Error al agregar el número de teléfono:', error);
			toast.error('Error al agregar el número de teléfono');
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const handleStartCampaign = async () => {
		if (phoneNumbers.length === 0) {
			toast.error('No hay números seleccionados para enviar mensajes');
			return;
		}

		setSendingCreateCampaign(true);

		const loadingToast = toast.loading('Enviando mensajes...');

		try {
			const response = await campaignsService.createFullCampaign({ phoneNumbers: phoneNumbers });
			console.log('respuesta de la creacion de campaigns nueva', response)
			if (response.status === 'success') {
				toast.dismiss(loadingToast);
				toast.success('Mensajes enviados exitosamente');
				setPhoneNumbers([]);
				setCreateNewCampaign(false);
				setIsStartCampaignDialogOpen(false);
				setSelectedPhoneNumber(undefined);
				setSendingCreateCampaign(false);
			} else {
				toast.dismiss(loadingToast);
				toast.error('Error al enviar mensajes');
				setSendingCreateCampaign(false);
			}
		} catch (error) {
			toast.dismiss(loadingToast);
			toast.error('Error al enviar mensajes');
			console.error('Error al enviar mensajes:', error);
		} finally {
			setSendingCreateCampaign(false);
			setIsStartCampaignDialogOpen(false);
		}
	};


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
	console.log('phoneNumbers', phoneNumbers)
	return (
		<>
			<motion.div
				initial={{ opacity: 0, x: 80 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -80 }}
				transition={{ duration: 0.5 }}
				className="max-w-4xl w-full space-y-6"
			>

				<div className="flex items-center justify-center space-x-2">
					<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCreateNewCampaign(false)} className="flex items-center text-blue-600 hover:text-blue-800 dark:text-white bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer mr-5"><ChevronLeft className="w-6.5 h-6.5" /></motion.button>
					<div className="mr-auto">
						<span className="text-2xl font-bold text-gray-900 dark:text-white">Crear Campaña</span>
						<p className="text-gray-600 dark:text-gray-400 text-sm">Inicia una nueva campaña</p>
					</div>
					<AnimatePresence>
						{phoneNumbers.length > 0 && (
							<Tooltip delayDuration={500}>
								<TooltipTrigger>
									<motion.div
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										exit={{ opacity: 0, x: -20 }}
										onClick={() => setIsStartCampaignDialogOpen(true)}
										className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center space-x-2"
									>
										<SquareCheckBig className="w-4 h-4" />
										<span>Empezar campaña</span>
									</motion.div>
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
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => setOpenFileForm(true)}
								className="bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
							>
								<Upload className="w-4 h-4" />
								<span>Subir CSV</span>
							</motion.div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Crea clientes a partir de un archivo CSV</p>
						</TooltipContent>
					</Tooltip>
				</div>
				{/* Filters */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
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
							<Tooltip delayDuration={500}>
								<TooltipTrigger disabled={isLoading}>
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
										className="p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
										title={viewMode === 'grid' ? 'Cambiar a vista de lista' : 'Cambiar a vista de cuadrícula'}
									>
										{viewMode === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
									</motion.div>
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
							{filteredPhoneNumbers.map((phone, index) => (
								<PhoneNumberCard
									key={`${index}-${statusFilter}-${searchTerm}`}
									index={`${index}-${statusFilter}-${searchTerm}`}
									viewMode={viewMode}
									phoneNumber={phone}
									onEdit={() => handleEdit(phone)}
									onDelete={() => handleDelete(phone.id)}
									isSelected={false}
									showSelectBox={false}
									onToggleSelection={() => { }}
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
								No hay clientes aun
							</h3>
							<p className="text-gray-600 dark:text-gray-400 mb-4">
								{searchTerm || statusFilter !== 'all'
									? 'Intenta cambiar los filtros de búsqueda'
									: 'Comienza agregando el primer cliente'
								}
							</p>
							{/* {(!searchTerm && statusFilter === 'all') && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openCreateForm}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Agregar Número
                </motion.button>
              )} */}
						</motion.div>
					)}
				</AnimatePresence>
				{openFileForm &&
					<PhoneNumberFileForm isOpen={openFileForm} onClose={() => setOpenFileForm(false)} onSubmit={handleCreatePhoneNumberByFile} isLoading={isLoading} />}
				{isFormOpen &&
					<PhoneNumberForm
						isOpen={isFormOpen}
						onClose={closeForm}
						onSubmit={selectedPhoneNumber ? handleUpdatePhoneNumber : handleCreatePhoneNumber}
						phoneNumber={selectedPhoneNumber}
						isLoading={isLoading}
					/>
				}
				<ConfirmDialog
					isOpen={isDeleteDialogOpen}
					onClose={() => {
						setIsDeleteDialogOpen(false);
						setDeleteId(null);
					}}
					onConfirm={handleDeletePhoneNumber}
					title="Eliminar Número"
					message="¿Estás seguro de que quieres eliminar este número de teléfono? Esta acción no se puede deshacer."
					isLoading={isLoading}
				/>
				<StartCampaignDialog
					isOpen={isStartCampaignDialogOpen}
					onClose={() => setIsStartCampaignDialogOpen(false)}
					onConfirm={handleStartCampaign}
					isLoading={isLoading}
				/>
			</motion.div>
			{sendingCreateCampaign && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center space-y-8">
					<div className="max-h-[200px] max-w-[200px]">
						<LoadingSpinner />
					</div>
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="">
						<h1 className="text-2xl font-regular text-gray-900 dark:text-gray-100">Enviando mensajes...</h1>
					</motion.div>
				</motion.div>
			)}
		</>
	);
}

function CampaignList({ campaigns, setCreateNewCampaign }: { campaigns: CampaignType[], setCreateNewCampaign: (value: boolean) => void }) {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [processingId, setProcessingId] = useState<string | null>(null);
	const userId = 23;

	const procesarDatos = async (data: any[]) => {
		
		try {
			const response = campaignsService.createFullCampaignWithSockets({userId,phoneNumbers:data});
			const result = await response;
			setProcessingId(result.processingId);

			const checkStatus = setInterval(async () => {
				if (!socket) return;

				socket.emit('verificar_estado', result.processingId, (estado: any) => {
					console.log('Estado actual:', estado);
					if (estado.status === 'completed' || estado.status === 'error') {
						clearInterval(checkStatus);
						// Manejar finalización o error
					}
				});
			}, 1000);
		} catch (error) {
			console.error('Error al iniciar el procesamiento:', error);
		}
	}



	useEffect(() => {
		const newSocket = io(VITE_SOCKET_API_URL);

		newSocket.on('connect', () => {
			console.log('Conectado con ID:', newSocket.id);
			setIsConnected(true);
			// Unirse a la sala privada
			newSocket.emit('unir_sala', userId);
		});

		// Escuchar actualizaciones de progreso
		newSocket.on('progreso', (data) => {
			console.log(`Progreso: ${data.progress}%`);
			// Actualizar UI con el progreso
		});

		setSocket(newSocket);
		return () => {
			newSocket.disconnect(); // ✅ Solo ejecuta, no retornes
		};
	}, []);

	return (
		<motion.div
			className="max-w-4xl w-full space-y-6"
		>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
				>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Campañas
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Gestiona las campañas
					</p>
				</motion.div>
				<motion.button
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="px-4 py-2 bg-blue-600 shadow-md text-white rounded-lg hover:bg-blue-700 transition-colors"
					onClick={() => setCreateNewCampaign(true)}
				>
					Nueva Campaña
				</motion.button>
				<motion.button
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className={`px-4 py-2 shadow-md rounded-lg transition-colors ${isConnected
						? 'bg-green-600 hover:bg-green-700 text-white'
						: 'bg-gray-400 cursor-not-allowed'
						}`}
					onClick={() => procesarDatos([1,2,3,4,5,6,7,8,89,98,43,4,6,5,2])}
					disabled={!isConnected}
				>
					{isConnected ? 'Enviar Mensajes' : 'Conectando...'}
				</motion.button>
			</div>
			<div className="rounded-lg  w-full">
				{campaigns && campaigns.length > 0 ?
					campaigns
						.slice() // Crea una copia del array
						.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((campaign, index) => (
							<CampaignCard
								index={index}
								key={`${index}-${campaign.id}`}
								campaign={campaign}
							/>
						)) : (
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
								No se encontraron campañas
							</h3>
							<p className="text-gray-600 dark:text-gray-400 mb-4">
								Comienza creando tu primera campaña
							</p>
							<motion.button
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="px-4 py-2 bg-blue-600 shadow-md text-white rounded-lg hover:bg-blue-700 transition-colors"
								onClick={() => setCreateNewCampaign(true)}
							>
								Nueva Campaña
							</motion.button>
						</motion.div>
					)}
			</div>
		</motion.div>
	);
}