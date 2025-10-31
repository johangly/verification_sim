import React, {useState, useMemo} from 'react';
import {motion} from 'framer-motion';
import {Moon, Sun, Users, GalleryVerticalEnd,CardSim, BookMarked, PieChart, User2, UserStar as IconConcetrated,Group} from 'lucide-react';
import {useTheme} from '../contexts/ThemeContext';
import {Toaster} from 'react-hot-toast';
import type {MenuItem} from '../types';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({children}) => {
    const {isDark, toggleTheme} = useTheme();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const menuItems: MenuItem[] = useMemo(() => {
        const baseItems: MenuItem[] = [];

        // Clave para determinar el rol del usuario
        const userGroupId = 1;

        // Añadir ítems específicos según el grupo del usuario
        if (userGroupId === 1) { // Administrativo
            return [
                ...baseItems,
                // {
                //   id: 'overview',
                //   label: 'Vista General',
                //   icon: BarChart3,
                //   path: '/', // Ruta base
                // },
                // {
                //   id: 'reports',
                //   label: 'Reportes',
                //   icon: PieChart,
                //   path: '/reports',
                // },
                {
                    id: 'clientes',
                    label: 'Clientes',
                    icon: Users,
                    path: '/',
                    badge: 0// Ejemplo de badge para notificaciones
                },
                {
                    id: 'campañas',
                    label: 'Campañas',
                    icon: GalleryVerticalEnd,
                    path: '/campaigns',
                },
                {
                    id: 'estadisticas',
                    label: 'Estadisticas',
                    icon: PieChart,
                    path: '/estadisticas',
                    badge: 0// Ejemplo de badge para notificaciones
                },
                {
                    id: 'detailscampaigns',
                    label: 'Detalles Campañas',
                    icon: BookMarked,
                    path: '/details-campaign',

                },
                {
                    id:'concentrated',
                    label:'Concentrado',
                    icon: IconConcetrated,
                    path: '/concentrated',
                },
                {
                    id:'group',
                    label:'Grupos',
                    icon: Group,
                    path: '/groups',
                },
                {
                    id:'promoter',
                    label:'Promotores',
                    icon: CardSim,
                    path: '/promoters',
                }

                // {
                //   id: 'settings',
                //   label: 'Configuración',
                //   icon: SettingsIcon,
                //   path: '/settings',
                // }
            ];
        } else { // Docente
            return [
                ...baseItems,
                {
                    id: 'history',
                    label: 'Historial',
                    icon: PieChart,
                    path: '/history',
                },
            ];
        }

        return []; // Si no hay sesión o grupo desconocido, no mostrar ítems
    }, []);


    const handleSidebarToggle = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Sidebar
                isCollapsed={sidebarCollapsed}
                onToggle={handleSidebarToggle}
                menuItems={menuItems}
                isDark={isDark}
                user={{nombre: "Admin", grupo: {nombre_grupo: "Administrador"}}} // Pasar el usuario actual al Sidebar
            />
            <div className="flex flex-col w-full">
                <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="mx-auto px-4 sm:px-6 lg:px-6">
                        <div className="flex items-center justify-between h-16">
                            <motion.div
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                className="flex items-center space-x-3"
                            >
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <User2 className="w-6 h-6 text-white"/>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Gestión y Autenticación de Clientes
                                    </h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Sistema CRUD de clientes
                                    </p>
                                </div>
                            </motion.div>

                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                onClick={toggleTheme}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
                            </motion.button>
                        </div>
                    </div>
                </header>
                <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
            <Toaster position="bottom-right" toastOptions={{
                style: isDark ? {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                } : {
                    borderRadius: '10px',
                    background: '#fff',
                    color: '#000',
                }
            }}/>
        </div>
    );
};

{/* <div className="flex h-screen bg-gray-50">
          <Sidebar
            isCollapsed={sidebarCollapsed}
            onToggle={handleSidebarToggle}
            menuItems={menuItems}
            user={session.user}
          />
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              <AnimatePresence mode="wait">

              </AnimatePresence>
            </div>
          </main>
        </div> */
}