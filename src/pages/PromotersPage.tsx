import React from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Check, Mail, Plus, Search, SquareCheckBig, User } from 'lucide-react';
import Modal from '../components/Modal';
import { twMerge } from 'tailwind-merge';
import usePromoters from '../hooks/usePromoters';
import PromoterForm from '../components/PromoterForm';
import DataTableComponent from './DataTableComponent';

export default function PromotersPage() {
    const {
        showModal,
        setShowModal,
        promoter,
        setPromoter,
        CreatePromoter,
        fetchPromoterById, allGroups,
        UpdatePromoter,
        idUpdating,
        setIdUpdating,
        promoterList
    } = usePromoters();

    const dataToTable = promoterList.map((promoter) => ({
        id: promoter.id,
        name: promoter.name.slice(0, 20),
        email: promoter.email.slice(0, 30),
        isActive: promoter.isActive,
        code: promoter.code,
        concentratedId: promoter.grupo.name.slice(0, 20)
    }));

    return (
        <div className={twMerge("w-full flex justify-center items-start gap-5")}>
            <AnimatePresence>
                {showModal && (
                    <Modal
                        showModal={showModal}
                        title="Registrar Promotor"
                        setModal={setShowModal}
                    >
                        <PromoterForm
                            promoter={promoter}
                            setPromoter={setPromoter}
                            idUpdating={idUpdating}
                            CreatePromoter={CreatePromoter}
                            UpdatePromoter={UpdatePromoter}
                            groupList={allGroups}
                        />
                    </Modal>
                )}
            </AnimatePresence>
            <div className="max-w-5xl w-full space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Promotores
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gestiona y verifica promotores
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-md flex gap-2 items-center"
                            onClick={() => setShowModal(true)}
                        >
                            <Plus className="w-4 h-4" />
                            Agregar Promotor
                        </button>
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
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Buscar por código de promotor..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </motion.div>
                {allGroups.length > 0 ? (
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
                                    icon: Mail,
                                    title: "Email",
                                    key: "email",
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
                                                fetchPromoterById(row.id),
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
        </div>
    )
}
