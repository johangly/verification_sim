import { useEffect, useState } from 'react'
import { PromoterDataGet, PromoterDataPost } from '../types/promoter';
import { promoterService } from '../services/promoterService';
import toast from 'react-hot-toast';
import { groupService } from '../services/groupService';
import { GroupDataGet } from '../types/groups';

const promoterEmptyState: PromoterDataPost = {
    name: '',
    email: '',
    groupId: 0,
    isActive: true
};

export default function usePromoters() {
    const [showModal, setShowModal] = useState(false);
    const [promoter, setPromoter] = useState(promoterEmptyState);
    const [allGroups, setAllGroups] = useState<GroupDataGet[]>([])
    const [idUpdating, setIdUpdating] = useState<number | null>(null);
    const [promoterList, setPromoterList] = useState<PromoterDataGet[]>([]);

    async function FetchAllPromoters() {
        try {
            const promoters = await promoterService.getAllPromoters();
            setPromoterList(promoters);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error al obtener los promotores: ${error.message}`);
            }
            console.error('Error fetching promoters:', error);
        }
    }
    async function FetchAllGroups() {
        try {
            const groups = await groupService.getAllGroups();
            setAllGroups(groups);

        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error al obtener los grupos: ${error.message}`);
            }
            console.error('Error fetching groups:', error);
        }
    }
    async function fetchPromoterById(id: number) {
        setIdUpdating(id);
        try {
            const response = await promoterService.getPromoterById(id);
            setPromoter({
                name: response.name,
                email: response.email,
                groupId: response.groupId,
                isActive: response.isActive
            });
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error al obtener el promotor: ${error.message}`);
            }
            console.error('Error fetching promoter by id:', error);
        }
    }

    async function CreatePromoter() {
        if(!promoter.name || !promoter.email || promoter.groupId===0){
            toast.error(`Por favor completa todos los campos`);
            return;
        }
        try {
            await promoterService.createPromoter(promoter);
            setPromoter(promoterEmptyState);
            toast.success(`Promotor creado con éxito`);
            setShowModal(false);
            FetchAllPromoters();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error al crear el promotor: ${error.message}`);
            }
            console.error('Error creating promoter:', error);
        }
    }
    async function UpdatePromoter() {
        if (idUpdating === null) {
            toast.error('ID de promotor no válido para actualización');
            return;
        }
            if(!promoter.name || !promoter.email || promoter.groupId===0){
            toast.error(`Por favor completa todos los campos`);
            return;
        }
        try {
            await promoterService.updatePromoter({
                id: idUpdating,
                ...promoter
            });
            setPromoter(promoterEmptyState);
            toast.success(`Promotor actualizado con éxito`);
            setShowModal(false);
            setIdUpdating(null);
            FetchAllPromoters();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error al actualizar el promotor: ${error.message}`);
            }
            console.error('Error updating promoter:', error);
        }
    }
    useEffect(() => {
        FetchAllGroups();
        FetchAllPromoters();
    }, []);

    return {
        showModal,
        setShowModal,
        promoter,
        setPromoter,
        CreatePromoter,
        fetchPromoterById,
        allGroups,
        idUpdating,
        setIdUpdating,
        UpdatePromoter,
        promoterList,
    }
}
