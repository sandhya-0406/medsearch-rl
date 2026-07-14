import { FileJson2, FileDown, ImageDown } from "lucide-react";

export default function DownloadButtons({ onCSV, onJSON, onPNG }) {
    return (
        <div className="flex items-center gap-2">
            <IconButton label="CSV" icon={FileDown} onClick={onCSV} />
            <IconButton label="JSON" icon={FileJson2} onClick={onJSON} />
            <IconButton label="PNG" icon={ImageDown} onClick={onPNG} />
        </div>
    );
}

function IconButton({ label, icon: Icon, onClick }) {
    return (
        <button
            type="button"
            title={`Download ${label}`}
            onClick={onClick}
            className="group inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5 hover:shadow-lg"
        >
            <Icon size={16} className="transition group-hover:text-cyan-400" />
            <span>{label}</span>
        </button>
    );
}