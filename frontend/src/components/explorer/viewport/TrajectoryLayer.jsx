import useExplorer from "../../../hooks/useExplorer";

export default function TrajectoryLayer() {
const{

currentStep,

data

}=useExplorer();

const visited=

data.replay

.slice(

0,

currentStep+1

);

visited.map(frame=>

frame.searchWindow
)
    return (

        <svg

            className="absolute inset-0 w-full h-full pointer-events-none"

        >

            <polyline

                fill="none"

                stroke="#38bdf8"

                strokeWidth="4"

                strokeDasharray="10"

                points="40,60 100,120 180,180 240,210 290,260"

            />

        </svg>

    );

}