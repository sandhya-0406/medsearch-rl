import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import AppLayout from "../layout/AppLayout";

import Dashboard from "../pages/Dashboard";
import UploadCenter from "../pages/UploadCenter";
import Analytics from "../pages/Analytics";
// import AgentExplorer from "../pages/AgentExplorer";
import ReplayStudio from "../pages/ReplayStudio";
// import Classification from "../pages/Classification";
// import Heatmaps from "../pages/Heatmaps";
// import Comparison from "../pages/Comparison";
// import Explainability from "../pages/Explainability";
// import Playground from "../pages/Playground";
// import Settings from "../pages/Settings";

export default function Router() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    element={<AppLayout />}
                >

                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/upload"
                        element={<UploadCenter />}
                    />

                    <Route
                        path="/analytics"
                        element={<Analytics />}
                    />

                    <Route
                        path="/analytics/:domain"
                        element={<Analytics />}
                    />

                    {/* <Route
                        path="/explorer"
                        element={<AgentExplorer />}
                    /> */}

                    <Route
                        path="/replay"
                        element={<ReplayStudio />}
                    />

                    {/*<Route
                        path="/classification"
                        element={<Classification />}
                    />

                    <Route
                        path="/heatmaps"
                        element={<Heatmaps />}
                    />

                    <Route
                        path="/comparison"
                        element={<Comparison />}
                    />

                    <Route
                        path="/explainability"
                        element={<Explainability />}
                    />

                    <Route
                        path="/playground"
                        element={<Playground />}
                    />

                    <Route
                        path="/settings"
                        element={<Settings />}
                    /> */}

                </Route>

            </Routes>

        </BrowserRouter>

    );

}