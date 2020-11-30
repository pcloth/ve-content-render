<template>
    <sticky
        :z-index="10"
        class-name="sub-navbar draft"
        v-if="searchItem.length"
    >
        <el-form class="filter-box ve-content-render-search">
            <template v-for="(v, k) in searchItem">
                <el-input
                    v-if="!v.slot||v.slot==='input'"
                    :clearable="v.clearable"
                    :key="v.id"
                    :placeholder="v.tip"
                    v-model.trim="v.val"
                    :style="{ width: `${v.width ? v.width : itemWidth}px` }"
                />
                <el-select
                    v-else-if="v.slot ==='select'"
                    :key="v.id"
                    :clearable="v.clearable"
                    v-model="v.val"
                    :mode="v.multiple ? 'multiple' : ''"
                    :placeholder="v.tip"
                    :style="{
                        minWidth: `${v.width ? v.width : itemWidth+30}px`,
                        width: v.multiple ? 'initial' : `${v.width ? v.width : itemWidth+30}px`
                    }"
                >
                    <el-option v-for="(o,i) in v.options" :label="o.label" :value="o.value" :key="`${o.value}${k}${i}`"/>
                </el-select>
                <!-- 自定义组件插入 -->
                <component 
                    v-else-if="v.slot==='component'" 
                    :i-content-params="v.label"  
                    v-model="v.val"  
                    :key="`${v.id}${k}`" 
                    :is="v.component"
                />
            </template>
            <el-button v-loading="loading" type="primary" @click="handleSearch"
                >搜索</el-button
            >
        </el-form>
    </sticky>
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
        itemWidth: {
            // 单独选项默认宽度
            type: Number,
            default: 100,
        },
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
    },
};
</script>

<style>
</style>