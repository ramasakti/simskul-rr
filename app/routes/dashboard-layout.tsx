import { Outlet, Link, useLocation, useNavigate, redirect } from "react-router";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../components/ui/avatar";
import {
    LogOutIcon,
    ChevronRight
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
    SidebarTrigger,
    SidebarHeader,
    SidebarFooter,
} from "../components/ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../components/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Toaster } from "../components/ui/sonner";
import { useAuth } from "../context/AuthContext";
import { userContext } from "../context/UserContext";
import { Package } from "lucide-react";
import type { Route } from "./+types/dashboard-layout";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function transformNavbar(data: NavbarItem[]): SidebarGroup[] {
    const groups: Map<number, SidebarGroup> = new Map();
    const standaloneGroup: SidebarGroup = { group: "", items: [] };

    // Sort by section order, then menu order
    const sorted = [...data].sort((a, b) => {
        const sectionDiff = a.menu.section.order - b.menu.section.order;
        return sectionDiff !== 0 ? sectionDiff : a.menu.order - b.menu.order;
    });

    for (const item of sorted) {
        const { menu } = item;

        // type 0: standalone menu (no section)
        if (menu.type === 0) {
            standaloneGroup.items.push({
                title: menu.name,
                href: menu.route || "/dashboard",
            });
            continue;
        }

        const sectionId = menu.section_id!;

        if (!groups.has(sectionId)) {
            groups.set(sectionId, {
                group: menu.section.name,
                groupIconSvg: menu.section.icon,
                items: [],
            });
        }

        const group = groups.get(sectionId)!;

        // type 1: regular item in a section
        if (menu.type === 1) {
            group.items.push({
                title: menu.name,
                href: menu.route,
            });
        }

        // type 2: parent with children (route kosong, children akan diisi nanti)
        // Jika type 2 punya route → treat as child; jika tidak → parent collapsible
        if (menu.type === 2) {
            // Cek apakah sudah ada parent untuk ini (berdasarkan nama atau logika bisnis kamu)
            // Untuk sekarang, treat sebagai item biasa dengan href opsional
            group.items.push({
                title: menu.name,
                href: menu.route || undefined,
            });
        }
    }

    const result: SidebarGroup[] = [];

    // Standalone (Dashboard, Users, dll) masuk duluan
    if (standaloneGroup.items.length > 0) {
        result.push(standaloneGroup);
    }

    // Section groups
    for (const group of groups.values()) {
        result.push(group);
    }

    return result;
}

export const middleware: Route.MiddlewareFunction[] = [
    async ({ request, context }) => {
        const cookie = request.headers.get("cookie") ?? "";

        const res = await fetch(`${API_BASE_URL}/me`, {
            headers: { cookie, Accept: "application/json" },
        });

        if (!res.ok) throw redirect("/");

        const result = await res.json();
        if (!result.success) throw redirect("/");

        context.set(userContext, result.payload);
    },
];

export async function loader({ context, request }: Route.LoaderArgs) {
    const user = context.get(userContext);
    const roleId = user?.role.id_role;

    // Forward cookie dari browser → API, sama seperti fetch /me di middleware
    const cookie = request.headers.get("cookie") ?? "";

    const res = await fetch(`${API_BASE_URL}/navbar/${roleId}`, {
        headers: {
            Accept: "application/json",
            cookie,
        },
    });

    if (!res.ok) return { user, sidebar: [] };

    const result = await res.json();
    const navbarData: NavbarItem[] = Array.isArray(result) ? result : result.payload ?? [];
    const sidebar = transformNavbar(navbarData);

    return { user, sidebar };
}

function SvgIcon({ svg, className }: { svg: string; className?: string }) {
    // Inject className ke dalam SVG string agar ukuran bisa dikontrol
    const withClass = svg.replace(
        /<svg /,
        `<svg class="${className ?? "h-4 w-4"}" `
    );
    return <span dangerouslySetInnerHTML={{ __html: withClass }} />;
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
    const { user, sidebar } = loaderData;
    const { pathname: url } = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                {/* SIDEBAR */}
                <Sidebar>
                    <SidebarHeader className="px-4 py-3">
                        <h1 className="text-lg font-semibold">SIMSKUL</h1>
                    </SidebarHeader>

                    <SidebarContent>
                        {sidebar.map((group, i) => {
                            const isOpen = group.items.some((item) =>
                                item.href ? url.startsWith(item.href) : false
                            );

                            // standalone group (Dashboard, Users)
                            if (!group.group) {
                                return (
                                    <SidebarGroup key={i}>
                                        <SidebarMenu>
                                            {group.items.map((item) => {
                                                const active = item.href
                                                    ? url.startsWith(item.href)
                                                    : false;

                                                return (
                                                    <SidebarMenuItem key={item.title}>
                                                        <SidebarMenuButton isActive={active} >
                                                            <Link
                                                                to={item.href ?? "#"}
                                                                className="flex w-full items-center gap-2"
                                                            >
                                                                {item.iconSvg && (
                                                                    <SvgIcon
                                                                        svg={item.iconSvg}
                                                                        className="h-4 w-4"
                                                                    />
                                                                )}

                                                                {item.title}
                                                            </Link>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                );
                                            })}
                                        </SidebarMenu>
                                    </SidebarGroup>
                                );
                            }

                            // section collapsible
                            return (
                                <Collapsible
                                    key={i}
                                    defaultOpen={isOpen}
                                    // className="group/collapsible"
                                >
                                    <SidebarGroup className="px-2 py-0">
                                        <SidebarGroupLabel className="text-gray-900 text-sm">
                                            <CollapsibleTrigger className="flex w-full items-center gap-2">
                                                {group.groupIconSvg && (
                                                    <SvgIcon
                                                        svg={group.groupIconSvg}
                                                        className="h-4 w-4"
                                                    />
                                                )}

                                                <span>{group.group}</span>

                                                <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                            </CollapsibleTrigger>
                                        </SidebarGroupLabel>

                                        <CollapsibleContent>
                                            <SidebarMenu className="ml-4 border-l border-sidebar-border">
                                                {group.items.map((item) => {
                                                    const active = item.href
                                                        ? url.startsWith(item.href)
                                                        : false;

                                                    return (
                                                        <SidebarMenuItem key={item.title} className="ml-2">
                                                            <SidebarMenuButton isActive={active} >
                                                                <Link
                                                                    to={item.href ?? "#"}
                                                                    className="flex w-full items-center gap-2"
                                                                >
                                                                    {item.title}
                                                                </Link>
                                                            </SidebarMenuButton>
                                                        </SidebarMenuItem>
                                                    );
                                                })}
                                            </SidebarMenu>
                                        </CollapsibleContent>
                                    </SidebarGroup>
                                </Collapsible>
                            );
                        })}
                    </SidebarContent>

                    <SidebarFooter />
                </Sidebar>

                {/* MAIN AREA */}
                <div className="flex flex-1 flex-col">
                    <header className="h-14 border-b flex items-center justify-between px-6">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div className="flex items-center gap-3 cursor-pointer">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="leading-tight">
                                        <p className="text-sm font-medium">{user?.name}</p>
                                        <p className="text-xs text-muted-foreground">{user?.role.role}</p>
                                    </div>
                                </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Biodata</DropdownMenuItem>
                                </DropdownMenuGroup>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <LogOutIcon className="h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </header>

                    <main className="p-6 bg-muted/40 flex-1">
                        <Toaster richColors position="top-center" />
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}