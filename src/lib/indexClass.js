// 处理配置数据
import { uid } from './func';

const bankFunc = function (name) {
    throw new Error(`${name} 方法缺失`);
}

// const mergeObjects()

export class ContentPageClass {
    // 初始化传入整体参数，并检查参数合法性，附加属性
    constructor(config = {  search: [],topToolbar:[], fields: [], dialog:[],buttomToolbar:[]}, options = {}) {
        this.config = {
            search:config.search,
            topToolbar:config.topToolbar,
            fields:config.fields,
            dialog:config.dialog,
            buttomToolbar:config.buttomToolbar,
        }

        this.defOptions = {
            // 默认配置
            actions: {}, // 放置各个模块的actions 推荐使用命名空间方案，例如search/query
            responseKeyPath: {
                // 搜索结果后，从response拿数据的key
                // todo 支持.分割
                'search/query/dataList': 'info',
                'search/query/dataTotal': 'total',
            }
        }
        // 用户定义配置
        this.options = {
            actions: {},
            responseKeyPath: {},
            topToolbar:{}
        }

        Object.assign(this.options,options)
    }

    _getOptions_(objname,type,key){
        if(this[objname] && this[objname][type] && this[objname][type][key]){
            return this[objname][type][key]
        }else{
            return
        }
    }

    getOptions(type,key){
        // 获取参数，先从用户传入参数获取，找不到就从默认参数获取
        return this._getOptions_('options',type,key)||this._getOptions_('defOptions',type,key)
    }

    responseGetPath(spaceName, res) {
        // 从response上拿指定的数据
        let path = this.getOptions('responseKeyPath',spaceName);
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
    // 添加工具条
    addToolbar(pos='top', data={slot:'default'}) {
        this.additionalAttributes(data)
        if(pos==='top'){
            this.config.topToolbar.push(data)
        }
        if(pos==='buttom'){
            this.config.buttomToolbar.push(data)
        }
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
        let f = this.getOptions('actions',spaceName);
        if (f && typeof f ==='function') {
            return this.options.actions[spaceName](data)
        } else {
            return bankFunc(spaceName)
        }
    }

}