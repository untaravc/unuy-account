export type LogType = {
    info (message: string, traceId?: string): void
    warn (message: string, traceId?: string): void
    error (message: string, traceId?: string): void
}