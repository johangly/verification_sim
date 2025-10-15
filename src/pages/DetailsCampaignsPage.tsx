import {AnimatePresence, motion} from "framer-motion";
import {Check, CheckCheck, CircleX, MailCheck, X} from "lucide-react";
import useStadistics from "../hooks/useStadistics.tsx";

const messagesStatus = {
    sent: {
        label: "Enviado",
        Icon: <Check className="w-4 h-4" />,
    },
    delivered: {
        label: "Entregado",
        Icon: <CheckCheck className="w-4 h-4" />,
    },
    undelivered: {
        label: "No Entregado",
        Icon: <CircleX className="w-4 h-4" />
    },
    read: {
        label: "Leído",
        Icon: <MailCheck className="w-4 h-4" />,
    },
    failed: {
        label: "Fallido",
        Icon: <X className="w-4 h-4" />,
    }
};

export default function DetailsCampaignsPage() {
    const {campaigns,setSelectedCampaign,setIsModalOpen,isModalOpen,selectedCampaign,isLoading}=useStadistics()
    return (
        <div>
            {campaigns && (
                <div className="max-w-4xl w-full space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Campañas
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Estas campañas se utilizan para enviar
                                mensajes de confirmación a los
                                clientes.
                            </p>
                        </motion.div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {campaigns
                            .slice() // Crea una copia del array
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((campaign) => (
                                <motion.div
                                    key={campaign.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    Campaña #{campaign.id}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(
                                                        campaign.createdAt
                                                    ).toLocaleDateString(
                                                        "es-ES",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                            <div
                                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                                                {campaign.messages.length}{" "}
                                                mensajes
                                            </div>
                                        </div>

                                        <div className="space-y-3 mt-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Plantilla usada
                                                </p>
                                                <p className="text-sm text-gray-900 dark:text-white truncate">
                                                    {campaign.templateUsed ||
                                                        "Sin plantilla"}
                                                </p>
                                            </div>
                                            {/*<div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado</p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      campaign.sentAt ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {campaign.sentAt ? 'Enviada' : 'Pendiente de envío'}
                    </span>
                  </div>
                </div> */}

                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Creada por
                                                </p>
                                                <div className="flex items-center mt-1">
														<span className="text-sm text-gray-900 dark:text-white">
															{campaign.createdByUser ===
                                                            1
                                                                ? "Admin"
                                                                : "Usuario"}
														</span>
                                                </div>
                                            </div>
                                            {campaign.sentAt && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        Enviada el
                                                    </p>
                                                    <p className="text-sm text-gray-900 dark:text-white">
                                                        {new Date(
                                                            campaign.sentAt
                                                        ).toLocaleDateString(
                                                            "es-ES",
                                                            {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between items-center">
												<span className="text-xs text-gray-500 dark:text-gray-400">
													ID: {campaign.id}
												</span>
                                            <button
                                                onClick={() => {
                                                    setSelectedCampaign(
                                                        campaign
                                                    );
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                Ver detalles
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                </div>
            )}

            {/* Modal de Detalles de Campaña */}
            <AnimatePresence>
                {isModalOpen && selectedCampaign && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.95,
                                y: 20,
                            }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{
                                duration: 0.2,
                                ease: "easeOut",
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Detalles de la campaña
                                </h3>
                                <button
                                    onClick={() =>
                                        setIsModalOpen(false)
                                    }
                                    className="p-1 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            ID
                                        </p>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {selectedCampaign.id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Plantilla usada
                                        </p>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {selectedCampaign.templateUsed ||
                                                "Sin plantilla"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Creada el
                                        </p>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {new Date(
                                                selectedCampaign.createdAt
                                            ).toLocaleDateString(
                                                "es-ES",
                                                {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                }
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Creada por
                                        </p>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {selectedCampaign.createdByUser ===
                                            1
                                                ? "Admin"
                                                : "Usuario"}
                                        </p>
                                    </div>
                                    {selectedCampaign.sentAt && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Enviada el
                                            </p>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                                {new Date(
                                                    selectedCampaign.sentAt
                                                ).toLocaleDateString(
                                                    "es-ES",
                                                    {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                        Mensajes enviados
                                    </h4>
                                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                                        {selectedCampaign.messages
                                            ?.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedCampaign.messages.map(
                                                    (
                                                        message,
                                                        index
                                                    ) => (
                                                        <div
                                                            key={
                                                                index
                                                            }
                                                            className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700"
                                                        >
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {
                                                                    message
                                                                        .phoneNumber
                                                                        .phoneNumber
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center mt-1">
																	<span className="font-semibold mr-2">
																		Estado
																		del
																		cliente:
																	</span>
                                                                {
                                                                    message
                                                                        .phoneNumber
                                                                        .status
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center mt-1">
																	<span className="font-semibold mr-2">
																		Estado
																		del
																		mensaje:
																	</span>
                                                                {messagesStatus[
                                                                    message.messageStatus as keyof typeof messagesStatus
                                                                    ] ? (
                                                                    <>
																			<span className="mr-1">
																				{
                                                                                    messagesStatus[
                                                                                        message.messageStatus as keyof typeof messagesStatus
                                                                                        ]
                                                                                        .Icon
                                                                                }
																			</span>
                                                                        {
                                                                            messagesStatus[
                                                                                message.messageStatus as keyof typeof messagesStatus
                                                                                ]
                                                                                .label
                                                                        }
                                                                    </>
                                                                ) : (
                                                                    <span className="text-gray-500 dark:text-gray-400">
																			Estado
																			no
																			encontrado
																		</span>
                                                                )}
                                                            </p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center mt-1">
																	<span className="font-semibold mr-2">
																		Respuesta:
																	</span>
                                                                {message.responseReceived}
                                                            </p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center mt-1">
																	<span className="font-semibold mr-2">
																		Hora de respuesta:
																	</span>
                                                                {message.respondedAt}
                                                            </p>

                                                            {message.sentAt && (
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                    Enviado:{" "}
                                                                    {new Date(
                                                                        message.sentAt
                                                                    ).toLocaleString(
                                                                        "es-ES"
                                                                    )}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                No hay mensajes
                                                registrados para esta
                                                campaña.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() =>
                                        setIsModalOpen(false)
                                    }
                                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    disabled={isLoading}
                                >
                                    Cerrar
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
