// 处理配置数据
import { uid } from './func';

const bankFunc = function (name) {
    throw new Error(`${name} 方法缺失`);
}

export class ContentPageClass {
    // 初始化传入整体参数，并检查参数合法性，附加属性
    constructor(config = { fields: [], search: [],}) {
        this.config = {}
        this.config.fields = config.fields;
        this.config.search = config.search;

        this.options = {
            actions: {}, // 放置各个模块的actions 推荐使用命名空间方案，例如search/query
            responseKeyPath: {
                // 搜索结果后，从response拿数据的key
                // todo 支持.分割
                'search/query/dataList': 'info',
                'search/query/dataTotal': 'total',
            }
        }
    }

    responseGetPath(spaceName, res) {
        // 从response上拿指定的数据
        let path = this.options.responseKeyPath[spaceName];
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
    // 添加单元格
    addFieldItem(data) {
        this.additionalAttributes(data)
        this.config.fields.push(data);
    }

    // 添加方法
    bindActions(spaceName, func) {
        this.options.actions[spaceName] = func;
    }

    // 执行方法
    dispatch(spaceName, data) {
        if (this.options.actions[spaceName]) {
            return this.options.actions[spaceName](data)
        } else {
            return bankFunc(spaceName)
        }
    }

}