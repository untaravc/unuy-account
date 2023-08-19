import {createLogger, format, transports} from "winston";
import {LogType} from "./entity";

let logTraceId: string = ''
const winstonLogger = createLogger({
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp(),
                format.printf(({timestamp, level, message, metadata}) => {
                    return `[${timestamp}] ${metadata.traceId} ${level}: ${message}`
                })
            )
        }),
        new transports.File({
            dirname: 'logs',
            filename: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}_api.log`,
            format: format.combine(format.json())
        })
    ],
    format: format.combine(format.metadata(), format.timestamp())
})

export const getLogTraceId = () => logTraceId
export const setLogTraceId = (id: string) => logTraceId = id

export const logger: LogType = {
    info(message: string, traceId?: string) {
        winstonLogger.info(message, {
            traceId: traceId !== undefined ? traceId : logTraceId
        })
    },
    warn(message: string, traceId?: string) {
        winstonLogger.warn(message, {
            traceId: traceId !== undefined ? traceId : logTraceId
        })
    },
    error(message: string, traceId?: string) {
        winstonLogger.error(message, {
            traceId: traceId !== undefined ? traceId : logTraceId
        })
    }
}