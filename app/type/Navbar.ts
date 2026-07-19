interface NavbarItem {
    id_navbar: number;
    id_menu: number;
    menu_name: string;
    menu_route: string;
    section_id: number | null;
    section_name: string | null;
    section_icon: string | null;
    role: string;
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