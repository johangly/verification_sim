import { ChevronRight } from "lucide-react";
import { CampaignType } from "../types/campaigns";
import { useNavigate } from "react-router-dom";
interface CampaignCardProps {
	campaign: CampaignType;
}

export default function CampaignCard({
	campaign,
}: CampaignCardProps) {
	const navigate = useNavigate();

	return (
		<button className="flex shadow-lg justify-between p-4 rounded-2xl w-[100%] mb-2 cursor-pointer hover:shadow-xl transition-shadow bg-white dark:bg-gray-800"
			key={campaign.id}
			onClick={() => navigate(`/campaigns/${campaign.id}`)}
		>
			<div className="flex flex-col w-[50%] items-start">
				<h2 className="text-md font-bold text-gray-900 dark:text-white">
					Campaña {campaign.id}
				</h2>
				<p>{Intl.DateTimeFormat('es-ES').format(new Date(campaign.createdAt))}</p>
			</div>
			<div className="flex w-[50%] justify-between items-center">
				<div className="flex flex-col w-full">
					<h2 className="font-bold">Enviados</h2>
					<p className="text-md font-semibold text-gray-900 dark:text-white">
						{campaign.messages.length}/{campaign.messages.length}
					</p>
				</div>
				<div className="flex flex-col w-full">
					<h2 className="font-bold">Verificados</h2>
					<p className="text-md font-semibold text-gray-900 dark:text-white">
						{
							campaign.messages.filter(
								(message) =>
									message.phoneNumber.status ===
									"verificado"
							).length
						}/{campaign.messages.length}
					</p>
				</div>
				<div className="flex flex-col w-full">
					<h2 className="font-bold">No Verificados</h2>
					<p className="text-md font-semibold text-gray-900 dark:text-white">
						{
							campaign.messages.filter(
								(message) =>
									message.phoneNumber.status ===
									"por verificar"
							).length
						}/{campaign.messages.length}
					</p>
				</div>
				<button title="Ver más">
					<ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
				</button>
			</div>
		</button>
	);
}
