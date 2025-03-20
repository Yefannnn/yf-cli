import { select, input } from '@inquirer/prompts';
import { clone } from '../utils/clone';
import fs from 'fs-extra';
import path from 'path';
import axios, { AxiosResponse } from 'axios'
import lodash from 'lodash';
import { name, version } from '../../package.json';
import chalk from 'chalk';
import { log } from '../utils/log';

export interface TemplateInfo {
    label: string; // 项目名称
    name: string; // 项目名称
    downloadUrl: string; // 下载地址
    description: string; // 项目描述
    branch: string; // 项目分支
}
export interface TemplateInfo_ {
    Vue: {
        Vue2: Array<TemplateInfo>,
        Vue3: Array<TemplateInfo>,
    },
    React: {
        React18: Array<TemplateInfo>,
    },
}

export const templates_: TemplateInfo_ = {
    'Vue': {
        'Vue2': [
            {
                label: 'fantastic-admin-vue2-basic-template',
                name: "fantastic-admin",
                downloadUrl: 'git@gitee.com:fantastic-admin/basic.git',
                description: '基于Vue3的后台管理系统模板(开源项目)',
                branch: 'vue2'
            },
        ],
        'Vue3': [
            {
                label: 'admin-vue3-ts-template',
                name: "admin-pro",
                downloadUrl: 'git@gitee.com:yefan008/admin-vue3-ts.git',
                description: 'Vue3技术栈开发模板',
                branch: 'master'
            },
            {
                label: 'admin-vue3-box-template',
                name: "react18+vite5+ts",
                downloadUrl: 'git@gitee.com:yefan008/admin-vue3-box.git',
                description: '基于Vue3的后台管理系统模板(开源项目)',
                branch: 'master'
            },
            {
                label: 'fantastic-admin-vue3-basic-template',
                name: "fantastic-admin",
                downloadUrl: 'git@gitee.com:fantastic-admin/basic.git',
                description: '基于Vue3的后台管理系统模板(开源项目)',
                branch: 'main'
            },
            {
                label: 'admin-vue3-ts-h5-template',
                name: "admin-pro-h5",
                downloadUrl: 'git@gitee.com:yefan008/admin-pro-h5.git',
                description: '基于Vue3的H5模板',
                branch: 'master'
            },
        ]
    },
    'React': {
        'React18': [
            {
                label: 'React18-Vite5-Ts-template',
                name: "react18+vite5+ts",
                downloadUrl: 'git@gitee.com:yefan008/admin-react-ts.git',
                description: 'React18技术栈开发模板',
                branch: 'master'
            },
        ]
    },
}

// npm 包提供了根据包名称查询包信息的接口
// 我们在这里直接使用 axios 请求调用即可
export const getNpmInfo = async (npmName: string) => {
    const npmUrl = 'https://registry.npmjs.org/' + npmName
    let res = {}
    try {
        res = await axios.get(npmUrl)
    } catch (err) {
        log.error(err as string)
    }
    return res
}
export const getNpmLatestVersion = async (npmName: string) => {
    // data['dist-tags'].latest 为最新版本号
    const { data } = (await getNpmInfo(npmName)) as AxiosResponse
    return data['dist-tags'].latest
}

export const checkVersion = async (name: string, curVersion: string) => {
    const latestVersion = await getNpmLatestVersion(name)
    const need = lodash.gt(latestVersion, curVersion)
    if (need) {
        log.info(`检测到 yefan-cli 最新版:${chalk.blueBright(latestVersion)} 当前版本:${chalk.blueBright(curVersion)} ~`)
        log.info(`可使用 ${chalk.yellow('pnpm')} install yefan-cli@latest 更新 ~ 或者使用 yefan-cli update 命令更新`)
    }
    return need
}



export const create = async (prjName?: string) => {
    // 文件名称未传入需要输入
    if (!prjName) prjName = await input({ message: '请输入项目名称' });
    // 如果文件已存在需要让用户判断是否覆盖原文件
    const filePath = path.resolve(process.cwd(), prjName)
    if (fs.existsSync(filePath)) {
        const run = await isOverwrite(prjName)
        if (run) {
            await fs.remove(filePath)
        } else {
            return // 不覆盖直接结束
        }
    }

    // 选择模板之前 -- 先检查版本
    await checkVersion(name, version) // 检测版本更新

    let templateT = []
    for (const key in templates_) {
        templateT.push({
            name: key,
            value: key,
            description: key
        })
    }

    // 选择模板
    type templateT_type = 'Vue' | 'React'
    const templateT_: templateT_type = await select({
        message: '请选择一个想要的前端框架',
        choices: templateT
    }) as templateT_type;

    // 选择模板
    let templateC = []
    for (const key in templates_[templateT_]) {
        templateC.push({
            name: key,
            value: key,
            description: key
        })
    }

    type templateC_type = 'Vue2' | 'Vue3' | 'React18'
    const templateC_: templateC_type = await select({
        message: '请选择一个该框架对应的版本',
        choices: templateC
    }) as templateC_type;

    let templateList: Array<TemplateInfo> = []
    if (templateT_ === 'Vue') {
        if (templateC_ === 'Vue2') {
            templateList = templates_[templateT_]['Vue2']
        } else if (templateC_ === 'Vue3') {
            templateList = templates_[templateT_]['Vue3']
        }
    } else if (templateT_ === 'React') {
        if (templateC_ === 'React18') {
            templateList = templates_[templateT_]['React18']
        }
    }
    // 选择模板
    const template = await select({
        message: '请选择一个具体模板',
        choices: templateList?.length && templateList.map((item: TemplateInfo) => {
            return {
                name: item.label,
                value: item.label,
                description: item.description
            }
        }) || [] as const
    }) as templateT_type;

    const info = templateList?.length && templateList.find((item: TemplateInfo) => item.label === template) || null
    if (!info) {
        log.warning('模板不存在')
        return
    }
    // 下载模板
    clone(info.downloadUrl, prjName, ['-b', info.branch])
}


export const isOverwrite = async (fileName: string) => {
    log.warning(`${fileName} 文件已存在 !`)
    return select({
        message: '是否覆盖原文件: ',
        choices: [
            { name: '覆盖', value: true },
            { name: '取消', value: false }
        ]
    });
}