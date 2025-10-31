import React, { Dispatch, ReactNode, SetStateAction } from 'react'

interface ModalProps {
    showModal: boolean
    setModal: Dispatch<SetStateAction<boolean>>
    children: ReactNode
    title: string
    /** Si true aplica un desenfoque al backdrop (fondo). Por defecto true */
    backdropBlur?: boolean
}

export default function Modal({ showModal, setModal, children, title, backdropBlur = true }: ModalProps) {
    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 transition-opacity ${backdropBlur ? 'backdrop-blur-sm' : ''} ${showModal ? 'opacity-90 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setModal(false)}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-sm shadow-lg p-6 min-w-lg min-h-96 max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
                    <button
                        onClick={() => setModal(false)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                        &times;
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}
