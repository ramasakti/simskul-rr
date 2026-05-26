interface NavbarItem {
    id_navbar: number;
    menu_id: number;
    role_id: number;
    menu: {
        id_menu: number;
        type: number;
        name: string;
        route: string;
        parent_id: number | null;
        section_id: number | null;
        order: number;
        section: {
            id_section: number;
            name: string;
            icon: string;
            order: number;
        };
        children?: {
            id_menu: number;
            type: number;
            name: string;
            route: string;
            parent_id: number | null;
            section_id: number | null;
            order: number;
        }[];
    };
}

interface SidebarChild {
    title: string;
    href: string;
}

interface SidebarItem {
    title: string;
    href?: string;
    iconSvg?: string;   // untuk standalone (type 0)
    children?: SidebarChild[];
}

interface SidebarGroup {
    group: string;
    groupIconSvg?: string; // icon SVG dari section
    items: SidebarItem[];
}