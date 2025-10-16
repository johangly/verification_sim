import React from "react";
import { motion, AnimatePresence } from "framer-motion";
// import {
//     X,
//     Check,
//     CheckCheck,
//     CircleX,
//     MailCheck
// } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { twMerge } from "tailwind-merge";
import StadisticsPieComponent from "../components/StadisticsPieComponent.tsx";
import useStadistics from "../hooks/useStadistics.tsx";
import StadisticsAreaChartComponent from "../components/StadisticsAreaChartComponent.tsx";
import { campaignsService } from "../services/campaignsService.ts";

// const messagesStatus = {
//     sent: {
//         label: "Enviado",
//         Icon: <Check className="w-4 h-4"/>,
//     },
//     delivered: {
//         label: "Entregado",
//         Icon: <CheckCheck className="w-4 h-4"/>,
//     },
//     undelivered: {
//         label: "No Entregado",
//         Icon: <CircleX className="w-4 h-4"/>
//     },
//     read: {
//         label: "Leído",
//         Icon: <MailCheck className="w-4 h-4"/>,
//     },
//     failed: {
//         label: "Fallido",
//         Icon: <X className="w-4 h-4"/>,
//     }
// };
// const COLORS = ["#0088FE", "#ce1212", "#FFBB28", "#FF8042"];

