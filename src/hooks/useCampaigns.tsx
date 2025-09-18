import { useEffect, useState } from "react";
import { CampaignType } from "../types/campaigns";
import { campaignsService } from "../services/campaignsService";
import { useNavigate, useParams } from "react-router-dom";

export default function useCampaigns() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [allCampaigns, setAllCampaigns] = useState<CampaignType[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [selectedCampaign, setSelectedCampaign] =
		useState<CampaignType | null>(null);
	const getAllCampaigns = async () => {
		setLoading(true);
		try {
			const campaigns = await campaignsService.getCampaigns();
			setAllCampaigns(campaigns);
		} catch (error) {
			console.error("Error fetching campaigns:", error);
		} finally {
			setLoading(false);
		}
	};

	const getCampaignById = async (id: number) => {
		setLoading(true);
		try {
			const campaign = await campaignsService.getCampaignById(
				id
			);
			setSelectedCampaign(campaign);
		} catch (error) {
			console.error("Error fetching campaign by ID:", error);
			return null;
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		getCampaignById(Number(id));
	}, [id]);

	useEffect(() => {
		getAllCampaigns();
	}, []);
	return {
		allCampaigns,
		navigate,
		selectedCampaign,
		loading,
	};
}
