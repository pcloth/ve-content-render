<template>
    <el-form label-position="left" inline class="table-expand-form">
        <el-form-item
            class="table-expand-form-cell"
            v-for="(i, index) in expandFields"
            :label="`${i.label}:`"
            :key="i.prop"
            :prop="i.prop"
        >
            <div class="other-row">
                <template v-if="i.formatter">{{
                    i.formatter(data.row, i)
                }}</template>
                <template v-else>{{ data.row[i.prop] }}</template>
            </div>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: "i-table-form",
    props: {
        data: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    inject: ["main"],
    computed: {
        expandFields() {
            const arr = this.data.column.expandFields.filter((item) => {
                console.log(item,'>>',this.data.row)
                return !item.hide || !item.hide(this.data.row);
            });
            return arr;
        },
    },
    created() {
        // console.log(this.data);
    },
};
</script>

<style lang="scss">
.table-expand-form {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .el-form {
        padding: 0;
    }
    &-cell {
        flex: 0 0 23%;
        margin: 10px 0 10px;
        & > label {
            display: block;
            color: #b9b9b9;
        }
        .el-table__expanded-cell[class*="cell"] {
            padding: 10px 50px;
        }
        & > .el-form-item__content {
            line-height: 1;
            display: block;
        }
        .el-form-item {
            margin-bottom: 0;
        }
    }
}
</style>