export const StadisticsPage: React.FC = () => {

    const {
        // selectedCampaign,
        selectFields,
        generalStatistics,
        isLoading, totalDeClientes,
        // setSelectedCampaign,
        // campaigns,
        dataToShowInGraphStatus,
        dataToShowInGraphMessage,
        // setIsModalOpen,
        // isModalOpen,
        campaignSelectedToSeeStatistics,
        setCampaignSelectedToSeeStatistics,
        StatisticsCard,
        allCampaigns,
        dataToShowInGraphAreaMemo,
        campaignMessagesStadistics
    } = useStadistics()

    return (
        <div className="w-full flex justify-center items-start gap-5">
            <div className="max-w-7xl w-full space-y-6">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex justify-start items-center gap-8">
                            <div className="flex flex-col w-full max-w-[250px]">
                                <p className="font-semibold mb-2">
                                    Seleccionar Campaña
                                </p>
                                <Select
                                    value={campaignSelectedToSeeStatistics.toString()}
                                    onValueChange={(value) =>
                                        setCampaignSelectedToSeeStatistics(
                                            parseInt(value)
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        style={{
                                            padding: ".5rem 1rem",
                                            minHeight: "42px",
                                        }}
                                        className="w-full xl:max-w-[250px] border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-[1rem] font-inherit text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <SelectValue placeholder="Selecciona una región" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-gray-700">
                                        {allCampaigns.map((campaign) => (
                                            <SelectItem
                                                className={twMerge(
                                                    campaignSelectedToSeeStatistics ===
                                                    campaign.id &&
                                                    "bg-blue-600 text-white"
                                                )}
                                                key={campaign.id}
                                                value={campaign.id.toString()}
                                            >
                                                Campaña {campaign.id}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-fit">
                                <h2 className="text-blue-600 font-bold">
                                    ULTIMA CAMPAÑA:
                                </h2>
                                <p>
                                    {allCampaigns.length > 0
                                        ? `${new Date(
                                            allCampaigns[
                                                allCampaigns.length -
                                                1
                                            ].createdAt
                                        ).toLocaleDateString()}`
                                        : "No hay campañas disponibles"}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    if (campaignSelectedToSeeStatistics) {
                                        campaignsService.exportCampaign(campaignSelectedToSeeStatistics)
                                            .catch(error => {
                                                console.error('Error al exportar la campaña:', error);
                                                // Aquí podrías mostrar un toast o alerta de error
                                                alert('Error al exportar la campaña: ' + error.message);
                                            });
                                    } else {
                                        alert('Por favor selecciona una campaña para exportar');
                                    }
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 ml-4"
                                disabled={!campaignSelectedToSeeStatistics}
                            >
                                Exportar a CSV
                            </button>
                        </div>
                        <div
                            className="w-full grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 my-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                            {selectFields.map((field, idx) => (
                                <motion.div
                                    key={field.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2, delay: 0.1 * (idx + 1) }}
                                    className="flex flex-col justify-center items-start space-y-2 w-full"
                                >
                                    <label className="text-sm font-medium text-gray-900 dark:text-white opacity-70">
                                        {field.label}
                                    </label>
                                    <Select value={field.value} onValueChange={field.setValue}>
                                        <SelectTrigger
                                            style={{ padding: ".5rem 1rem", minHeight: "42px" }}
                                            className="w-full xl:max-w-[250px] border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-[1rem] font-inherit text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <SelectValue placeholder={field.placeholder} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-700">
                                            {field.options.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    className={twMerge(field.value === option.value && "bg-blue-600 text-white")}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mb-8 ">
                        <AnimatePresence>
                            {campaignMessagesStadistics
                                && campaignMessagesStadistics.messageStats
                                && campaignMessagesStadistics.messageStats.map((stat, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: 80 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={stat.label}
                                        exit={{ opacity: 0, x: -80 }}
                                        transition={{ duration: 0.2, delay: index * 0.2, ease: 'easeIn', stiffness: 100 }}
                                        className={twMerge(`
												relative flex flex-col items-center p-4 rounded-lg border 
												transition-all duration-200 hover:shadow-md shadow-sm`,
                                            stat.isTotal ? 'justify-center border-blue-200 bg-blue-600/50 dark:bg-blue-900 dark:bg-opacity-10 dark:border-blue-800' : `${stat.color.replace('text', 'border')} bg-white dark:bg-gray-800`)}
                                    >
                                        {stat.isTotal ? (
                                            // Contenido de la tarjeta de total
                                            <>
                                                <div
                                                    className="flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400"
                                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <span
                                                    className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400">
                                                    {stat.value}
                                                </span>
                                                <span className="text-sm text-center text-blue-600 dark:text-blue-400">
                                                    {stat.label}
                                                </span>
                                            </>
                                        ) : (
                                            // Contenido de las tarjetas normales
                                            <>
                                                <div className={`mb-2 p-2 rounded-full ${stat.color} bg-opacity-10`}>
                                                    {stat.icon}
                                                </div>
                                                <span className={`text-2xl font-bold text-center ${stat.color}`}>
                                                    {stat.value}
                                                </span>
                                                <span
                                                    className="text-sm text-center text-gray-600 dark:text-gray-300 mb-1">
                                                    {stat.label}
                                                </span>
                                                <div
                                                    className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-2">
                                                    <div
                                                        className={`h-1.5 rounded-full ${stat.color.replace('text', 'bg')}`}
                                                        style={{ width: `${stat.percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-center text-gray-500 mt-1">
                                                    {stat.percentage}%
                                                </span>
                                            </>
                                        )}

                                        {/* Tooltip para "Otros" */}
                                        {stat.tooltip && (
                                            <div className="absolute top-2 right-2">
                                                <div className="relative group">
                                                    <button
                                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                            viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </button>
                                                    <div
                                                        className="absolute z-10 hidden group-hover:block w-48 p-2 mt-1 text-xs text-white bg-gray-800 rounded shadow-lg right-0">
                                                        {stat.tooltip}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                        </AnimatePresence>
                    </div>
                    <div
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-x-6 space-y-6 mb-6">
                        {campaignSelectedToSeeStatistics !== 0 ? (
                            <div
                                className="w-full flex flex-col items-start justify-beetwen flex-wrap space-x-6 space-y-6">
                                <div className="flex space-x-6 w-full flex-wrap">
                                    <div className="w-full flex-1 min-w-[500px]">
                                        <StadisticsPieComponent
                                            title={
                                                `Estadisticas de la campaña #${campaignSelectedToSeeStatistics}`
                                            }
                                            subtitle={'Estados de los Teléfonos'}
                                            data={dataToShowInGraphStatus}
                                            labelPassed={'verificados'}
                                            footerText={'VERIFICADOS / NO VERIFICADOS'}
                                            subFooterText={'Detalle de Estados'}
                                        />
                                    </div>
                                    <div className="w-full flex-1 min-w-[500px]">
                                        <StadisticsPieComponent title={
                                            `Estadisticas de la campaña #${campaignSelectedToSeeStatistics}`
                                        } subtitle={'Respuestas a los mensajes'} data={dataToShowInGraphMessage}
                                            labelPassed={'Si'} footerText={'SI / NO'}
                                            subFooterText={
                                                'Detalle de respuestas a los mensajes'
                                            } />
                                    </div>
                                </div>
                                {/* <DetailsStates dataToShowInGraphStatus={dataToShowInGraphStatus} COLORS={COLORS} /> */}
                            </div>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400">
                                Selecciona una campaña para ver sus
                                estadísticas
                            </p>
                        )}
                    </div>
                </div>
                {/* Content */}
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center items-center py-12"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
                            />
                        </motion.div>
                    ) : (
                        generalStatistics &&
                        totalDeClientes && (
                            <div className="flex w-full space-x-6 flex-wrap-reverse items-start">
                                <div
                                    className="w-fit min-w-[403.46px] flex flex-col justify-beetwen flex-wrap h-full space-y-9.5">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                Estadisticas de los ultimos 30 dias
                                            </h1>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Estadisticas de los clientes registrados y validados
                                            </p>
                                        </motion.div>
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        {StatisticsCard}
                                    </motion.div>
                                </div>
                                <StadisticsAreaChartComponent
                                    title={'Grafico de area'}
                                    description={'Datos sobre telefonos verificados y no verificados en rango de tiempo'}
                                    labelPassed={'verificado'}
                                    data={dataToShowInGraphAreaMemo}
                                    colors={{ verificado: "#22c55e", noVerificado: "#ef4444" }}
                                />
                            </div>
                        )
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
