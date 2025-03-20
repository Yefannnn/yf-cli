import simpleGit, { SimpleGitOptions } from 'simple-git';
import createLogger from 'progress-estimator';
import chalk from 'chalk';
import { log } from './log';

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
export const clone = async (url: string, projectName: string, options: string[]) => {
    const git = simpleGit(gitOptions)
    try {
        await logger(git.clone(url, projectName, options), '项目初始化中...', {
            estimate: 7000, // 估计时间
        })
        log.success(chalk.green('项目初始化完成'))
        log.success(chalk.blackBright('==============================================================='))
    } catch (error) {
        log.error(chalk.red('项目初始化失败'))
        log.error(chalk.blackBright('==============================================================='))
    }
}
