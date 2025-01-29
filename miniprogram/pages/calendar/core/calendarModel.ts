export interface Holiday {
  name: string;
  type: 'holiday' | 'workday';
  region: 'CN' | 'JP';
}

export interface DayItem {
  date: string;      // YYYY-MM-DD
  day: number;       // 日期数字
  current: boolean;  // 是否当前月份
  today: boolean;    // 是否今天
  selected: boolean; // 是否选中
  festivals: Holiday[];
}

export interface CalendarSettings {
  showCN: boolean;
  showJP: boolean;
} 