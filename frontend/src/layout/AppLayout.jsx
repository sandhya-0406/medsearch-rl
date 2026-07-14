import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppLayout() {

    return (

        <div
            className="
                flex
                min-h-screen
            "
        >

            <Sidebar />

            <div
                className="
                    flex-1
                    flex
                    flex-col
                    overflow-hidden
                "
            >

                <Navbar />

                <main
                    className="
                        flex-1
                        overflow-y-auto
                        p-8
                    "
                >

                    <Outlet />

                </main>

            </div>

        </div>

    );

}