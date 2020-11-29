<template>
    <el-row class="page-content">
        <!-- 搜索条 -->
        <slot name="search" :searchItem="searchConfig">
            <i-search :searchItem="searchConfig" @search="handleQueryData" />
        </slot>
        <div class="space-brook" />
        <!-- 数据表 -->
        <slot name="table" :fields="fieldsConfig" :tableData="tDataList">
            <i-table :fields="fieldsConfig" :tableData="tDataList" />
        </slot>
        <div class="space-brook" />
        <el-pagination
            class="flex-row"
            style="justify-content: center"
            :current-page="queryParams.page"
            :page-size="queryParams.pageSize"
            :page-sizes="[20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />

        <el-dialog
            :width="dialog.width"
            :top="dialog.top"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :title="dialog.title"
            :visible.sync="dialog.visible"
            append-to-body
        >
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
            currentOrder: {},
            currentCid: "",
            currentCustomer: {
                childList: [],
            },
            editOrder: {
                id: "",
                modifyChildList: [],
            },
            childList: [],
            customerChildListLength: 0,
        };
    },
    computed: {
        searchConfig() {
            if (this.config && this.config.search) {
                return this.config.search;
            } else {
                return [];
            }
        },
        fieldsConfig() {
            if (this.config && this.config.fields) {
                return this.config.fields;
            } else {
                return [];
            }
        },
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
        },
        handleQueryData(params) {
            if (!params) {
                params = {};
            }
            this.queryParams = params;
            this.instance.dispatch('search/query',params).then((res) => {
                this.tDataList = this.instance.responseGetPath('search/query/dataList',res)
                this.total = this.instance.responseGetPath('search/query/dataTotal',res)
            });
        },
        changeStatus(e) {
            this.queryParams.page = 1;
            // this.handleQueryData();
        },
        handleSizeChange(size) {
            this.queryParams.pageSize = size;
            // this.handleQueryData();
        },
        handleCurrentChange(page) {
            this.queryParams.page = page;
            // this.handleQueryData();
        },
        changeSelected(value, row) {
            this.$set(row, "newSelected", value);
            // row.newSelected = value
        },
        handleCommand(row, cmd) {
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
