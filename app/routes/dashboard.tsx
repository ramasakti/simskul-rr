import type { Route } from "./+types/dashboard";

import { Separator } from "../components/ui/separator";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Dashboard | SIMSKUL" },
        { name: "description", content: "Sistem Informasi Manajemen Sekolah Indonesia" },
    ];
}

// ---- Mock data for charts ----
const pieData = [
    { name: "Chrome", value: 68 },
    { name: "Safari", value: 18 },
    { name: "Firefox", value: 9 },
    { name: "Others", value: 5 },
];

const barData = [
    { name: "Jan", total: 120 },
    { name: "Feb", total: 210 },
    { name: "Mar", total: 160 },
    { name: "Apr", total: 240 },
    { name: "May", total: 190 },
];

export default function Dashboard() {
    return (
        <div className="space-y-6">
            {/* Top Cards */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {["Users", "Sessions", "Revenue", "Errors"].map((title, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">{title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{Math.floor(Math.random() * 1000)}</div>
                            <p className="text-xs text-muted-foreground">+12% from last month</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Separator />

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Traffic Sources</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
                                    {pieData.map((_, index) => (
                                        <Cell key={index} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
