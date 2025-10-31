import { useEffect, useState } from 'react'
import { GroupDataPost } from '../types/groups'
import { ConcentratedDataGet } from '../types/concentrated'
import toast from 'react-hot-toast'
import { concentratedService } from '../services/concentratedService'

const groupEmptyState = {
    name: '',
    description: '',
    concentratedId: 0,
    isActive: true
}

export default function useGroup() {
    const [group, setGroup] = useState<GroupDataPost>(groupEmptyState)
    const [allConcentrated, setAllConcentrated] = useState<ConcentratedDataGet[]>([])

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
    useEffect(() => {
        fetchAllConcentrated()
    }, [])

    return {
        group,
        setGroup,
        allConcentrated
    }
}
