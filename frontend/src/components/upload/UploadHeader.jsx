import {
    Cpu,
    Brain,
    CheckCircle2
} from "lucide-react";

export default function UploadHeader() {

    return (

        <div
            className="
                elevated-card
                rounded-[28px]
                p-8
            "
        >

            <p
                className="
                    uppercase
                    text-sm
                    font-semibold
                    tracking-[0.2em]
                    text-cyan-400
                    mb-4
                "
            >
                Upload Center
            </p>

            <h1
                className="
                    text-5xl
                    font-black
                "
            >
                Medical Image Analysis
            </h1>

            <p
                className="
                    mt-5
                    max-w-3xl
                    text-lg
                    leading-8
                "
                style={{
                    color:"var(--muted)"
                }}
            >
                Upload Brain MRI or Endoscopic images to launch
                the MedSearch-RL pipeline for localization,
                classification and explainable visual search.
            </p>

            <div
                className="
                    flex
                    flex-wrap
                    gap-4
                    mt-8
                "
            >

                <StatusCard
                    icon={<CheckCircle2 size={18}/>}
                    title="System Ready"
                    color="#10b981"
                />

                <StatusCard
                    icon={<Cpu size={18}/>}
                    title="GPU Available"
                    color="#22d3ee"
                />

                <StatusCard
                    icon={<Brain size={18}/>}
                    title="3 Expert Agents"
                    color="#8b5cf6"
                />

            </div>

        </div>

    );

}

function StatusCard({

    icon,
    title,
    color

}){

    return(

        <div
            className="
                flex
                items-center
                gap-3

                px-5
                py-3

                rounded-xl
            "
            style={{
                background:"var(--surface-2)"
            }}
        >

            <div
                style={{
                    color
                }}
            >

                {icon}

            </div>

            <span
                className="
                    font-medium
                "
            >

                {title}

            </span>

        </div>

    )

}