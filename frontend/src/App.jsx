import Router from "./routes/routes";

import { ThemeProvider } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";
import { UploadProvider } from "./context/UploadContext";
import { ExplorerProvider } from "./context/ExplorerContext";

export default function App() {

    return (

        <ThemeProvider>

            <SidebarProvider>

                <UploadProvider>

                    <ExplorerProvider>

                        <Router />

                    </ExplorerProvider>

                </UploadProvider>

            </SidebarProvider>

        </ThemeProvider>

    );

}