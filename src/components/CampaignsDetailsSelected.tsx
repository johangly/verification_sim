import { twMerge } from "tailwind-merge";
import useCampaigns from "../hooks/useCampaigns";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import { useEffect, useState } from "react";
import { CampaignsMessageType } from "../types/campaigns";
import { PhoneNumberCard } from "./PhoneNumberCard";

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
				<div className="max-w-6xl w-[90%] space-y-6">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
						>
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
								Campaña {selectedCampaign.id}
							</h1>
						</motion.div>
						<div className="flex gap-4 items-center">
							<div className="flex flex-col w-full">
								<h2 className="text-black font-semibold text-xl mb-2">
									REGIÓN
								</h2>
								<select
									title="region"
									className="shadow-md bg-white rounded-sm p-2 w-42"
								>
									<option value="region1">
										Región 1
									</option>
									<option value="region2">
										Región 2
									</option>
								</select>
							</div>
							<div className="flex flex-col w-full">
								<h2 className="text-black font-semibold text-xl mb-2">
									CIUDAD
								</h2>
								<select
									title="city"
									className="shadow-md bg-white rounded-sm p-2 w-42"
								>
									<option value="city1">
										Ciudad 1
									</option>
									<option value="city2">
										Ciudad 2
									</option>
								</select>
							</div>
							<div className="flex flex-col w-full">
								<h2 className="text-black font-semibold text-xl mb-2">
									VENDEDOR
								</h2>
								<select
									title="seller"
									className="shadow-md bg-white rounded-sm p-2 w-42"
								>
									<option value="seller1">
										Vendedor 1
									</option>
									<option value="seller2">
										Vendedor 2
									</option>
								</select>
							</div>
						</div>
					</div>
					<hr />
					<div className="flex flex-col items-center mt-4">
						<div className="flex justify-between gap-4 w-full">
							{buttons.map((btn) => (
								<button
									type="button"
									className={`px-4 shadow-md flex w-48 gap-8 items-center h-12 py-2 ${
										buttonSelected === btn.value
											? "bg-blue-700 text-white "
											: "bg-transparent text-black"
									} rounded-lg hover:bg-gray-200 transition-colors`}
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
								</button>
							))}
						</div>
						<div className="w-full flex flex-col gap-4 mt-8">
							{phonesByStatus.length === 0 ? (
								<p>
									No hay números de teléfono en este
									estado.
								</p>
							) : (
								phonesByStatus.map((msg) => (
									<PhoneNumberCard
										phoneNumber={{
											...msg.phoneNumber,
											createdAt: msg.sentAt,
											updatedAt: msg.sentAt,
										}}
										key={msg.id}
										onEdit={() => {}}
										onDelete={() => {}}
										isSelected={false}
										onToggleSelection={() => {}}
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
