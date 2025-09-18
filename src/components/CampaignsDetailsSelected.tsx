import useCampaigns from "../hooks/useCampaigns";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import { useEffect, useState } from "react";
import { CampaignsMessageType } from "../types/campaigns";
import { PhoneNumberCard } from "./PhoneNumberCard";
import { twMerge } from "tailwind-merge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../components/ui/select"
import { FunnelX } from "lucide-react";


interface buttonsProps {
	label: string;
	value:
	| "enviados"
	| "verificado"
	| "por verificar"
	| "no verificado";
}

const buttons: buttonsProps[] = [
	{ label: "Enviados", value: "enviados" },
	{ label: "Verificados", value: "verificado" },
	{ label: "Por verificar", value: "por verificar" },
	{ label: "No verificados", value: "no verificado" },
];

export default function CampaignsDetailsSelected() {
	const { selectedCampaign, loading } = useCampaigns();
	console.log(selectedCampaign);
	const [buttonSelected, setButtonSelected] = useState<
		"no verificado" | "verificado" | "por verificar" | "enviados"
	>("enviados");
	const [region, setRegion] = useState("");
	const [ciudad, setCiudad] = useState("");
	const [vendedor, setVendedor] = useState("");
	const [phonesByStatus, setPhonesByStatus] = useState<
		CampaignsMessageType[]
	>([]);

	useEffect(() => {
		if (!selectedCampaign) return;
		if (buttonSelected === "enviados")
			return setPhonesByStatus(selectedCampaign.messages);
		const dataFiltered = selectedCampaign.messages.filter(
			(msg) => msg.phoneNumber.status === buttonSelected
		);
		setPhonesByStatus(dataFiltered);
	}, [buttonSelected, selectedCampaign]);

	if (loading) return <LoadingSpinner />;

	return (
		<div
			className={twMerge(
				"w-full flex justify-center items-center gap-5"
			)}
		>
			{!selectedCampaign ? (
				<p>No se encontró la campaña.</p>
			) : (
				<div className="max-w-4xl w-full">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
						>
							<span className="text-2xl font-bold text-gray-900 dark:text-white">
								Campaña {selectedCampaign.id}
							</span>
						</motion.div>
						<div className="flex space-x-3 space-y-3 items-start justify-start gap-3">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.2, delay: 0.1 }}
								className='flex flex-col justify-center items-start space-y-2 w-full'>
								<label className="text-sm font-medium text-gray-900 dark:text-white opacity-70">REGIÓN</label>
								<Select value={region} onValueChange={setRegion}>
									<SelectTrigger style={{ padding: '.5rem 1rem', height: '42px' }} className="w-full max-w-[200px] min-w-[200px] border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-[1rem] font-inherit text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
										<SelectValue placeholder="Selecciona una región" />
									</SelectTrigger>
									<SelectContent className='bg-white dark:bg-gray-700'>
										<SelectItem className={twMerge(region === 'region1' && 'bg-blue-600 text-white')} value="region1">Región 1</SelectItem>
										<SelectItem className={twMerge(region === 'region2' && 'bg-blue-600 text-white')} value="region2">Región 2</SelectItem>
									</SelectContent>
								</Select>
							</motion.div>

							{/* Select de Ciudad */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.2, delay: 0.3 }}
								className='flex flex-col justify-center items-start space-y-2 w-full'>
								<label className="text-sm font-medium text-gray-900 dark:text-white opacity-70">CIUDAD</label>
								<Select value={ciudad} onValueChange={setCiudad}>
									<SelectTrigger style={{ padding: '.5rem 1rem', height: '42px' }} className="w-full max-w-[200px] min-w-[200px] border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-[1rem] font-inherit text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
										<SelectValue placeholder="Selecciona una ciudad" />
									</SelectTrigger>
									<SelectContent className='bg-white dark:bg-gray-700'>
										<SelectItem className={twMerge(ciudad === 'city1' && 'bg-blue-600 text-white')} value="city1">Ciudad 1</SelectItem>
										<SelectItem className={twMerge(ciudad === 'city2' && 'bg-blue-600 text-white')} value="city2">Ciudad 2</SelectItem>
									</SelectContent>
								</Select>
							</motion.div>

							{/* Select de Vendedor */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.2, delay: 0.5 }}
								className='flex flex-col justify-center items-start space-y-2 w-full'>
								<label className="text-sm font-medium text-gray-900 dark:text-white opacity-70">VENDEDOR</label>
								<Select value={vendedor} onValueChange={setVendedor}>
									<SelectTrigger style={{ padding: '.5rem 1rem', height: '42px' }} className="w-full max-w-[200px] min-w-[200px] border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-[1rem] font-inherit text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
										<SelectValue placeholder="Selecciona un vendedor" />
									</SelectTrigger>
									<SelectContent className='bg-white dark:bg-gray-700'>
										<SelectItem className={twMerge(vendedor === 'seller1' && 'bg-blue-600 text-white')} value="seller1">Vendedor 1</SelectItem>
										<SelectItem className={twMerge(vendedor === 'seller2' && 'bg-blue-600 text-white')} value="seller2">Vendedor 2</SelectItem>
									</SelectContent>
								</Select>
							</motion.div>
						</div>
					</div>
					<hr style={{margin: '0'}}/>
					<div className="flex flex-col items-center mt-4">
						<div className="flex justify-between gap-4 w-full">
							{buttons.map((btn,index) => (
								<motion.button
									key={index}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.2, delay: index * 0.1 }}
									type="button"
									className={twMerge(`px-4 flex flex-wrap min-w-[100px] flex-1 gap-8 items-center h-18 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-colors`,
										buttonSelected === btn.value
										&& "bg-blue-600 text-white",
									)}
									title={btn.label.toLowerCase()}
									onClick={() =>
										setButtonSelected(btn.value)
									}
								>
									<p className="text-2xl font-bold">
										{btn.value === "enviados"
											? selectedCampaign
												.messages.length
											: btn.value ===
												"verificado"
												? selectedCampaign.messages.filter(
													(msg) =>
														msg
															.phoneNumber
															.status ===
														"verificado"
												).length
												: btn.value ===
													"por verificar"
													? selectedCampaign.messages.filter(
														(msg) =>
															msg
																.phoneNumber
																.status ===
															"por verificar"
													).length
													: selectedCampaign.messages.filter(
														(msg) =>
															msg
																.phoneNumber
																.status ===
															"no verificado"
													).length}
									</p>{" "}
									{btn.label}
								</motion.button>
							))}
						</div>
						<div className="w-full flex flex-col gap-3 mt-4">
							{phonesByStatus.length === 0 ? (
								<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.2 }}
								className="flex items-center justify-center gap-2 mt-10">
									<p className="text-center text-gray-500 dark:text-gray-400">
									No hay números de teléfono en este
									estado.
									</p>
									<FunnelX className="inline w-6 h-6 text-gray-500 dark:text-gray-400" />
								</motion.div>
							) : (
								phonesByStatus.map((msg) => (
									<PhoneNumberCard
										phoneNumber={{
											...msg.phoneNumber,
											createdAt: msg.sentAt,
											updatedAt: msg.sentAt,
										}}
										key={msg.id}
										onEdit={() => { }}
										onDelete={() => { }}
										isSelected={false}
										onToggleSelection={() => { }}
										viewMode="list"
									/>
								))
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
