export interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    path: string;
    badge?: number;
  }

  export interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    isDark: boolean;
    menuItems: MenuItem[];
    user: User;
  }

  export interface User {
    nombre: string;
    grupo: {
      nombre_grupo: string;
    };
  }

//   export interface User {
//     id_empleado: number;
//     nombre: string;
//     apellido: string;
//     usuario: string;
//     rol: string;
//     activo: boolean;
//   }
