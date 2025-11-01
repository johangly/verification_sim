import { Dispatch, SetStateAction } from 'react'
import { PromoterDataPost } from '../types/promoter';
import { twMerge } from 'tailwind-merge';
import { Checkbox } from "./ui/checkbox";
import { Info, User, Group} from 'lucide-react';
import { GroupDataGet } from '../types/groups';

interface PromoterFormProps {
    promoter: PromoterDataPost;
    setPromoter: Dispatch<SetStateAction<PromoterDataPost>>;
    idUpdating: number | null;
    CreatePromoter: () => Promise<void>;
    UpdatePromoter: () => Promise<void>;
    groupList: GroupDataGet[]
}

export default function PromoterForm({
    promoter,
    setPromoter,
    idUpdating,
    CreatePromoter,
    UpdatePromoter
    , groupList
}: PromoterFormProps) {
    const inputs = [
        { label: 'Nombre', placeholder: 'Ingrese el nombre del promotor', type: 'text', value: promoter.name, onChange: (e) => setPromoter({ ...promoter, name: e.target.value }) },
        { label: 'Grupo', type: 'select', value: promoter.groupId, onChange: (e) => setPromoter({ ...promoter, groupId: Number(e.target.value) }) },
        { label: 'Email', placeholder: 'Ingrese el email del promotor', type: 'text', value: promoter.email, onChange: (e) => setPromoter({ ...promoter, email: e.target.value }) },
        {
            label: "Estado",
            type: "checkbox",
            checked: promoter.isActive,
            onChange: (checked: boolean) =>
                setPromoter({ ...promoter, isActive: checked }),
        }]
    return (
        <div className={twMerge("w-full flex justify-center items-start gap-5")}>
            <div className="max-w-4xl w-full space-y-6">
                <form
                    action="POST"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (idUpdating !== null) {
                            UpdatePromoter();
                        } else {
                            CreatePromoter();
                        }
                    }}
                >
                    {inputs.map((input, index) => (
                        <div className="mb-4" key={index}>
                            <label htmlFor={input.label} className="mb-4 font-medium text-gray-700 dark:text-gray-300 mt-4" title={input.label} id={input.label}>
                                {input.label === "Nombre" && (
                                    <User className="inline-block mr-2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                )}
                                {input.label === "Descripción" && (
                                    <Info className="inline-block mr-2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                )}
                                {input.label === "Grupo" && (
                                    <Group className="inline-block mr-2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                )}
                                {input.type === "checkbox" ? null : input.label}
                            </label>
                            {input.type === 'select' ? (
                                <select
                                    value={input.value}
                                    onChange={input.onChange}
                                    name={input.label}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                                >
                                    <option value="">Seleccione un grupo</option>
                                    {groupList.map((group) => (
                                        <option key={group.id} value={group.id}>
                                            {group.name}
                                        </option>
                                    ))}
                                </select>
                            ) : input.type === "checkbox" ? (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        className="w-5 h-5"
                                        id="new-group-status"
                                        checked={input.checked}
                                        onCheckedChange={(checked) =>
                                            (input.onChange as (checked: boolean) => void)(checked === true)
                                        }
                                    />
                                    <label
                                        htmlFor="new-group-status"
                                        className="font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Estado
                                    </label>
                                </div>
                            ) : (
                                <input
                                    type={input.type}
                                    value={input.value}
                                    name={input.label}
                                    onChange={input.onChange}
                                    placeholder={input.placeholder}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                                />
                            )}
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full"
                    >
                        {idUpdating !== null ? 'Actualizar Grupo' : 'Crear Grupo'}
                    </button>
                </form>
            </div>

        </div>
    )
}
