import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, Check, Info, LayoutGrid, Plus, Search, SquareCheckBig, User } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import useGroup from '../hooks/useGroup'
import Modal from '../components/Modal'
import GroupForm from '../components/GroupForm'
import DataTableComponent from './DataTableComponent'
export default function GroupPage() {
    const {
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
    } = useGroup()
    const dataToTable = allGroups.map((group) => ({
        id: group.id,
        name: group.name.slice(0,20),
        description: group.description.slice(0,20),
        isActive: group.isActive,
        code: group.code,
        concentratedId: group.concentrado.name,
    }))
    return (
        <div className={twMerge("w-full flex justify-center items-start gap-5")}>
            <AnimatePresence>
                {showModal && (
                    <Modal
                        showModal={showModal}
                        title="Registrar Grupo"
                        setModal={setShowModal}
                    >
                        <GroupForm
                            group={group}
                            setGroup={setGroup}
                            idUpdating={idUpdating}
                            concentratedList={allConcentrated}
                            createGroup={createGroup}
                            updateGroup={updateGroup}
                        />
                    </Modal>
                )}
            </AnimatePresence>
            <div className='max-w-5xl w-full space-y-6'>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Grupos
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gestiona y verifica grupos
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex gap-2 items-center"
                            onClick={() => setShowModal(true)}
                        ><Plus className="w-4 h-4" />Agregar Grupo</button>
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Buscar por código de grupo..."

                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </motion.div>
                {allConcentrated.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <DataTableComponent
                        headers={[
                            
                            {
                                icon: User,
                                title: "Nombre",
                                key: "name",
                            },
                            {
                                icon: Info,
                                title: "Descripción",
                                key: "description",
                            },
                            {
                                icon: Check,
                                title: "Estado",
                                key: "isActive",
                                render: (value) =>
                                    value ? (
                                        <span
                                            className={`px-4 py-2 rounded-full text-md bg-green-50 text-green-600 `}
                                        >
                                            Activo
                                        </span>
                                    ) : (
                                        <span
                                            className={`px-4 py-2 rounded-full text-md bg-red-50 text-red-600 `}
                                        >
                                            Inactivo
                                        </span>
                                    ),
                            },
                            {
                                icon: Calendar,
                                title: "Codigo",
                                key: "code",
                            },
                            {
                                icon: User,
                                title: "Concentrado",
                                key: "concentratedId",
                            },
                            {
                                icon: SquareCheckBig,
                                title: "Acciones",
                                key: "actions",
                                cellClassName: "text-center",
                                render: (_, row) => (
                                    <button
                                        className="bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                                        onClick={() => {
                                            fetchGroupById(row.id),
                                                setShowModal(true);
                                        }}
                                    >
                                        Editar
                                    </button>
                                ),
                            },
                        ]}
                        data={dataToTable}
                    />
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12"
                >
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No se encontraron Concentrados
                    </h3>
                </motion.div>
            )}
            </div>
            
        </div >

    )
}
