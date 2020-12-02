## 通用内容页面渲染

### 参数处理
config和options将全部绑定在类实例上。
```js
import { ContentPageClass } from "@/components/ve-content-render/indexClass.js";

let obj = new ContentPageClass();

obj.addSearchItem({
    slot:'select',
    options:[{label:'A类',value:'A'},{label:'B类',value:'b'}],
  tip: "下拉示例",
  key: "type",
});

obj.addFieldItemList([
  {
    label: "日期",
    prop: "date",
    formatter(row, col, value) {
      // console.log(row,col,value)
      return value + " ^_^";
    },
  },
  { label: "客户", prop: "name" },
  { label: "省份", prop: "province" },
  { label: "城市", prop: "city" },
  { label: "地址", prop: "address" },
  { label: "邮编", prop: "zip" },
]);
obj.addFieldItem({
  label: "操作",
  slot: "default",
});

obj.addToolbar("top", {
  slot: "default",
});

export default obj;

```

### 类方法
| 方法 | 参数和类型 | 说明 |
|---|---|---|
|getOptions|String type, Stringkey | 获取参数信息 |
|addOptions|String type,String key,value | 添加参数信息 |
|responseGetPath|String spaceName, Object response | 从response 上获取数据或者记录总数 |
|addSearchItem|Object data | 添加一个搜索栏目 |
|addSearchItemList | Array data | 批量添加搜索栏目 |
|addToolbar | pos = 'top', data = { slot: 'default' } | 添加工具条内容，pos可以是top和buttom,表示两个不同位置的工具条 |
|addToolbarList|pos = 'top', arr | 批量添加工具条内容 |
|addFieldItem | Object data | 添加表格字段 |
|addFieldItemList | Array data | 批量添加表格字段 |
|bindActions | String spaceName,Function func | 绑定一个方法 |
|dispatch| String spaceName, Object data | 执行一个方法 |



#### addSearchItem 搜索栏配置项目
| 参数 | 类型 | 名称 | 默认值 | 说明 |
|---|---|---|---|---|
|slot|string| 组件插槽类型 | input | 搜索项目的类型，目前支持input,select,date-picker,component (自定义组件) |
|id|string| (自动生成) | 唯一标识，用于v-for渲染加速或者后期定位数据用 |
|val| - | - | - | 用户输入内容v-model到组件上的对象 |
|tip| string | - | - | 输入框绑定到placeholder上的值 |
|props| object | - | - | 绑定到element-ui组件上的参数 |



#### addFieldItem 表格栏：单元格参数
| 参数 | 类型 | 名称 | 默认值 | 说明 |
|---|---|---|---|---|
|type|string|单元格类型| - | 目前支持标准单元格、index=序号字段、selection=可选框字段、expand=点击展开字段 |
|header|array|单元格表头控制| - | 用来控制单元格表头（下列几行数据说明） |
| - | string | slot | - | 组件插槽类型，目前支持button、component、default（默认按键组） |
| - | props | slot | - | 传递给button的参数 |
|slot|string| 组件插槽类型 | input | 搜索项目的类型，目前支持input,select,date-picker,component (自定义组件) |