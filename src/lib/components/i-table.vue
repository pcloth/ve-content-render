<template>
    <el-table :data="tableData" stripe>
        <template v-for="(v, i) in fields">
            <el-table-column
                v-if="v.type === 'index'"
                :label="v.label || '序号'"
                type="index"
                :key="`${v.id}${i}`"
            >
            </el-table-column>
            <el-table-column
                v-else-if="v.type === 'expand'"
                type="expand"
                :key="`${v.id}${i}`"
            >
                <template slot-scope="{ row }">
                    <i-table-form :data="{ row, column: v }" />
                </template>
            </el-table-column>
            <el-table-column
                v-else
                :prop="v.prop"
                :label="v.label"
                :width="v.width || ''"
                :formatter="v.formatter"
                :show-overflow-tooltip="
                    v.showToolTip !== undefined ? v.showToolTip : true
                "
                :key="`${v.id}${i}`"
            >
                <!-- 标题栏控制 -->
                <template slot="header" v-if="v.header">
                    <template v-for="(head,k) in v.header">
                        <!-- 按钮插槽 -->
                        <el-button 
                            v-if="head.slot==='button'"
                            v-bind="head" 
                            :key="`${head.tip}${i}${k}`"
                            @click="head.callback"
                            >{{head.tip}}
                        </el-button>
                        <!-- 组件插槽 -->
                        <component v-else-if="head.slot==='component'" :is="v.component" :key="`${head.tip}${i}${k}`"/>
                        <!-- 标准按钮组 -->
                        <template v-else-if="head.slot==='default'">
                            <el-button-group :key="`${head.tip}${i}${k}`">
                                <el-button type="primary" icon="el-icon-plus" :title="head.title?`添加${head.title}`:'添加'"></el-button>
                                <el-button type="info" icon="el-icon-folder-opened" :title="head.title?`导出${head.title}`:'导出'"></el-button>
                            </el-button-group>
                        </template>
                    </template>
                </template>
                <!-- 单元格控制 -->
                <template slot-scope="scope">
                    <!-- 渲染函数内容 -->
                    <template v-if="v.render">
                        <i-render
                            :row="scope.row"
                            :column="scope.column"
                            :index="i"
                            :no="scope.$index"
                            :render="v.render || null"
                        />
                    </template>
                    <!-- 组件渲染 -->
                    <component v-else-if="v.slot==='component'" :is="v.component" v-bind="v.props" :key="v.id"/>
                    <!-- 普通单元格，可格式化、自定义style -->
                    <template v-else>
                        <span
                            :style="v.style && v.style(scope)"
                            class="cell el-tooltip"
                        >
                            {{
                                !v.render
                                    ? v.formatter
                                        ? v.formatter(
                                              scope.row,
                                              scope.column,
                                              scope.row[
                                                  (scope.column || {}).property
                                              ]
                                          )
                                        : scope.row[
                                              (scope.column || {}).property
                                          ]
                                    : ""
                            }}
                        </span>
                    </template>
                </template>
            </el-table-column>
        </template>
    </el-table>
</template>

<script>
import iTableForm from "./i-table-form";
import iRender from "./i-render";
import {uid} from "../func";

export default {
    components: {
        iTableForm,
        iRender,
    },
    props: {
        fields: {
            type: Array,
            default() {
                return [];
            },
        },
        tableData: {
            type: Array,
            default() {
                return [];
            },
        },
    },
    data() {
        return {
            ownKey: new Date(),
        };
    },
    methods: {
        uid
    }
};
</script>

<style>
</style>