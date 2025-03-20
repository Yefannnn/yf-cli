import { select, input } from '@inquirer/prompts';
import { clone } from '../utils/clone';
import fs from 'fs-extra';
import path from 'path';

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


// 这里保存了我写好了咱们的之前开发的模板
// export const templates: Map<string, TemplateInfo> = new Map(Object.entries({
//     'admin-vue3-ts-template': {
//         name: "admin-pro",
//         downloadUrl: 'git@gitee.com:yefan008/admin-vue3-ts.git',
//         description: 'Vue3技术栈开发模板',
//         branch: 'master'
//     },
//     'React18-Vite5-Ts-template': {
//         name: "react18+vite5+ts",
//         downloadUrl: 'git@gitee.com:yefan008/admin-react-ts.git',
//         description: 'React18技术栈开发模板',
//         branch: 'master'
//     },
//     'admin-vue3-box-template': {
//         name: "react18+vite5+ts",
//         downloadUrl: 'git@gitee.com:yefan008/admin-vue3-box.git',
//         description: '基于Vue3的后台管理系统模板(开源项目)',
//         branch: 'master'
//     },
//     'fantastic-admin-vue3-template': {
//         name: "fantastic-admin",
//         downloadUrl: 'git@gitee.com:fantastic-admin/basic.git',
//         description: '基于Vue3的后台管理系统模板(开源项目)',
//         branch: 'main'
//     },
//     'fantastic-admin-vue2-template': {
//         name: "fantastic-admin",
//         downloadUrl: 'git@gitee.com:fantastic-admin/basic.git',
//         description: '基于Vue3的后台管理系统模板(开源项目)',
//         branch: 'vue2'
//     },

// }))

export const templates_: TemplateInfo_ = {
    'Vue': {
        'Vue2': [
            {
                label: 'fantastic-admin-vue2-template',
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
                label: 'fantastic-admin-vue3-template',
                name: "fantastic-admin",
                downloadUrl: 'git@gitee.com:fantastic-admin/basic.git',
                description: '基于Vue3的后台管理系统模板(开源项目)',
                branch: 'main'
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



export const create = async (prjName?: string) => {
    // const templateList = Array.from(templates).map((item: [string, TemplateInfo]) => {
    //     const [name, info] = item
    //     return {
    //         name,
    //         value: name,
    //         description: info.description
    //     }
    // })
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
        console.log('模板不存在')
        return
    }
    // 下载模板
    clone(info.downloadUrl, prjName, ['-b', info.branch])
}


export const isOverwrite = async (fileName: string) => {
    console.warn(`${fileName} 文件已存在 !`)
    return select({
        message: '是否覆盖原文件: ',
        choices: [
            { name: '覆盖', value: true },
            { name: '取消', value: false }
        ]
    });
}