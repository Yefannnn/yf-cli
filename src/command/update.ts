import chalk from "chalk"
import process from "child_process";
import ora from "ora"
import { log } from "../utils/log"

const spinner = ora({
    text: 'yefan-cli 正在更新中...',
    spinner: {
        interval: 200,
        frames: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']
    },
    color: 'blue'
});

export function update() {
    spinner.start()
    process.exec('npm install yefan-cli@latest -g', (error, stdout, stderr) => {
        if (error) {
            spinner.fail('更新失败')
            log.error(chalk.red(error))
            return
        }
        spinner.succeed('更新成功')
    })
}
