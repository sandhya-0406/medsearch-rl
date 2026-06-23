import {
    Moon,
    Sun
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

export default function Navbar(){

    const {
        darkMode,
        setDarkMode
    } = useTheme();

    return(

        <nav
            style={{
                background:"var(--navbar)",
                borderBottom:"1px solid var(--border)"
            }}
            className="
            sticky
            top-0
            z-50
            backdrop-blur-xl
            px-14
            py-5
            flex
            justify-between
            items-center
            "
        >

            <h1
                className="
                text-5xl
                font-bold
                bg-gradient-to-r
                from-cyan-400
                via-blue-500
                to-violet-500
                text-transparent
                bg-clip-text
                "
            >
                MedSearch-RL
            </h1>

            <div className="flex gap-10 text-lg">

                <button>Dashboard</button>

                <button>Upload Center</button>

                <button>Agent Explorer</button>

                <button>Replay Studio</button>

                <button>Heatmaps</button>

            </div>

            <button
                onClick={() =>
                    setDarkMode(!darkMode)
                }

                className="
                w-14
                h-14
                rounded-full
                bg-slate-800
                flex
                justify-center
                items-center
                "
            >

                {

                    darkMode ?

                    <Sun size={24}/>

                    :

                    <Moon size={24}/>

                }

            </button>

        </nav>

    );

}