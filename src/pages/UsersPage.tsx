import React from 'react'
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { CheckCircle, Mail, Plus, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser';
import DataTableComponent from './DataTableComponent';

export default function UsersPage() {
    const navigate = useNavigate();
    const { allUsers } =  useUser();

    const datoToTable = allUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.userRole.name,
        isActive: user.isActive ? 'Activo' : 'Inactivo',
    }));

    return (
        <div className={twMerge("w-full flex justify-center items-start gap-5")}>
            <div className="max-w-5xl w-full space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Usuarios
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gestiona y verifica usuarios
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-md flex gap-2 items-center"
                            onClick={() => navigate('/register-user-admin')}
                        >
                            <Plus className="w-4 h-4" />
                            Agregar Usuario
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
                                placeholder="Buscar por email de usuario..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </motion.div>
                {
                    allUsers.length > 0 ? (
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
                                    icon: Plus,
                                    title: "Rol",
                                    key: "role",
                                },
                                {
                                    icon: CheckCircle,
                                    title: "Estado",
                                    key: "isActive",
                                },
                            ]}
                            data={datoToTable} />
                    ): (
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
    );
}

