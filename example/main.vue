<template>
    <ve-content-render 
        :instance="instance"
    >
        <!-- <div slot="table" slot-scope="scope">
            <p v-for="t in scope.tableData" :key="t.id">{{t.returnCarTime}}</p>
        </div> -->
    </ve-content-render>
</template>

<script>
import veContentRender from "../src/lib/ve-content-render";
import {ContentPageClass} from '../src/lib/indexClass.js';


let demo = new ContentPageClass();
demo.addSearchItem({
    tip:'客户姓名',
    key: "name",
})
demo.addFieldItem({type: "index"})
demo.addFieldItem({label: "日期",prop: "date"})
demo.addFieldItem({label: "客户",prop: "name"})
demo.addFieldItem({label: "省份",prop: "province"})
demo.addFieldItem({label: "城市",prop: "city"})
demo.addFieldItem({label: "地址",prop: "address"})
demo.addFieldItem({label: "邮编",prop: "zip"})


import {queryOrderPage} from './api'

demo.bindActions('search/query',queryOrderPage)

export default {
    data() {
        return {
            instance:demo,
            config: demo.config,
            options:demo.options
        };
    },
    mounted() {
        window.demo = demo
    },
    components: {
        veContentRender,
    },
};
</script>

<style>
</style>