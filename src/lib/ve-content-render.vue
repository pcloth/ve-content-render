<template>
    <el-row class="page-content" :class="className.pageContent">
        <!-- 搜索条 -->
        <slot
            name="search"
            :searchItem="searchConfig"
        >
            <i-search
                :className="className"
                :searchOption="searchOption"
                :searchItem="searchConfig"
                :expandButtons="expandButtons"
                @search="handleQueryData"
                @search-expand-button-click="handleSearchExBtn"
            />
        </slot>
        <div class="space-brook" />
        <!-- 顶部工具栏 -->
        <slot name="top-toolbar">
            <div class="filter-box " :class="className.topToolbar">
                <template v-for="(v,k) in topToolbarConfig">
                    <!-- 按钮插槽 -->
                    <el-button
                        v-if="v.slot==='button'"
                        v-bind="v"
                        :key="`${v.id}`"
                        @click="v.callback||handleToolbarButton('top','button',v)"
                    >{{v.tip}}
                    </el-button>
                    <!-- 组件插槽 -->
                    <component
                        v-else-if="v.slot==='component'"
                        :is="v.component"
                        :key="`${v.id}`"
                    />
                    <!-- 标准按钮组 -->
                    <template v-else-if="v.slot==='default'">
                        <el-button-group :key="`${v.id}`">
                            <el-button
                                type="primary"
                                icon="el-icon-plus"
                                :title="v.title?`添加${v.title}`:'添加'"
                                @click="handleToolbarButton('top','add',v)"
                            >添加</el-button>
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                :disabled="selectedCount===0"
                                :title="v.title?`批量删除${v.title}`:'批量删除'"
                                @click="handleToolbarButton('top','delete',v)"
                            >批量删除</el-button>
                            <el-button
                                type="info"
                                icon="el-icon-download"
                                :disabled="tDataList.length===0"
                                :title="v.title?`导出${v.title}`:'导出'"
                                @click="handleToolbarButton('top','export',v)"
                            >导出</el-button>
                        </el-button-group>
                    </template>
                </template>
            </div>
        </slot>
        <div class="space-brook" />
        <!-- 数据表 -->
        <slot
            name="table"
            :fields="fieldsConfig"
            :tableData="tDataList"
        >
            <i-table
                :propsTable="propsData.table"
                :fields="fieldsConfig"
                :tableData="tDataList"
                @table-header-button-click="tableHeaderButtonClick"
                @table-field-button-click="tableFieldButtonClick"
                @table-selection-change="handleSelectionChange"
            >
                <template v-slot:table-default-header-button="scope">
                    <slot name="table-default-header-button"></slot>
                </template>
                <template v-slot:table-default-field-button="scope">
                    <slot name="table-default-field-button"></slot>
                </template>
            </i-table>
        </slot>
        <div class="space-brook" />
        <!-- 分页组件 -->
        <slot
            name="pagination"
            :page="queryParams.page"
            :pageSize="queryParams.pageSize"
        >
            <el-pagination
                :class="className.pagination"
                class="flex-row"
                :current-page="queryParams.page"
                :page-size="queryParams.pageSize"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                v-bind="propsData.pagination"
            />
        </slot>
        <div class="space-brook" />
        <!-- 底部工具栏 -->
        <slot name="buttom-toolbar">
            <div class="filter-box" :class="className.buttomToolbar">
                <template v-for="(v,k) in buttomToolbarConfig">
                    <!-- 按钮插槽 -->
                    <el-button
                        v-if="v.slot==='button'"
                        v-bind="v"
                        :key="`${v.id}`"
                        @click="v.callback||handleToolbarButton('buttom','button',v)"
                    >{{v.tip}}
                    </el-button>
                    <!-- 组件插槽 -->
                    <component
                        v-else-if="v.slot==='component'"
                        :is="v.component"
                        :key="`${v.id}`"
                    />
                    <!-- 标准按钮组 -->
                    <template v-else-if="v.slot==='default'">
                        <el-button-group :key="`${v.id}`">
                            <el-button
                                type="primary"
                                icon="el-icon-plus"
                                :title="v.title?`添加${v.title}`:'添加'"
                                @click="handleToolbarButton('buttom','add',v)"
                            ></el-button>
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                :disabled="selectedCount===0"
                                :title="v.title?`批量删除${v.title}`:'批量删除'"
                                @click="handleToolbarButton('buttom','delete',v)"
                            ></el-button>
                            <el-button
                                type="info"
                                icon="el-icon-download"
                                :disabled="tDataList.length===0"
                                :title="v.title?`导出${v.title}`:'导出'"
                                @click="handleToolbarButton('buttom','export',v)"
                            ></el-button>
                        </el-button-group>
                    </template>
                </template>
            </div>
        </slot>

        <el-dialog
            :width="dialog.width"
            :top="dialog.top"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :title="dialog.title"
            :visible.sync="dialog.visible"
            append-to-body
        >
            <!-- 这里制作view、edit、delete弹窗和插槽 -->
            <slot
                name="dialog"
                :type="dialog.type"
                :dialog="dialog"
                :row="currRow"
            >
                <template v-for="(v,k) in dialogConfig">
                    <!-- 组件接入 -->
                    <component
                        v-if="v.slot==='component' && dialog.type===v.type"
                        :is="v.component"
                        v-bind="v.props"
                        :key="v.id"
                    />
                    <!-- 默认view、edit、delete -->
                </template>
            </slot>
        </el-dialog>
    </el-row>
