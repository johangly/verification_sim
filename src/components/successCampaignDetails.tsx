import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

interface CampaignDetailsModalProps {
    data: any;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export function CampaignDetailsModal({
    data,
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
}: CampaignDetailsModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Iniciar Nueva Campaña
              </h3>
            </div>
            
            <p className="text-gray-700 dark:text-gray-200 mb-6">
              ¿Estás seguro de que deseas iniciar una nueva campaña? Se enviarán 
              mensajes a todos los clientes en la campaña.
            </p>
            <p className="text-gray-500 text-sm dark:text-gray-400 mb-6"><strong className="font-medium">Advertencia:</strong> solo se puede enviar un mensaje de verificacion por cada cliente, se omitira el envio de mensaje de verificacion a los clientes que ya recibieron el mensaje de verificacion.</p>
            
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Iniciar'
                )}
              </motion.button>
            </div> */}

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className={`p-2 rounded-full ${data.success && !data.error
                                        ? 'bg-green-100 dark:bg-green-900/30'
                                        : 'bg-red-100 dark:bg-red-900/30'
                                    }`}>
                                    {data.success && !data.error ? (
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {data.success && !data.error
                                        ? 'Campaña Creada Exitosamente'
                                        : 'Error al Crear la Campaña'}
                                </h3>
                            </div>

                            {data.message && (
                                <p className="text-gray-700 dark:text-gray-200">
                                    {data.message}
                                </p>
                            )}

                            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">ID de Campaña</p>
                                        <p className="font-medium">{data.campaignId || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total de Números</p>
                                        <p className="font-medium">{data.stats?.total || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Éxitos</p>
                                        <p className="font-medium text-green-600 dark:text-green-400">
                                            {data.stats?.success || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Errores</p>
                                        <p className={`font-medium ${data.stats?.errors > 0
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {data.stats?.errors || 0}
                                        </p>
                                    </div>
                                </div>

                                {data.invalidNumbers && data.invalidNumbers.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Números inválidos:</p>
                                        <div className="max-h-20 overflow-y-auto text-sm bg-white dark:bg-gray-800 p-2 rounded">
                                            {data.invalidNumbers.join(', ')}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={onClose}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}