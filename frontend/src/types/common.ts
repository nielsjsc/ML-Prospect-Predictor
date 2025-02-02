export enum LoadingState {
    IDLE = 'idle',
    LOADING = 'loading',
    SUCCESS = 'success',
    ERROR = 'error'
}

export interface ApiResponse<T> {
    data: T;
    error?: string;
    status: LoadingState;
}

export interface TableColumn {
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
    width?: string;
    format?: (value: any) => string;
}

export interface ChartConfig {
    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
    tooltipFormat?: (value: any) => string;
}

export interface NotificationState {
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

export type StatDisplay = {
    label: string;
    value: string | number;
    tooltip?: string;
    color?: string;
};