import { Outlet, Link, useLocation, useNavigate, redirect } from "react-router";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../components/ui/avatar"
import {
    LogOutIcon,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { useAuth } from "../context/AuthContext";
import { userContext } from "../context/UserContext";
import type { Route } from "./+types/dashboard-layout";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const middleware: Route.MiddlewareFunction[] = [
    async ({ request, context }) => {
        const cookie = request.headers.get("cookie") ?? "";

        const res = await fetch(`${API_BASE_URL}/me`, {
            headers: {
                cookie,
                Accept: "application/json",
            },
        });

        if (!res.ok) throw redirect("/");

        const result = await res.json();
        if (!result.success) throw redirect("/");

        context.set(userContext, result.payload);
    },
];

export async function loader({ context }: Route.LoaderArgs) {
    const user = context.get(userContext);
    return { user };
}

function NavItem({ to, label }: { to: string; label: string }) {
    const { pathname } = useLocation();
    const active = pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
        >
            {label}
        </Link>
    );
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
    const { user } = loaderData;
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen grid grid-cols-[240px_1fr]">
            <aside className="border-r bg-background p-4">
                <div className="mb-6">
                    <h1 className="text-xl font-semibold tracking-tight">My Dashboard</h1>
                </div>

                <nav className="space-y-1">
                    <NavItem to="/dashboard" label="Dashboard" />
                    <NavItem to="/sessions" label="Sessions" />
                    <NavItem to="/users" label="Users" />
                    <NavItem to="/settings" label="Settings" />
                </nav>
            </aside>

            <div className="flex flex-col">
                <header className="h-14 border-b flex items-center justify-between px-6">
                    <div className="text-sm text-muted-foreground">Welcome back 👋</div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage
                                        src="https://github.com/shadcn.png"
                                        alt="@shadcn"
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>

                                <div className="leading-tight">
                                    <p className="text-sm font-medium">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground">{user?.role?.role}</p>
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
                            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                                <LogOutIcon />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                <main className="p-6 bg-muted/40 min-h-[calc(100vh-56px)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}