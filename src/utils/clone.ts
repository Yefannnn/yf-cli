import simpleGit, { SimpleGitOptions } from 'simple-git';
import createLogger from 'progress-estimator';
import chalk from 'chalk';
import { log } from './log';
import figlet from 'figlet';
// let figlet = require("figlet");

const gitOptions: Partial<SimpleGitOptions> = {
    baseDir: process.cwd(),
    binary: 'git',
    maxConcurrentProcesses: 6, //最大并发进程数
}

let logger = createLogger({
    spinner: {
        interval: 100,
        frames: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']
    },
    storagePath: '.progress-estimator', // defaults to '.progress-estimator'.
});

// 克隆成功后提示
let cloneSuccess = async () => {
    log.success('项目初始化成功')
    log.success('执行以下命令开始项目')
    log.info(chalk.greenBright(`cd ${process.cwd()}`))
    log.info(chalk.greenBright('pnpm install'))
    log.info(chalk.greenBright('pnpm run dev'))
    let data = await figlet.text("welcome  to  use  yefan-cli", {
        font: 'Standard', // 字体 
        horizontalLayout: 'default', // default or full
        verticalLayout: 'default', // default or full
        width: 200, // 宽度
        whitespaceBreak: true, // 是否保留空格
    });
    console.log(chalk.rgb(10, 166, 218).visible(data));
}


export const clone = async (url: string, projectName: string, options: string[]) => {
    const git = simpleGit(gitOptions)
    try {
        await logger(git.clone(url, projectName, options), '项目初始化中...', {
            estimate: 7000, // 估计时间
        })
        log.success(chalk.green('项目初始化完成'))
        console.log(chalk.blackBright('==============================================================='))
        await cloneSuccess()
    } catch (error) {
        log.error(chalk.red('项目初始化失败'))
        log.error(chalk.blackBright('==============================================================='))
    }
}
