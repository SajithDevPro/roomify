import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('visualizer/:id', './routes/visualizer.$id.tsx')    // visualizer kiyal new created file ek damme

] satisfies RouteConfig;

