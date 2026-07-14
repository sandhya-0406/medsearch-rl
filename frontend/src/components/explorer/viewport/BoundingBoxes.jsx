import useExplorer from "../../../hooks/useExplorer";

export default function BoundingBoxes() {

    const { data } = useExplorer();

    const gt = data.target;

    return (

        <>

            <div

                className="absolute border-[3px] border-green-500 rounded-sm"

                style={{

                    left: gt.x,

                    top: gt.y,

                    width: gt.width,

                    height: gt.height

                }}

            />

            <div

                className="absolute bg-green-500 text-white text-xs px-2 py-1 rounded"

                style={{

                    left: gt.x,

                    top: gt.y - 28

                }}

            >

                Ground Truth

            </div>

        </>

    );

}