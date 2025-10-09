
interface DetailsStatesProps {
    dataToShowInGraphStatus: {
        name: string
        value: number
        color: string
    }[]
    COLORS: string[]
}

export const DetailsStates = ({dataToShowInGraphStatus, COLORS}: DetailsStatesProps) => {
    return (
        <div
            className=" flex flex-col bg-white dark:bg-gray-800 rounded-xl flex-1 min-w-[400px] p-4 shadow-sm border border-gray-200 dark:border-gray-700 w-full">
            {dataToShowInGraphStatus.length >
            0 ? (
                <>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Detalle de Estados
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {dataToShowInGraphStatus.map(
                            (data, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
                                >
                                    <div
                                        className="w-12 h-12 flex items-center justify-center rounded-full mb-2"
                                        style={{
                                            backgroundColor:
                                                COLORS[
                                                index %
                                                COLORS.length
                                                    ],
                                        }}
                                    >
																<span className="text-white font-bold text-lg">
																	{
                                                                        data.value
                                                                    }
																</span>
                                    </div>
                                    <span className="text-gray-900 dark:text-white font-medium">
																{
                                                                    data.name
                                                                }
															</span>
                                </div>
                            )
                        )}
                        <div
                            key={3}
                            className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
                        >
                            <div
                                className="w-12 h-12 flex items-center justify-center rounded-full mb-2"
                                style={{
                                    backgroundColor:
                                        COLORS[
                                        3 %
                                        COLORS.length
                                            ],
                                }}
                            >
														<span className="text-white font-bold text-lg">
															+{20}
														</span>
                            </div>
                            <span className="text-gray-900 dark:text-white font-medium">
														Mes anterior
													</span>
                        </div>
                    </div>
                    <div
                        className="rounded-lg p-6 bg-green-500/10 text-green-700 border border-green-200 dark:border-green-700">
                        <p>
                            Total de números:{" "}
                            {dataToShowInGraphStatus.reduce(
                                (acc, curr) =>
                                    acc +
                                    curr.value,
                                0
                            )}
                        </p>
                    </div>
                </>
            ) : (
                <p className="text-gray-600 dark:text-gray-400">
                    No hay datos disponibles para
                    mostrar.
                </p>
            )}
        </div>
    );
};
