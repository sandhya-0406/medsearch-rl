import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";

import { ThemeProvider } from "./context/ThemeContext";

export default function App() {

    return (

        <ThemeProvider>

            <Layout>

                <Dashboard />

            </Layout>

        </ThemeProvider>

    );

}