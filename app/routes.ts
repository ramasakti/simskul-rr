import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    layout("routes/dashboard-layout.tsx", [
        route("/dashboard", "routes/dashboard.tsx"),
        route("/users", "routes/users/page.tsx")
    ])
] satisfies RouteConfig;
