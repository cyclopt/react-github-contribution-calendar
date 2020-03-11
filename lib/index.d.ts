import React from 'react';
import { BoundingRect } from 'react-measure';
interface Props {
    weekNames: string[];
    monthNames: string[];
    panelColors: string[];
    values: {
        [date: string]: number;
    };
    until: string;
    dateFormat: string;
    wrapRectComponent: React.ComponentType;
    wrapRectProps: Function;
}
interface State {
    columns: number;
    maxWidth: number;
}
export default class GitHubCalendar extends React.Component<Props, State> {
    monthLabelHeight: number;
    weekLabelWidth: number;
    panelSize: number;
    panelMargin: number;
    constructor(props: any);
    getPanelPosition(row: number, col: number): {
        x: number;
        y: number;
    };
    makeCalendarData(history: {
        [k: string]: number;
    }, lastDay: string, columns: number): ({
        value: number;
        month: number;
    } | null)[][];
    render(): JSX.Element;
    updateSize(size?: BoundingRect): void;
}
export {};
