export default function TablePagination({ page, totalPages, onPrev, onNext, totalRows, visibleRows }) {
    return (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
                Showing {visibleRows} of {totalRows} rows
            </span>

            <div className="flex items-center gap-2">
                <button type="button" className="rounded-lg border border-border px-3 py-2" onClick={onPrev}>
                    Prev
                </button>

                <span>
                    Page {page} / {totalPages}
                </span>

                <button type="button" className="rounded-lg border border-border px-3 py-2" onClick={onNext}>
                    Next
                </button>
            </div>
        </div>
    );
}