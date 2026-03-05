import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [

    // Home Page
    index("routes/home.tsx"),

    // Pricing Page
    route("pricing", "routes/pricing.tsx"),

    // Community Page
    route("community", "routes/community.tsx"),

    // Visualizer
    route("visualizer/:id", "routes/visualizer.$id.tsx"),

] satisfies RouteConfig;

