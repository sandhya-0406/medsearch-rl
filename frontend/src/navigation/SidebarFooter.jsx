import {
    Settings,
    Cpu,
    Circle
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function SidebarFooter() {

    return (

        <div
            className="
                border-t
                pt-5
                mt-5
            "
            style={{
                borderColor: "var(--border)"
            }}
        >

            {/* Workspace Card */}

            <div
                className="
                    rounded-2xl
                    p-4
                    mb-4
                "
                style={{
                    background:
                        "linear-gradient(180deg,var(--surface-2),var(--surface))",
                    border:
                        "1px solid var(--border)"
                }}
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            w-12
                            h-12
                            rounded-xl

                            flex
                            items-center
                            justify-center

                            text-white
                            font-bold
                            text-lg
                        "
                        style={{
                            background:
                                "linear-gradient(135deg,var(--primary),var(--secondary))"
                        }}
                    >

                        M

                    </div>

                    <div>

                        <h4
                            className="
                                font-semibold
                            "
                        >
                            MedSearch-RL
                        </h4>

                        <p
                            className="
                                text-xs
                            "
                            style={{
                                color: "var(--muted)"
                            }}
                        >
                            Research Platform
                        </p>

                    </div>

                </div>

                {/* Divider */}

                <div
                    className="my-4"
                    style={{
                        borderTop:
                            "1px solid var(--border)"
                    }}
                />

                {/* Version */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <Circle
                            size={10}
                            fill="#10b981"
                            strokeWidth={0}
                        />

                        <span
                            className="
                                text-xs
                            "
                            style={{
                                color:"var(--muted)"
                            }}
                        >
                            Stable Build
                        </span>

                    </div>

                    <span
                        className="
                            text-xs
                            font-semibold
                        "
                    >
                        v1.0
                    </span>

                </div>

                {/* GPU */}

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        mt-3
                    "
                >

                    <Cpu
                        size={14}
                        className="text-cyan-400"
                    />

                    <span
                        className="
                            text-xs
                        "
                        style={{
                            color:"var(--muted)"
                        }}
                    >
                        AI Workspace Ready
                    </span>

                </div>

            </div>

            {/* Settings */}

            <NavLink

                to="/settings"

                className={({isActive})=>

                    `

                    flex

                    items-center

                    gap-3

                    px-4

                    py-3

                    rounded-xl

                    transition-all

                    ${
                        isActive

                        ?

                        "bg-cyan-500/10 text-cyan-400"

                        :

                        "hover:bg-white/5"
                    }

                    `

                }

            >

                <Settings size={18}/>

                <span>

                    Settings

                </span>

            </NavLink>

        </div>

    );

}