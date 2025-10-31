import { motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
export default function GroupPage() {
  return (
    <div className={twMerge("w-full flex justify-center items-start gap-5")}>
            
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
                </div>
        </div>
              
  )
}
