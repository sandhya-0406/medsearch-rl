import useExplorer from "../../../hooks/useExplorer";

export default function SearchWindow() {

    const{currentFrame} = useExplorer();

    const box = currentFrame.searchWindow;

    return (

        <div

            className="absolute border-[3px] border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,.6)] rounded-sm pointer-events-none"

            style={{

                left: box.x,

                top: box.y,

                width: box.width,

                height: box.height

            }}

        />

    );

}