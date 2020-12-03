export default {
    name: 'i-render',
    functional: true,
    provide() {
        return {
        indexPage: this.indexPage || {}
        };
    },
    inject: {
        indexPage: {
        from: 'indexPage',
        default: {}
        }
    },
    props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
        type: Object,
        default: null
        },
        no: {
        type: Number
        },
        that:Object, // 接受父组件
    },
    render: (h, ctx) => {
        const row = ctx.props.row;
        let column = ctx.props.column || {};
        let veContentRender = ctx.props.that.$parent;
        return ctx.props.render(h, ctx, row,veContentRender);
    }
};
