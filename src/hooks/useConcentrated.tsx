import React, { useEffect, useState } from 'react'
import { ConcentratedDataGet, ConcentratedDataPost } from '../types/concentrated'
import toast from 'react-hot-toast'
import { concentratedService, ConcentratedService } from '../services/concentratedService'

const concentratedEmptyState:ConcentratedDataPost = {
    name:'',
    description:'',
    isActive:true
}


export default function useConcentrated() {
    const [concentrated, setConcentrated] = useState<ConcentratedDataPost>(concentratedEmptyState)
    const [allConcentrated, setAllConcentrated] = useState<ConcentratedDataGet[]>([])
    const [idUpdating, setIdUpdating] = useState<number | null>(null)
    const [showModal, setShowModal] = useState(false)
    
    async function fetchAllConcentrated() {
        try{
            const response = await concentratedService.getAllConcentrated()
            setAllConcentrated(response)
        }catch(error){
                if(error instanceof Error){ 
                    toast.error(`Error al obtener los concentrados: ${error.message}`)
                }
            console.error('Error fetching concentrated:',error)
        }
    }   
    async function CreateConcentrated() {
        if(!concentrated.name || !concentrated.description){
            toast.error('Por favor completa todos los campos')
            return
        }
        try{
            await concentratedService.createConcentrated(concentrated)
            toast.success('Concentrado creado exitosamente')
            setConcentrated(concentratedEmptyState)
            setShowModal(false)

        }catch(error){
            if(error instanceof Error){
                toast.error(`Error al crear el concentrado: ${error.message}`)
            }
            console.error('Error creating concentrated:',error)
        }
    }
    async function fetchConcentratedById(id: string) {
        try {
            setIdUpdating(parseInt(id))
            const response = await concentratedService.getConcentratedById(parseInt(id))
            setConcentrated({
                name: response.name,
                description: response.description,
                isActive: response.isActive
            })
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error al obtener el concentrado: ${error.message}`)
            }
            console.error('Error fetching concentrated by ID:', error)
        }
    }
    async function UpdateConcentrated(){
        console.log(concentrated)
        if(!concentrated.name ||
            !concentrated.description
        ){
            toast.error('Por favor completa todos los campos')
            return
        }
        if(idUpdating===null){
            toast.error('No se ha seleccionado ningún concentrado para actualizar')
            return
        }
        try{
            await concentratedService.updateConcentrated({
                id:idUpdating,
                name:concentrated.name,
                description:concentrated.description,
                isActive:concentrated.isActive
            })
            toast.success('Concentrado actualizado exitosamente')
            setConcentrated(concentratedEmptyState)
            setShowModal(false)
            setIdUpdating(null)
            fetchAllConcentrated()
        }catch(error){
            if(error instanceof Error){
                toast.error(`Error al actualizar el concentrado: ${error.message}`)
            }
            console.error('Error updating concentrated:',error)
        }
    }
    useEffect(() => {
        fetchAllConcentrated()
    }, [])
    return {
        concentrated,
        setConcentrated,
        allConcentrated,
        setShowModal,
        showModal,
        CreateConcentrated,
        fetchConcentratedById,
        UpdateConcentrated,
        idUpdating
    }
}
