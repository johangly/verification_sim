import {useEffect, useMemo, useState} from "react";
import type {CampaignType ,CampaignMessagesStadistics,MessageStadistics} from "../types/campaigns";
import {motion} from "framer-motion";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "../components/ui/chart";
import {
    Pie,
    PieChart,
} from "recharts";
import type {TypeStatistics} from "../types/stadistics";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card.tsx";
import {
    Tooltip as UiToolTip,
    TooltipContent,
    TooltipTrigger,
} from "../components/ui/tooltip";
import {statisticsService} from "../services/stadistics";
import {campaignsService} from "../services/campaignsService";
import useCampaigns from "./useCampaigns.tsx";
import {
    RefreshCw,
    TrendingUp
} from "lucide-react";
import {PhoneNumber} from "../types/phoneNumber.ts";
import { statusIcons,statusColors } from "../utils/messageStatusIconsAndColors.tsx";



export default function useStadistics() {
    const {allCampaigns} = useCampaigns();
    const [isLoading, setIsLoading] = useState(true);
    const [generalStatistics, setGeneralStatistics] = useState<
        TypeStatistics | undefined
    >(undefined);
    const [campaigns, setCampaigns] = useState<CampaignType[] | []>(
        []
    );
    const [selectedCampaign, setSelectedCampaign] =
        useState<CampaignType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [region, setRegion] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [estado, setEstado] = useState("");
    const [vendedor, setVendedor] = useState("");
    const [modalidad, setModalidad] = useState("");
    const [
        campaignSelectedToSeeStatistics,
        setCampaignSelectedToSeeStatistics,
    ] = useState(0);
    const [dataToShowInGraphAreaOfFetch, setDataToShowInGraphAreaOfFetch] = useState<PhoneNumber[]>([])
    const [dataToShowInGraphStatus, setDataToShowInGraphStatus] =
        useState<{ name: string; value: number; color: string }[]>([]);
    const [dataToShowInGraphMessage, setDataToShowInGraphMessage] =
        useState<{ name: string; value: number, color: string }[]>([]);

    // Estado para mostrar estadisticas de los mensajes
    const [campaignMessagesStadistics, setCampaignMessagesStadistics] = useState<CampaignMessagesStadistics>({
        messageStats: [],
        totalMessages: 0
    });

    useEffect(() => {
        setCampaignSelectedToSeeStatistics(
            allCampaigns.length > 0
                ? allCampaigns[allCampaigns.length - 1].id
                : 0
        );
    }, [allCampaigns]);
    const selectFields = [
        {
            label: "MODALIDAD",
            value: modalidad,
            setValue: setModalidad,
            placeholder: "Selecciona una modalidad",
            options: [
                {value: "region1", label: "Región 1"},
                {value: "region2", label: "Región 2"},
            ],
        },
        {
            label: "REGIÓN",
            value: region,
            setValue: setRegion,
            placeholder: "Selecciona una región",
            options: [
                {value: "region1", label: "Región 1"},
                {value: "region2", label: "Región 2"},
            ],
        },
        {
            label: "CIUDAD",
            value: ciudad,
            setValue: setCiudad,
            placeholder: "Selecciona una ciudad",
            options: [
                {value: "city1", label: "Ciudad 1"},
                {value: "city2", label: "Ciudad 2"},
            ],
        },
        {
            label: "VENDEDOR",
            value: vendedor,
            setValue: setVendedor,
            placeholder: "Selecciona un vendedor",
            options: [
                {value: "seller1", label: "Vendedor 1"},
                {value: "seller2", label: "Vendedor 2"},
            ],
        },
        {
            label: "ESTADO",
            value: estado,
            setValue: setEstado,
            placeholder: "Selecciona un estado",
            options: [
                {value: "seller1", label: "Vendedor 1"},
                {value: "seller2", label: "Vendedor 2"},
            ],
        },
    ]
    const dataToShowInGraphAreaMemo = useMemo(() => {
        const grouped = dataToShowInGraphAreaOfFetch.reduce((acc, item) => {
                const date = item.createdAt;
                if (!acc[date]) acc[date] = [];
                acc[date].push(item);
                return acc;
            }, {} as Record<string, PhoneNumber[]>);

            return Object.entries(grouped).map(([date, items]) => {
                const verificado = items.filter(i => i.status === "verificado").length;
                const noVerificado = items.filter(i => i.status !== "verificado").length;
                return {
                    date,
                    verificado,
                    noVerificado
                };
            });
    }, [dataToShowInGraphAreaOfFetch]);

    useEffect(() => {
        const dataGraphByCampaignStatus = [
            {
                name: "verificado",
                value: allCampaigns
                    .filter(
                        (c) =>
                            c.id ===
                            Number(campaignSelectedToSeeStatistics)
                    )
                    .reduce(
                        (acc, c) =>
                            acc +
                            c.messages.filter(
                                (m) =>
                                    m?.phoneNumber?.status ===
                                    "verificado"
                            ).length,
                        0
                    ),
                color: "var(--estado-verificado)"
            },
            {
                name: "no verificado",
                value: allCampaigns
                    .filter(
                        (c) =>
                            c.id ===
                            Number(campaignSelectedToSeeStatistics)
                    )
                    .reduce(
                        (acc, c) =>
                            acc +
                            c.messages.filter(
                                (m) =>
                                    m?.phoneNumber?.status !==
                                    "verificado"
                            ).length,
                        0
                    ),
                color: "var(--estado-noVerificado)"
            },
        ];

        const dataGraphByCampaignMessage = [
            {
                name: "Si",
                value: allCampaigns
                    .filter(
                        (c) =>
                            c.id ===
                            Number(campaignSelectedToSeeStatistics)
                    )
                    .reduce(
                        (acc, c) =>
                            acc +
                            c.messages.filter(
                                (m) => m.responseReceived === "Si"
                            ).length,
                        0
                    ),
                color: "var(--estado-verificado)"
            },
            {
                name: "No",
                value: allCampaigns
                    .filter(
                        (c) =>
                            c.id ===
                            Number(campaignSelectedToSeeStatistics)
                    )
                    .reduce(
                        (acc, c) =>
                            acc +
                            c.messages.filter(
                                (m) => m.responseReceived !== "Si"
                            ).length,
                        0
                    ),
                color: "var(--estado-noVerificado)"

            },
        ];
        const [selectedCampaignMessages] = allCampaigns.filter(
			(c) =>
				c.id === Number(campaignSelectedToSeeStatistics)
		);
		if (selectedCampaignMessages) {
			const defaultStatuses = ['read', 'delivered', 'undelivered', 'failed'];
			const allStatuses = [...new Set(selectedCampaignMessages.messages.map(m => m.messageStatus))];
			const totalMessages = selectedCampaignMessages.messages.length;

			const messageStats: MessageStadistics[] = defaultStatuses.map(status => {
				const count = selectedCampaignMessages.messages.filter(
					m => m.messageStatus === status
				).length;

				const percentage = totalMessages > 0 ? (count / totalMessages * 100).toFixed(1) : 0;

				const labels: Record<string, string> = {
					read: 'Mensajes Leídos',
					delivered: 'Entregados',
					undelivered: 'No Entregados',
					failed: 'Fallidos'
				};

				return {
					name: status,
					label: labels[status] || status,
					value: count,
					percentage: Number(percentage),
					icon: statusIcons[status as keyof typeof statusIcons] || statusIcons.other,
					color: statusColors[status as keyof typeof statusColors] || statusColors.other,
					tooltip: labels[status] || status
				};
			});

			// Calcular "otros" estados
			const otherStatuses = allStatuses.filter(
				status => !defaultStatuses.includes(status)
			);

			if (otherStatuses.length > 0) {
				const otherCount = otherStatuses.reduce((total, status) => {
					return total + selectedCampaignMessages.messages.filter(
						m => m.messageStatus === status
					).length;
				}, 0);

				const otherPercentage = totalMessages > 0 ? (otherCount / totalMessages * 100).toFixed(1) : 0;

				messageStats.push({
					name: 'other',
					label: 'Otros',
					value: otherCount,
					percentage: Number(otherPercentage),
					tooltip: `Estados: ${otherStatuses.join(', ')}`,
					icon: statusIcons.other,
					color: statusColors.other
				});


			}
			// Agregar la tarjeta de total al final
			messageStats.push({
				name: 'total',
				label: 'Total de Mensajes',
				value: totalMessages,
				percentage: 100,
				color: 'text-blue-500',
				icon: statusIcons.total,
				tooltip: 'Total de Mensajes',
				isTotal: true // Bandera para identificar la tarjeta de total
			});

			// Ordenar por cantidad (opcional)
			messageStats.sort((a, b) => {
				if (a.isTotal) return 1; // Mover total al final
				if (b.isTotal) return -1;
				return b.value - a.value;
			});

			setCampaignMessagesStadistics({ messageStats, totalMessages });
		}
        setDataToShowInGraphMessage(dataGraphByCampaignMessage);
        setDataToShowInGraphStatus(dataGraphByCampaignStatus);
    }, [campaignSelectedToSeeStatistics, allCampaigns]);

    const totalDeClientes = useMemo(() => {
        if (!generalStatistics) return 0;
        return (
            generalStatistics.verificado +
            generalStatistics["no verificado"] +
            generalStatistics["por verificar"]
        );
    }, [generalStatistics]);

    const chartData = useMemo(
        () => [
            {
                estado: "verificado",
                cantidad: generalStatistics
                    ? generalStatistics.verificado
                    : 0,
                fill: "var(--estado-verificado)",
            },
            {
                estado: "noVerificado",
                cantidad: generalStatistics
                    ? generalStatistics["no verificado"]
                    : 0,
                fill: "var(--estado-noVerificado)",
            },
            {
                estado: "porVerificar",
                cantidad: generalStatistics
                    ? generalStatistics["por verificar"]
                    : 0,
                fill: "var(--estado-porVerificar)",
            },
        ],
        [generalStatistics]
    );

    const chartConfig = {
        cantidad: {
            label: "Visitors",
        },
        verificado: {
            label: "Verificado",
            color: "var(--estado-verificado)",
        },
        noVerificado: {
            label: "No Verificado",
            color: "var(--estado-noVerificado)",
        },
        porVerificar: {
            label: "Por Verificar",
            color: "var(--estado-porVerificar)",
        },
    } satisfies ChartConfig;

    const StatisticsCard = useMemo(
        () => (
            <Card
                className="flex flex-col bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 max-w-[400px] dark:border-gray-700">
                <CardHeader className="flex items-center justify-between pb-0">
                    <div className="flex flex-col">
                        <CardTitle>Estado de clientes</CardTitle>
                        <CardDescription>
                            Ultimos 30 dias
                        </CardDescription>
                    </div>
                    <UiToolTip delayDuration={500}>
                        <TooltipTrigger disabled={isLoading}>
                            <motion.div
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                onClick={() =>
                                    fetchGeneralStatistics("refresh")
                                }
                                className="p-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <RefreshCw
                                    className={`w-4 h-4 ${isLoading
                                        ? "animate-spin"
                                        : ""
                                    }`}
                                />
                            </motion.div>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={5}>
                            <p className="max-w-xs">
                                Vuelve a calcular los datos (ten en
                                cuenta que esto representa un consumo
                                considerable de los recursos del
                                servidor según la cantidad de datos
                                que se procesen, este cálculo se hace
                                automáticamente cada 6 horas)
                            </p>
                        </TooltipContent>
                    </UiToolTip>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0 max-w-[300px] w-full"
                    >
                        <PieChart>
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent hideLabel/>
                                }
                            />
                            <Pie
                                data={chartData}
                                dataKey="cantidad"
                                label
                                nameKey="estado"
                            />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 leading-none font-regular">
                        {generalStatistics && (
                            <p className="text-center">
                                en los ultimos 30 dias de
                                <span className="font-bold ml-1">
									{totalDeClientes}
								</span>{" "}
                                clientes, el
                                <span className="font-bold ml-1">
									{calcularPorcentajeVerificados(
                                        generalStatistics
                                    )}
								</span>{" "}
                                estan verificados
                            </p>
                        )}{" "}
                        <TrendingUp className="h-4 w-4"/>
                    </div>
                    <div className="text-muted-foreground leading-none">
                        Total de clientes los ultimos 30 dias
                    </div>
                </CardFooter>
            </Card>
        ),
        [generalStatistics, chartData, isLoading, totalDeClientes]
    );

    async function fetchDataByRangeDays() {
        setIsLoading(true);
        return await statisticsService.getStatisticsByRangeDays().then((data) => {
            setDataToShowInGraphAreaOfFetch(data as []);
            return data;
        }).finally(() => {
            setIsLoading(false);
        });
    }

    function calcularPorcentajeVerificados(
        stats: TypeStatistics
    ): string {
        const totalNumeros =
            stats.verificado +
            stats["no verificado"] +
            stats["por verificar"];

        if (totalNumeros === 0) {
            return "0.00%"; // Evita la división por cero
        }

        const porcentaje = (stats.verificado / totalNumeros) * 100;

        return `${porcentaje.toFixed(2)}%`; // Formatea a dos decimales
    }

    useEffect(() => {
        fetchDataByRangeDays();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stats, campaignsData] = await Promise.all([
                    fetchGeneralStatistics(),
                    fetchCampaigns(),
                ]);
                setCampaigns(campaignsData);
                setGeneralStatistics(stats);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    async function fetchCampaigns() {
        setIsLoading(true);
        return campaignsService
            .getCampaigns()
            .then((data) => {
                setIsLoading(false);
                return data; // Asegúrate de retornar los datos
            })
            .catch((error) => {
                console.error("Error fetching campaigns:", error);
                setIsLoading(false);
                throw error; // Propaga el error para que se maneje en el catch del Promise.all
            });
    }

    async function fetchGeneralStatistics(
        type: "cached" | "refresh" = "cached"
    ) {
        setIsLoading(true);
        return statisticsService
            .getGeneralStatistics(type)
            .then((data: TypeStatistics) => {
                setGeneralStatistics(data);
                return data; // Asegúrate de devolver los datos
            })
            .catch((error) => {
                console.error(
                    "Error fetching general statistics:",
                    error
                );
                throw error; // Propaga el error para que se maneje en el catch del Promise.all
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return {
        selectedCampaign,
        selectFields,
        setRegion,
        setCiudad,
        setVendedor,
        setCampaigns,
        setEstado,
        setSelectedCampaign,
        campaigns,
        dataToShowInGraphStatus,
        dataToShowInGraphMessage,
        setIsModalOpen,
        isModalOpen,
        StatisticsCard,
        campaignSelectedToSeeStatistics,
        setCampaignSelectedToSeeStatistics,
        generalStatistics,
        isLoading,
        setGeneralStatistics, totalDeClientes, allCampaigns, dataToShowInGraphAreaMemo,
        campaignMessagesStadistics
    }
}
