export default function SecondaryButton({
  children,
  onClick,
  className = "",
  disabled = false,
  icon: Icon
}) {

  return (

    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        gap-3

        px-8
        py-4

        rounded-2xl

        font-semibold

        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-lg

        disabled:opacity-50
        disabled:cursor-not-allowed

        ${className}
      `}
      style={{
        background: "transparent",
        border: "1px solid var(--border)",
        color: "var(--text)"
      }}
    >

      {Icon && <Icon size={18} />}

      {children}

    </button>

  );

}