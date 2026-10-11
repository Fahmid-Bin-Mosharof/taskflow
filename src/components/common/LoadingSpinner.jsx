export default function LoadingSpinner({ fullScreen = false, label = 'Loading...' }) {
    const spinner = (
        <div role="status" className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary dark:border-slate-700 dark:border-t-primary" />
            <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
        </div>
    )

    if (fullScreen) {
        return (
            <div className="flex min-h-screen items-center justify-center">{spinner}</div>
        )
    }

    return <div className="flex justify-center py-12">{spinner}</div>
}