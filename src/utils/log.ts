import symbol from 'log-symbols'

export const log = {
    success: (msg: string) => {
        console.log(symbol.success, msg)
    },
    error: (msg: string) => {
        console.log(symbol.error, msg)
    },
    warning: (msg: string) => {
        console.log(symbol.warning, msg)
    },
    info: (msg: string) => {
        console.log(symbol.info, msg)
    }
}