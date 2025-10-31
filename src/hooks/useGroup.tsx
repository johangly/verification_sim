import { useEffect, useState } from 'react'
import { GroupDataGet, GroupDataPost } from '../types/groups'
import { ConcentratedDataGet } from '../types/concentrated'
import toast from 'react-hot-toast'
import { concentratedService } from '../services/concentratedService'
import { groupService } from '../services/groupService'

const groupEmptyState = {
    name: '',
    description: '',
    concentratedId: 0,
    isActive: true
}

export default function useGroup() {
    const [group, setGroup] = useState<GroupDataPost>(groupEmptyState)
    const [allConcentrated, setAllConcentrated] = useState<ConcentratedDataGet[]>([])
    const [allGroups, setAllGroups] = useState<GroupDataGet[]>([])
    const [showModal, setShowModal] = useState(false)
    const [idUpdating, setIdUpdating] = useState<number | null>(null)
    async function fetchAllConcentrated() {
        try {
            const response = await concentratedService.getAllConcentrated()
            setAllConcentrated(response)
        } catch(error){
                if(error instanceof Error){ 
                    toast.error(`Error al obtener los concentrados: ${error.message}`)
                }
            console.error('Error fetching concentrated:',error)
        }
    }
    async function createGroup() {
        try {
            await groupService.createGroup(group);
            setGroup(groupEmptyState);
            toast.success(`Grupo creado con éxito`);
            setShowModal(false);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error al crear el grupo: ${error.message}`);
            }
            console.error('Error creating group:', error);
        }
    }
    async function fetchAllGroups() {
        try {
            const response = await groupService.getAllGroups();
            setAllGroups(response);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error al obtener los grupos: ${error.message}`);
            }
            console.error('Error fetching groups:', error);
        }
    }
    async function fetchGroupById(id: number) {
        try {
            const response = await groupService.getGroupById(id);
            setGroup(response);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error al obtener el grupo: ${error.message}`);
            }
            console.error('Error fetching group:', error);
        }
    }
    async function updateGroup() {
        if (idUpdating === null) {
            toast.error('No se ha especificado un ID para actualizar el grupo');
            return;
        }
        try {
            await groupService.updateGroup({ id: idUpdating, ...group });
            toast.success('Grupo actualizado con éxito');
            setGroup(groupEmptyState);
            setIdUpdating(null);
            setShowModal(false);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error al actualizar el grupo: ${error.message}`);
            }
            console.error('Error updating group:', error);
        }
    }

    useEffect(() => {
        fetchAllConcentrated()
        fetchAllGroups()
    }, [])

    return {
        group,
        setGroup,
        allConcentrated,
        createGroup,
        showModal,
        setShowModal,
        fetchAllGroups,
        allGroups,
        fetchGroupById,
        updateGroup,
        idUpdating,
        setIdUpdating

    }
}