</template>

<script>

import iSearch from "./components/i-search";
import iTable from "./components/i-table";

const ExportJsonExcel = require("js-export-excel");



export default {
    name: 've-content-render',
    props: {
        instance: {
            type: Object,
            required: true,
        },
    },
    components: {
        iSearch,
        iTable
    },
    provide () {
        return {
            indexPage: this.indexPage || {},
            main: this,
        };
    },
    inject: {
        indexPage: {
            from: "indexPage",
            default: {},
        },
    },
    data () {
        return {
            config: null,
            width: 100, // 输入框默认宽度
            searchConfig: [],
            topToolbarConfig: [],
            fieldsConfig: [],
            dialogConfig: [],
            buttomToolbarConfig: [],
            dialog: {
                top: "3vh",
                type: "",
                width: "50%",
                title: "",
                visible: false,
            },
            tDataList: [],
            loading: false,
            queryParams: {
                page: 0,
                pageSize: 20,
            },
            total: 0,
            pageKey: '',
            pageSizeKey: '',
            selectedCount: 0,
            currSelected: [],
            currRow: {}, // 当前单条数据
            className:{},
            propsData:{},
            searchOption:{}
        };
    },
    watch: {
        instance () {
            this.initInstance2Object()
        }
    },
    beforeCreate(){
        // this.initInstance2Object()
    },
    created () {
        this.initInstance2Object()
    },
    mounted () {
        if (this.instance.getOptions('search', 'autoQuery')) {
            this.queryParams.page = 1;
            this.handleQueryData();
        }
    },
    methods: {
        initInstance2Object () {
            // 将传入的实例对象解析到各自的组件里面去
            this.config = this.instance.config
            if (this.config) {
                this.searchConfig = this.config.search || []
                this.expandButtons = this.config.expandButtons || []
                this.fieldsConfig = this.config.fields || []
                this.dialogConfig = this.config.dialog || []
                this.topToolbarConfig = this.config.topToolbar || []
                this.buttomToolbarConfig = this.config.buttomToolbar || []
            }

            if (this.topToolbarConfig) {

            }

            this.pageKey = this.instance.getOptions('search', 'pageKey')
            this.pageSizeKey = this.instance.getOptions('search', 'pageSizeKey')
            this.className = this.instance.options.class
            this.propsData = this.instance.options.props
            this.searchOption = this.instance.options.search
            console.log(this.searchOption,'searchOption>>>')
        },
        mergePageParams (params) {
            // 合并分页组件参数
            let p = {}
            p[this.pageKey] = this.queryParams.page
            p[this.pageSizeKey] = this.queryParams.pageSize
            return Object.assign(params, p)
        },
        handleQueryData (params = {}) {
            let data = this.mergePageParams(params);

            this.instance.dispatch('search/query', data).then((res) => {
                this.tDataList = this.instance.responseGetPath('search/query/dataList', res)
                this.total = this.instance.responseGetPath('search/query/dataTotal', res)
                this.$emit('query-data-success', res)
            });
            this.$emit('search-query-data', data)
        },
        changeStatus (params) {
            // 改变搜索状态，重搜索第一页
            this.queryParams.page = 1;
            this.handleQueryData(params);
        },
        handleSizeChange (size) {
            this.queryParams.pageSize = size;
            this.handleQueryData();
        },
        handleCurrentChange (page) {
            this.queryParams.page = page;
            this.handleQueryData();
        },
        changeSelected (value, row) {
            this.$set(row, "newSelected", value);
            // row.newSelected = value
        },
        tableHeaderButtonClick (name, head) {
            this.$emit('table-header-button-click', name, head)
        },
        tableFieldButtonClick (name, row) {
            this.handleCommand(name, row)
            this.$emit('table-field-button-click', name, row)
        },
        areYouSure (title, message, options = {}, callback = undefined, data = undefined) {
            console.log(33, options)
            return new Promise((resolve, reject) => {
                return this.$confirm(message, title, options).then(() => {
                    console.log(44)
                    resolve()
                    if (typeof callback === 'function') {
                        return callback(data)
                    }
                }).catch(() => {
                    reject()
                });
            })
        },
        dispatch (spaceName, data) {
            return this.instance.dispatch(spaceName, data)
        },
        handleToolbarButton (position, name, button) {
            // 工具条点击事件，直接传递给父组件ve-content-render上报给用户组件
            let useDefaultButtonFuntion = this.instance.getOptions('table', 'useDefaultButtonFuntion')

            if (button.slot === 'default' && name === 'delete' && this.instance.hasDispatch('toolbar/delete')) {
                // 默认按钮的批量删除
                let deleteKey = this.instance.getOptions('toolbar', 'deleteKey')
                let deleteListKey = this.instance.getOptions('toolbar', 'deleteListKey')
                let ids = []
                this.currSelected.forEach(row => {
                    ids.push(row[deleteKey])
                })
                this.areYouSure('提示', `您将要批量删除${ids.length}条数据，删除后不可恢复，是否继续？`, { type: 'warning' }).then(_ => {
                    let data = {}
                    data[deleteListKey] = ids;
                    this.instance.dispatch('toolbar/delete', data).then((res) => {
                        this.$notify({ message: '批量删除数据成功', type: 'success' })
                        this.handleQueryData();
                        this.$emit('delete-success', res)
                    })
                })
                return
            }

            if (button.slot === 'default' && name === 'export') {
                if (this.instance.hasDispatch('toolbar/export')) {
                    // 有后端导出
                } else {
                    // 前端导出
                    this.jsExportExcelCurrTable();
                }

            }

            this.$emit('toolbar-button-click', position, name, button)
            return

        },
        jsExportExcelCurrTable () {
            // 导出当前表数据
            var option = {};

            option.fileName = "excel";
            let sheetFilter = [],sheetHeader=[],columnWidths=[];
            this.fieldsConfig.forEach(field=>{
                // console.log(field)
                if(!field.type && !field.slot && !field.header){
                    // 普通单元格
                    sheetFilter.push(field.prop)
                    sheetHeader.push(field.label)
                    columnWidths.push(field.width?field.width/10:10)
                }
            })
            option.datas = [
                {
                    sheetData: this.tDataList,
                    sheetName: "sheet",
                    sheetFilter: sheetFilter,
                    sheetHeader: sheetHeader,
                    columnWidths: columnWidths,
                }
            ];

            var toExcel = new ExportJsonExcel(option); //new
            toExcel.saveExcel(); //保存
        },
        openDialog (type, top, title, width = '85%', data = {}) {
            this.currRow = data;
            this.dialog = {
                type,
                top,
                title,
                width,
                visible: true,
            }
        },
        closeDialog () {
            this.dialog.visible = false
        },
        handleSelectionChange (currSelected) {
            // 表格选中事件
            this.currSelected = currSelected;
            this.selectedCount = currSelected.length;
            this.$emit('table-selection-change', currSelected)
        },
        handleCommand (cmd, row) {
            // 默认弹框
            let useDefaultButtonFuntion = this.instance.getOptions('table', 'useDefaultButtonFuntion')
            if (useDefaultButtonFuntion) {
                if (cmd === "view") {
                    this.openDialog(cmd, undefined, `查看 ${row.id} 详情`, '85%', row)
                }
                if (cmd === 'edit') {
                    this.openDialog(cmd, undefined, `编辑 ${row.id}`, '85%', row)
                }
                if (cmd === 'delete') {
                    this.areYouSure('提示', `您将要删除编号为${row.id}的数据，删除后不可恢复，是否继续？`, { type: 'warning' }).then(_ => {
                        let deleteKey = this.instance.getOptions('toolbar', 'deleteKey')
                        let deleteListKey = this.instance.getOptions('toolbar', 'deleteListKey')
                        let data = {}
                        data[deleteListKey] = [row.id];
                        this.instance.dispatch('toolbar/delete', data).then((res) => {
                            this.$notify({ message: '批量删除数据成功', type: 'success' })
                            this.handleQueryData();
                            this.$emit('delete-success', res)
                        })
                    })
                }
            }
            this.$emit('table-row-button', cmd, row)
        },
        handleSearchExBtn(btn){
            this.$emit('search-expand-button-click',btn)
        }
    },
    
};
</script>


<style lang="scss">
.flex-row {
    display: flex;
    flex-direction: row;
}

.flex-column {
    display: flex;
    flex-direction: column;
}

.filter-box {
    display: flex;
    line-height: normal;
    align-items: center;
    height: 100%;
}

.filter-box > * {
    margin-left: 5px;
    margin-right: 5px;
}

.space-brook {
    width: 100%;
    height: 10px;
}

.page-content {
    padding: 10px;
}
</style>
