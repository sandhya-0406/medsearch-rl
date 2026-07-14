export default function GlassCard({
    children,
    className = "",
    ...props
}) {
    return (
        <div
            {...props}
            className={`
                elevated-card
                rounded-3xl
                p-8
                ${className}
            `}
        >
            {children}
        </div>
    );
}