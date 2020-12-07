<template>
    <!-- <sticky
        :z-index="10"
        class-name="sub-navbar draft"
        v-if="searchItem.length"
    > -->
    <div :class="className.search">
        <el-form class="filter-box ve-content-render-search" >
            <template v-for="(v, k) in searchItem">
                <!-- 普通输入框 -->
                <el-input
                    v-if="!v.slot||v.slot==='input'"
                    :clearable="v.clearable"
                    :key="v.id"
                    :placeholder="v.tip"
                    v-model.trim="v.val"
                    v-bind="v.props"
                    :style="{ width: `${v.width ? v.width : searchOption.itemWidth}px` }"
                />
                <!-- 选择框 -->
                <el-select
                    v-else-if="v.slot ==='select'"
                    :key="v.id"
                    :clearable="v.clearable"
                    v-model="v.val"
                    :mode="v.multiple ? 'multiple' : ''"
                    :placeholder="v.tip"
                    v-bind="v.props"
                    :style="{
                        minWidth: `${v.width ? v.width : searchOption.itemWidth+30}px`,
                        width: v.multiple ? 'initial' : `${v.width ? v.width : searchOption.itemWidth+30}px`
                    }"
                >
                    <el-option v-for="(o,i) in v.options" :label="o.label" :value="o.value" :key="`${o.value}${k}${i}`"/>
                </el-select>
                <!-- 日期选择器 -->
                <el-date-picker
                    v-else-if="v.slot ==='date-picker'"
                    :key="v.id"
                    v-model="v.val"
                    v-bind="v.props">
                </el-date-picker>
                <!-- 自定义组件插入 -->
                <component 
                    v-else-if="v.slot==='component'" 
                    :i-content-params="v.label"  
                    v-model="v.val"  
                    :key="`${v.id}${k}`" 
                    :is="v.component"
                />
            </template>
            <el-button 
                v-if="searchOption.showSearchButton" 
                v-loading="loading" 
                @click="handleSearch" 
                v-bind="searchOption.buttonProps"
            >搜索
            </el-button>
            <!-- 扩展按钮 -->
            <template v-for="btn in expandButtons">
                <el-button v-bind="btn.props" v-if="btn.callback" :key="btn.id" @click="btn.callback(btn)">{{btn.tip}}</el-button>
                <el-button v-bind="btn.props" v-else :key="btn.id" @click="handleSearchExBtn(btn)">{{btn.tip}}</el-button>
            </template>
        </el-form>
    <!-- </sticky> -->
    </div>
</template>

<script>
import sticky from "./sticky";

export default {
    components: {
        sticky,
    },
    props: {
        searchItem: {
            type: Array,
            default() {
                return [];
            },
        },
        searchOption:{
            type:Object,
            default(){
                return {}
            }
        },
        expandButtons: {
            type: Array,
            default() {
                return [];
            },
        },
        className:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    data() {
        return {
            ownKey: new Date(),
            loading: false,
        };
    },
    methods: {
        hasVal(val) {
            return (val || val == 0) && String(val).length > 0;
        },
        parseSearchParams() {
            // 解析搜索参数
            const data = [...this.searchItem];
            // 叠加其他参数
            let obj = Object.assign({}, {});
            data.forEach((v) => {
                if (this.hasVal(v.val)) {
                    if (Array.isArray(v.key)) {
                        v.key.forEach((k, i) => {
                            obj[k] = v.val[i];
                        });
                    } else {
                        // 如果参数里面有默认值或者默认值是一个方法，执行它。
                        obj[v.key] =
                            v.val ||
                            (v.default && typeof v.default === "function"
                                ? v.default()
                                : v.default || v.val);
                    }
                }
                if (v.required && !this.hasVal(obj[v.key])) {
                    try {
                        this.$message.warning(`${v.tip} 必须填写才能查询`);
                        throw new Error(`search 组件 ${v.tip} 参数缺失`);
                    } catch (error) {
                        obj = null;
                        console.warn(`search 组件 ${v.tip} 参数缺失`);
                    }
                }
            });
            return obj
        },
        handleSearch() {
            let params = this.parseSearchParams();
            console.log("搜索按钮触发", params);
            params && this.$emit("search", params);
        },
        handleSearchExBtn(btn){
            console.log(3333,btn)
            this.$emit('search-expand-button-click',btn)
            
        }
    },
};
</script>

<style>
</style>