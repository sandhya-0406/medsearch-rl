import useExplorer from "../../../hooks/useExplorer";

export default function ImageCanvas() {

    const {

    image,

    data

} = useExplorer();

    return (

        <img

            src={ image || data.image}

            alt="Medical"

            draggable={false}

            className="w-full h-auto object-contain select-none"

        />

    );

}