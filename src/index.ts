import { Command } from 'commander'
import { version } from '../package.json'
import { create } from './command/create'
import { update } from './command/update'


const program = new Command('YF') // 创建一个命令行程序
program.version(version, '-v --version') // 设置版本号

program
    .command('update')
    .description('更新至最新版本')
    .action(async () => {
        await update()
    });


program.command('create [name]').description('创建一个新项目').action((name) => {
    create(name)
})


program.parse(process.argv) // 解析命令行参数

