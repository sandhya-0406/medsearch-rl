export default function SectionHeader({
    title,
    subtitle
}) {
    return (
        <div className="mb-8">

            <h2 className="text-4xl font-black">
                {title}
            </h2>

            {subtitle && (
                <p
                    className="mt-2 text-lg"
                    style={{
                        color:"var(--muted)"
                    }}
                >
                    {subtitle}
                </p>
            )}

        </div>
    );
}