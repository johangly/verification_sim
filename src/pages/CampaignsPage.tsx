import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import CampaignCard from "../components/CampaignCard";
import useCampaigns from "../hooks/useCampaigns";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CampaignsPage() {
	const { campaigns, navigate,loading } = useCampaigns();
		if(loading) return <LoadingSpinner />;

	return (
		<div
			className={twMerge(
				"w-full flex justify-center items-start gap-5"
			)}
		>
			<div className="max-w-6xl w-[90%] space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
							Campañas
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Gestiona las campañas
						</p>
					</motion.div>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="px-4 py-2 bg-blue-600 shadow-md text-white rounded-lg hover:bg-blue-700 transition-colors"
						onClick={() => {
							navigate("/");
						}}
					>
						Nueva Campaña
					</motion.button>
				</div>
				<div className="dark:bg-gray-800 rounded-lg  w-full">
						{campaigns.map((campaign) => (
							<CampaignCard
								key={campaign.id}
								campaign={campaign}
							/>
						))}
				</div>
			</div>
		</div>
	);
}
