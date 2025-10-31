import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import {
  Check,
  LayoutGrid,
  Plus,
  Search,
  Info,
  Calendar,
  User,
  SquareCheckBig,
} from "lucide-react";
import useConcentrated from "../hooks/useConcentrated";
import Modal from "../components/Modal";
import ConcentratedForm from "../components/ConcentratedForm";
import DataTableComponent from "./DataTableComponent";

export default function ConcentratedPage() {
  const {
    allConcentrated,
    idUpdating,
    showModal,
    setShowModal,
    fetchConcentratedById,
    concentrated,
    setConcentrated,
    CreateConcentrated,
    UpdateConcentrated,
  } = useConcentrated();
  const dataToTable = allConcentrated.map((concentrated) => ({
    id: concentrated.id,
    name: concentrated.name,
    description: concentrated.description,
    isActive: concentrated.isActive,
    code: concentrated.code,
  }));
  return (
    <div className={twMerge("w-full flex justify-center items-start gap-5")}>
      <AnimatePresence>
        {showModal && (
          <Modal
            showModal={showModal}
            title="Registrar Concentrado"
            setModal={setShowModal}
          >
            <ConcentratedForm
              concentrated={concentrated}
              setConcentrated={setConcentrated}
              idUpdating={idUpdating}
              CreateConcentrated={CreateConcentrated}
              UpdateConcentrated={UpdateConcentrated}
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
              Concentrados
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestiona y verifica concentrados
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
              Agregar Concentrado
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
                placeholder="Buscar por código de concentrado..."
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
                  icon: LayoutGrid,
                  title: "id",
                  key: "id",
                  cellClassName:
                    "font-mono text-md text-gray-700 dark:text-gray-300",
                  render: (value) => (
                    <span
                      className={`px-4 py-2 rounded-full text-md bg-blue-50 text-blue-600 `}
                    >
                      {value}
                    </span>
                  ),
                },
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
                  icon: SquareCheckBig,
                  title: "Acciones",
                  key: "actions",
                  cellClassName: "text-center",
                  render: (_, row) => (
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                      onClick={() => {
                        fetchConcentratedById(row.id.toString()),
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
  );
}
