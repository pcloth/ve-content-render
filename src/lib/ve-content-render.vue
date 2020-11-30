<template>
    <el-row class="page-content">
        <!-- 搜索条 -->
        <slot name="search" :searchItem="searchConfig">
            <i-search :searchItem="searchConfig" @search="handleQueryData" />
        </slot>
        <div class="space-brook" />
        <!-- 顶部工具栏 -->
        <slot name="top-toolbar">
            <div class="filter-box ve-content-render-top-toolbar">
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
                    <component v-else-if="v.slot==='component'" :is="v.component" :key="`${v.id}`"/>
                    <!-- 标准按钮组 -->
                    <template v-else-if="v.slot==='default'">
                        <el-button-group :key="`${v.id}`">
                            <el-button type="primary" icon="el-icon-plus" :title="v.title?`添加${v.title}`:'添加'" @click="handleToolbarButton('top','add',v)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" :title="v.title?`批量删除${v.title}`:'批量删除'" @click="handleToolbarButton('top','delete',v)"></el-button>
                            <el-button type="info" icon="el-icon-folder-opened" :title="v.title?`导出${v.title}`:'导出'" @click="handleToolbarButton('top','export',v)"></el-button>
                        </el-button-group>
                    </template>
                </template>
            </div>
        </slot>
        <!-- 数据表 -->
        <slot name="table" :fields="fieldsConfig" :tableData="tDataList">
            <i-table :fields="fieldsConfig" :tableData="tDataList" 
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
        <slot name="pagination" :page="queryParams.page" :pageSize="queryParams.pageSize">
            <el-pagination
                class="flex-row ve-content-render-pagination"
                :current-page="queryParams.page"
                :page-size="queryParams.pageSize"
                :page-sizes="[20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </slot>
        <div class="space-brook" />
        <!-- 底部工具栏 -->
        <slot name="buttom-toolbar">
            <div class="filter-box  ve-content-render-butoom-toolbar">
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
                    <component v-else-if="v.slot==='component'" :is="v.component" :key="`${v.id}`"/>
                    <!-- 标准按钮组 -->
                    <template v-else-if="v.slot==='default'">
                        <el-button-group :key="`${v.id}`">
                            <el-button type="primary" icon="el-icon-plus" :title="v.title?`添加${v.title}`:'添加'" @click="handleToolbarButton('buttom','add',v)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" :title="v.title?`批量删除${v.title}`:'批量删除'" @click="handleToolbarButton('buttom','delete',v)"></el-button>
                            <el-button type="info" icon="el-icon-folder-opened" :title="v.title?`导出${v.title}`:'导出'" @click="handleToolbarButton('buttom','export',v)"></el-button>
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
            <slot name="dialog">
                <template v-for="(v,k) in dialogConfig">
                    <!-- 组件接入 -->
                    <component v-if="v.slot==='component' && dialog.type===v.type" :is="v.component" v-bind="v.props" :key="v.id"/>
                    <!-- 默认view、edit、delete -->
                </template>
            </slot>
        </el-dialog>
    </el-row>
</template>

<script>

import iSearch from "./components/i-search";
import iTable from "./components/i-table";

export default {
    name:'ve-content-render',
    props: {
        instance:{
            type: Object,
            required: true,
        },
    },
    components: {
        iSearch,
        iTable
    },
    provide() {
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
    data() {
        return {
            config:null,
            width: 100, // 输入框默认宽度
            searchConfig:[],
            topToolbarConfig:[],
            fieldsConfig:[],
            dialogConfig:[],
            buttomToolbarConfig:[],
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
        };
    },
    created(){
        this.initInstance2Object()
    },
    mounted() {
        this.queryParams.pageSize = 20;
        this.queryParams.page = 1;
        // this.handleQueryData();
    },
    methods: {
        initInstance2Object() {
            // 将传入的实例对象解析到各自的组件里面去
            this.config = this.instance.config
            if(this.config){
                this.searchConfig = this.config.search||[]
                this.fieldsConfig = this.config.fields||[]
                this.dialogConfig = this.config.dialog||[]
                this.topToolbarConfig =  this.config.topToolbar||[]
                this.buttomToolbarConfig =  this.config.buttomToolbar||[]
            }

            if(this.topToolbarConfig){

            }
            
        },
        mergePageParams(params){
            // 合并分页组件参数
            return Object.assign(params,this.queryParams)
        },
        handleQueryData(params) {
            if (!params) {
                params = this.queryParams;
            }
            this.queryParams = this.mergePageParams(params);

            this.instance.dispatch('search/query',this.queryParams).then((res) => {
                this.tDataList = this.instance.responseGetPath('search/query/dataList',res)
                this.total = this.instance.responseGetPath('search/query/dataTotal',res)
            });
            this.$emit('search-query-data',this.queryParams)
        },
        changeStatus(params) {
            // 改变搜索状态，重搜索第一页
            this.queryParams.page = 1;
            this.handleQueryData(params);
        },
        handleSizeChange(size) {
            this.queryParams.pageSize = size;
            this.handleQueryData();
        },
        handleCurrentChange(page) {
            this.queryParams.page = page;
            this.handleQueryData();
        },
        changeSelected(value, row) {
            this.$set(row, "newSelected", value);
            // row.newSelected = value
        },
        tableHeaderButtonClick(name,head){
            this.$emit('table-header-button-click',name,head)
        },
        tableFieldButtonClick(name,row){
            this.handleCommand(name, row)
            this.$emit('table-field-button-click',name,row)
        },
        handleToolbarButton(position,name,head){
            // 头部按钮点击事件，直接传递给父组件ve-content-render上报给用户组件
            this.$emit('toolbar-button-click',position,name,head)
        },
        handleSelectionChange(currSelected){
            // 表格选中事件
            this.$emit('table-selection-change',currSelected)
        },
        handleCommand(cmd, row) {
            // 默认弹框
            if (cmd === "view") {
                this.dialog = {
                    top: "3vh",
                    type: cmd,
                    width: "85%",
                    title: `查看 ${row.id} 详情`,
                    visible: true,
                };
            }
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
    display:flex;
    flex-direction: column;
  }
  
  .filter-box {
    display: flex;
    line-height: normal;
    align-items: center;
    height: 100%;
    * {
      margin-left: 5px;
      margin-right: 5px;
    }
  }
  
  .space-brook {
    width: 100%;
    height: 10px;
  }
  
  .page-content {
    padding:10px;
  }
  
</style>
