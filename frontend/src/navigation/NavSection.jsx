import NavItem from "./NavItem";

export default function NavSection({

    title,

    items

}) {

    return (

        <section className="mb-8">

            {/* Section Heading */}

            <h3
                className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.22em]
                    mb-3
                    px-2
                "
                style={{
                    color: "var(--muted)"
                }}
            >
                {title}
            </h3>

            {/* Navigation Items */}

            <div className="space-y-1">

                {items.map((item) => (

                    <NavItem

                        key={item.label}

                        icon={item.icon}

                        label={item.label}

                        to={item.to}

                    />

                ))}

            </div>

        </section>

    );

}