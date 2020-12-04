<template>
    <ve-content-render
        :instance="instance"
        @table-header-button-click="tableHeaderButtonClick"
        @table-field-button-click="tableFieldButtonClick"
        @search-query-data="searchQueryData"
        @toolbar-button-click="toolbarButtonClick"
        @table-selection-change="handleSelectionChange"
        @search-expand-button-click="handleSearchExBtn"
    >
        <!-- <div slot="table" slot-scope="scope">
            <p v-for="t in scope.tableData" :key="t.id">{{t.returnCarTime}}</p>
        </div> -->

        <!-- 插入表格操作栏头部按钮 -->
        <!-- <div slot="table-default-header-button">
            <el-button slot="table-default-header-button">头部按钮</el-button>
        </div> -->
        <template v-slot:dialog="scope">
            <!-- 子窗体再加一层 -->
            <ve-content-render
                v-if="scope.type==='date'"
                :instance="child"
            />
        </template>
    </ve-content-render>
</template>

<script>
import veContentRender from "../src/lib/ve-content-render";
import { ContentPageClass } from "../src/lib/indexClass.js";

let demo = new ContentPageClass({
    expandButtons: [
        { tip: '扩展按钮', key: 'key' ,props:{type:'info'} }
    ]
}, { responseKeyPath: { 'search/query/dataList': 'info' } });
let child = new ContentPageClass();

// demo.setOptions('responseKeyPath','search/query/dataList','info')
demo.setOptions('responseKeyPath', 'search/query/dataTotal', 'total')


child.setOptions('responseKeyPath', 'search/query/dataList', 'info')
child.setOptions('responseKeyPath', 'search/query/dataTotal', 'total')
child.addSearchItem({
    tip: "客户姓名",
    key: "name",
});
child.addFieldItemList([
    {
        label: "日期",
        prop: "date",
        render (h, ctx, row, veContentRender) {
            // veContentRender 是主页面组件
            let f = function (e) {
                return veContentRender.openDialog('date', '3vh', '', '70%', row)
            }
            return <el-button type="warning" onClick={f}>打开对话框</el-button>
        }
    },
    { label: "客户", prop: "name" },
    { label: "省份", prop: "province" },
    { label: "城市", prop: "city" },
    { label: "地址", prop: "address" },
    { label: "邮编", prop: "zip" },
]);

demo.addSearchItem({
    tip: "客户姓名",
    key: "name",
});
demo.addSearchItem({
    slot: "date-picker",
    tip: "日期",
    key: "date",
    props: {
        valueFormat: 'yyyy-MM-dd',
        placeholder: '请选择日期'
    }
});
demo.addSearchItem({
    slot: 'select',
    options: [{ label: 'A类', value: 'A' }, { label: 'B类', value: 'b' }],
    tip: "客户类型",
    key: "type",
});
demo.addFieldItem({ type: "selection" });
demo.addFieldItem({ type: "index" });
demo.addFieldItemList([
    {
        label: "日期",
        prop: "date",
        render (h, ctx, row, veContentRender) {
            // veContentRender 是主页面组件
            let f = function (e) {
                return veContentRender.openDialog('date', '3vh', '', '70%', row)
            }
            return <el-button type="warning" onClick={f}>打开对话框</el-button>
        }
    },
    { label: "客户", prop: "name" },
    { label: "省份", prop: "province" },
    { label: "城市", prop: "city" },
    { label: "地址", prop: "address" },
    { label: "邮编", prop: "zip" },
]);
demo.addFieldItem({
    // header:[
    //     {
    //         slot:'default',
    //         tip:'test'
    //     },
    //     // {
    //     //     slot:'button',
    //     //     type:'info',
    //     //     title:'额外按钮',
    //     //     icon:'el-icon-edit'
    //     // }
    // ],
    label: "操作",
    slot: "default",
});

demo.addToolbar("top", {
    slot: "default",
});

import { queryOrderPage } from "./api";

demo.bindActions("search/query", queryOrderPage);
child.bindActions("search/query", queryOrderPage);
export default {
    data () {
        return {
            instance: demo,
            child: child,
        };
    },
    mounted () {
        window.demo = demo;
    },
    components: {
        veContentRender,
    },
    methods: {
        tableHeaderButtonClick (name, button) {
            console.log("用户接受头部按钮点击事件：", name, button);
        },
        tableFieldButtonClick (name, row) {
            console.log("用户接受数据表操作按钮点击：", name, row);
        },
        searchQueryData (params) {
            console.log("用户接受searchQueryData：", params);
        },
        toolbarButtonClick (position, name, button) {
            console.log("用户接受toolbarButtonClick：", position, name, button);
        },
        handleSelectionChange (currSelected) {
            console.log("用户接受表格选中：", currSelected);
        },
        handleSearchExBtn (btn) {
            console.log('接受扩展按钮', btn)
        }
    },
};
</script>

<style>
.ve-content-render-top-toolbar {
    justify-content: flex-end;
}

.ve-content-render-pagination {
    justify-content: center;
}
</style>