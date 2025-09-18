import { ChevronRight } from "lucide-react";
import { CampaignType } from "../types/campaigns";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
interface CampaignCardProps {
	campaign: CampaignType;
}

export default function CampaignCard({
	campaign,
}: CampaignCardProps) {
	const navigate = useNavigate();

	return (
		<motion.button 
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		exit={{ opacity: 0, y: -20 }}
		transition={{ duration: 0.4,delay: Number(campaign.id) * 0.02, type: 'spring', stiffness: 100 }}
		key={campaign.id} 
		className="flex shadow-sm justify-between p-4 w-full mb-2 cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
			onClick={() => navigate(`/campaigns/${campaign.id}`)}
		>
			<div className="flex flex-col w-[50%] items-start">
				<span className="text-md font-bold text-gray-900 dark:text-white">
					Campaña {campaign.id}
				</span>
				<span className="text-sm text-gray-500 dark:text-gray-400">{Intl.DateTimeFormat('es-ES').format(new Date(campaign.createdAt))}</span>
			</div>
			<div className="flex w-[50%] justify-between items-center">
				<div className="flex flex-col w-full">
					<span className="font-semibold">Enviados</span>
					<span className="text-md text-gray-500 dark:text-gray-400">
						{campaign.messages.length}/{campaign.messages.length}
					</span>
				</div>
				<div className="flex flex-col w-full">
					<span className="font-semibold">Verificados</span>
					<span className="text-md text-gray-500 dark:text-gray-400">
						{
							campaign.messages.filter(
								(message) =>
									message.phoneNumber.status ===
									"verificado"
							).length
						}/{campaign.messages.length}
					</span>
				</div>
				<div className="flex flex-col w-full">
					<span className="font-semibold">No Verificados</span>
					<span className="text-md text-gray-500 dark:text-gray-400">
						{
							campaign.messages.filter(
								(message) =>
									message.phoneNumber.status ===
									"por verificar"
							).length
						}/{campaign.messages.length}
					</span>
				</div>
				<button title="Ver más">
					<ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
				</button>
			</div>
		</motion.button>
	);
}
