import { twMerge } from "tailwind-merge";
import { User, Check, Info } from "lucide-react";
import { motion } from "framer-motion";
import { ConcentratedDataPost } from "../types/concentrated";
import { Checkbox } from "./ui/checkbox";

interface ConcentratedPageProps {
  concentrated: ConcentratedDataPost;
  setConcentrated: React.Dispatch<React.SetStateAction<ConcentratedDataPost>>;
  idUpdating: number | null;
  CreateConcentrated: () => Promise<void>;
  UpdateConcentrated: () => Promise<void>;
}

export default function ConcentratedForm({
  concentrated,
  setConcentrated,
  idUpdating,
  CreateConcentrated,
  UpdateConcentrated,
}: ConcentratedPageProps) {
  const inputs = [
    {
      label: "Nombre",
      type: "text",
      value: concentrated.name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setConcentrated({ ...concentrated, name: e.target.value }),
      placeholder: "Ingrese el nombre del concentrado",
    },
    {
      label: "Descripción",
      type: "text",
      value: concentrated.description,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setConcentrated({ ...concentrated, description: e.target.value }),
      placeholder: "Ingrese la descripción del concentrado",
    },
    {
      label: "Estado",
      type: "checkbox",
      checked: concentrated.isActive,
      onChange: (checked: boolean) =>
        setConcentrated({ ...concentrated, isActive: checked }),
    },
  ];
  return (
    <div className={twMerge("w-full flex justify-center items-start gap-5")}>
      <div className="max-w-4xl w-full space-y-6">
        <form
          action="POST"
          onSubmit={(e) => {
            e.preventDefault();
            if (idUpdating !== null) {
              UpdateConcentrated();
            } else {
              CreateConcentrated();
            }
          }}
        >
          {inputs.map((input, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col"
            >
              <label className="mb-2 font-medium text-gray-700 dark:text-gray-300 mt-4">
                {input.label === "Nombre" && (
                  <User className="inline-block mr-2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                )}
                {input.label === "Descripción" && (
                  <Info className="inline-block mr-2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                )}
                {input.type === "checkbox" ? null : input.label}
              </label>
              {input.type === "checkbox" ? (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    className="w-5 h-5"
                    id="new-concentrated-status"
                    checked={input.checked}
                    onCheckedChange={(checked) => input.onChange(checked)}
                  />
                  <label
                    htmlFor="new-concentrated-status"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Estado
                  </label>
                </div>
              ) : (
                <input
                  type={input.type}
                  value={input.value}
                  onChange={input.onChange}
                  placeholder={input.placeholder}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </motion.div>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full mt-4"
          >
            Registrar
          </motion.button>
        </form>
      </div>
    </div>
  );
}
