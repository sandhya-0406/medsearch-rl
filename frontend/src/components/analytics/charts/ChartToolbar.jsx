import DownloadButtons from "./DownloadButtons";
import TimeRangeSelector from "./TimeRangeSelector";

export default function ChartToolbar({ range, setRange, onCSV, onJSON, onPNG }) {
    return (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <TimeRangeSelector value={range} onChange={setRange} />
            <DownloadButtons onCSV={onCSV} onJSON={onJSON} onPNG={onPNG} />
        </div>
    );
}