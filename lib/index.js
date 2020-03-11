"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const dayjs_1 = __importDefault(require("dayjs"));
const react_measure_1 = __importDefault(require("react-measure"));
class GitHubCalendar extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.monthLabelHeight = 15;
        this.weekLabelWidth = 15;
        this.panelSize = 11;
        this.panelMargin = 2;
        this.state = {
            columns: 53,
            maxWidth: 53
        };
    }
    getPanelPosition(row, col) {
        const bounds = this.panelSize + this.panelMargin;
        return {
            x: this.weekLabelWidth + bounds * row,
            y: this.monthLabelHeight + bounds * col
        };
    }
    makeCalendarData(history, lastDay, columns) {
        const d = dayjs_1.default(lastDay, { format: this.props.dateFormat });
        const lastWeekend = d.endOf('week');
        const endDate = d.endOf('day');
        var result = [];
        for (var i = 0; i < columns; i++) {
            result[i] = [];
            for (var j = 0; j < 7; j++) {
                var date = lastWeekend.subtract((columns - i - 1) * 7 + (6 - j), 'day');
                if (date <= endDate) {
                    result[i][j] = {
                        value: history[date.format(this.props.dateFormat)] || 0,
                        month: date.month()
                    };
                }
                else {
                    result[i][j] = null;
                }
            }
        }
        return result;
    }
    render() {
        const columns = this.state.columns;
        const values = this.props.values;
        const until = this.props.until;
        var contributions = this.makeCalendarData(values, until, columns);
        var innerDom = [];
        // panels
        for (var i = 0; i < columns; i++) {
            for (var j = 0; j < 7; j++) {
                var contribution = contributions[i][j];
                if (contribution === null)
                    continue;
                const pos = this.getPanelPosition(i, j);
                const color = this.props.panelColors[contribution.value];
                const dom = (react_1.default.createElement(this.props.wrapRectComponent, Object.assign({ key: `panel_key_${i}_${j}` }, this.props.wrapRectProps(contribution)),
                    react_1.default.createElement("rect", { x: pos.x, y: pos.y, width: this.panelSize, height: this.panelSize, fill: color })));
                innerDom.push(dom);
            }
        }
        // week texts
        for (var i = 0; i < this.props.weekNames.length; i++) {
            const textBasePos = this.getPanelPosition(0, i);
            const dom = (react_1.default.createElement("text", { key: 'week_key_' + i, style: {
                    fontSize: 9,
                    alignmentBaseline: 'central',
                    fill: '#AAA'
                }, x: textBasePos.x - this.panelSize / 2 - 2, y: textBasePos.y + this.panelSize / 2, textAnchor: 'middle' }, this.props.weekNames[i]));
            innerDom.push(dom);
        }
        // month texts
        var prevMonth = -1;
        for (var i = 0; i < columns; i++) {
            const c = contributions[i][0];
            if (c === null)
                continue;
            if (c.month != prevMonth) {
                var textBasePos = this.getPanelPosition(i, 0);
                innerDom.push(react_1.default.createElement("text", { key: 'month_key_' + i, style: {
                        fontSize: 10,
                        alignmentBaseline: 'central',
                        fill: '#AAA'
                    }, x: textBasePos.x + this.panelSize / 2, y: textBasePos.y - this.panelSize / 2 - 2, textAnchor: 'middle' }, this.props.monthNames[c.month]));
            }
            prevMonth = c.month;
        }
        return (react_1.default.createElement(react_measure_1.default, { bounds: true, onResize: (rect) => this.updateSize(rect.bounds) }, ({ measureRef }) => (react_1.default.createElement("div", { ref: measureRef, style: { width: "100%" } },
            react_1.default.createElement("svg", { style: {
                    fontFamily: 'Helvetica, arial, nimbussansl, liberationsans, freesans, clean, sans-serif',
                    width: '100%'
                }, height: "110" }, innerDom)))));
    }
    updateSize(size) {
        if (!size)
            return;
        const visibleWeeks = Math.floor((size.width - this.weekLabelWidth) / 13);
        this.setState({
            columns: Math.min(visibleWeeks, this.state.maxWidth)
        });
    }
}
exports.default = GitHubCalendar;
;
// @ts-ignore
GitHubCalendar.defaultProps = {
    weekNames: ['', 'M', '', 'W', '', 'F', ''],
    monthNames: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    panelColors: ['#EEE', '#DDD', '#AAA', '#444'],
    dateFormat: 'YYYY-MM-DD',
    wrapRectComponent: react_1.default.Fragment,
    wrapRectProps: () => ({})
};
