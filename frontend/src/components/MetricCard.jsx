export default function MetricCard({
    title,
    value
}){

    return(

        <div

            style={{
                background:"var(--card)",
                border:"1px solid var(--border)",
                boxShadow:"var(--shadow)"
            }}

            className="
            rounded-[30px]
            p-10
            hover:-translate-y-2
            transition
            duration-300
            "
        >

            <p
                style={{
                    color:"var(--subtext)"
                }}
                className="text-xl"
            >
                {title}
            </p>

            <h1 className="text-7xl font-bold mt-5">

                {value}

            </h1>

        </div>

    );

}