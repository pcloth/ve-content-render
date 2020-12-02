// 处理配置数据
import { uid } from './func';

const throwError = function (name, str='方法缺失') {
    throw new Error(`${name} ${str}`);
}

export function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

// 合并默认参数
export function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                console.log('合并：',target[key],source[key])
                target[key] = source[key]
                // Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

export class ContentPageClass {
    // 初始化传入整体参数，并检查参数合法性，附加属性
    constructor (config = { search: [], topToolbar: [], fields: [], dialog: [], buttomToolbar: [] }, options = {}) {
        this.config = {
            search: config.search,
            topToolbar: config.topToolbar,
            fields: config.fields,
            dialog: config.dialog,
            buttomToolbar: config.buttomToolbar,
        }

        this.options = {
            // 默认配置
            actions: {}, // 放置各个模块的actions 推荐使用命名空间方案，例如search/query
            responseKeyPath: {
                // 搜索结果后，从response拿数据的key
                // todo 支持.分割
                'search/query/dataList': 'info',
                'search/query/dataTotal': 'total',
            },
            topToolbar: {},
            search: {
                // 搜索分页关键字
                pageKey: 'current',
                pageSizeKey: 'size',
                autoQuery: true, //  页面mounted时自动查询

            }
        }

        mergeDeep(this.options, options)
    }

    getOptions(type, key) {
        // 获取参数
        if (this.options && this.options[type] && this.options[type][key]) {
            return this.options[type][key]
        } else {
            return
        }
    }

    
    addOptions(type,key,value){
        // 添加参数
        if(this.options[type]){
            this.options[type][key] = value
        }else{
            return throwError(type,'配置没找到')
        }
    }

    responseGetPath(spaceName, res) {
        // 从response上拿指定的数据
        let path = this.getOptions('responseKeyPath', spaceName);
        if (path) {
            return res[path];
        } else {
            throw new Error(`${spaceName} 配置不存在`);
        }
    }

    // 附加属性
    additionalAttributes(data) {
        data.id = uid(); // 随机生成一个id，便于模板区域v-for渲染取key
    }
    // 添加单条搜索项目
    addSearchItem(data) {
        this.additionalAttributes(data)
        this.config.search.push(data);
    }

    // 批量添加搜索项目
    addSearchItemList(arr) {
        arr.forEach(item => {
            this.addSearchItem(item)
        });
    }


    // 添加工具条
    addToolbar(pos = 'top', data = { slot: 'default' }) {
        this.additionalAttributes(data)
        if (pos === 'top') {
            this.config.topToolbar.push(data)
        }
        if (pos === 'buttom') {
            this.config.buttomToolbar.push(data)
        }
    }

    // 批量添加搜索项目
    addToolbarList(pos = 'top', arr) {
        arr.forEach(item => {
            this.addToolbar(pos, item)
        });
    }

    // 添加单元格
    addFieldItem(data) {
        this.additionalAttributes(data)
        this.config.fields.push(data);
    }

    // 批量添加搜索项目
    addFieldItemList(arr) {
        arr.forEach(item => {
            this.addFieldItem(item)
        });
    }

    // 添加方法
    bindActions(spaceName, func) {
        this.options.actions[spaceName] = func;
    }

    // 执行方法
    dispatch(spaceName, data) {
        let f = this.getOptions('actions', spaceName);
        if (f && typeof f === 'function') {
            return this.options.actions[spaceName](data)
        } else {
            return throwError(spaceName)
        }
    }

}