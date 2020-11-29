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
        }
    },
    render: (h, ctx) => {
        const row = ctx.props.row;
        const index = ctx.props.index;
        const no = ctx.props.no;
        let column = ctx.props.column || {};
        return ctx.props.render(h, ctx, row, column, index, no);
    }
};
