import { Holiday, DayItem, CalendarSettings } from './calendarModel';
import { holidayData } from '../../../utils/holidays';

export class CalendarService {
  private static DEFAULT_SETTINGS: CalendarSettings = {
    showCN: true,
    showJP: false
  };

  /**
   * 格式化日期为YYYY-MM-DD格式
   */
  static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * 根据设置过滤节假日
   */
  static filterFestivals(festivals: Holiday[], settings: CalendarSettings): Holiday[] {
    return festivals.filter(festival => 
      (festival.region === 'CN' && settings.showCN) || 
      (festival.region === 'JP' && settings.showJP)
    );
  }

  /**
   * 计算指定年月的日历数据
   */
  static calculateDays(year: number, month: number, settings: CalendarSettings, selectedDate: string): DayItem[] {
    const days: DayItem[] = [];
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const prevLastDay = new Date(year, month - 1, 0);
    const today = new Date();
    const todayStr = this.formatDate(today);

    // 填充上个月的日期
    for (let i = firstDay.getDay(); i > 0; i--) {
      const day = prevLastDay.getDate() - i + 1;
      const date = new Date(year, month - 2, day);
      const dateStr = this.formatDate(date);
      days.push(this.createDayItem(dateStr, day, false, todayStr, selectedDate, settings));
    }

    // 填充当前月的日期
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month - 1, day);
      const dateStr = this.formatDate(date);
      days.push(this.createDayItem(dateStr, day, true, todayStr, selectedDate, settings));
    }

    // 填充下个月的日期
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month, day);
      const dateStr = this.formatDate(date);
      days.push(this.createDayItem(dateStr, day, false, todayStr, selectedDate, settings));
    }

    return days;
  }

  /**
   * 创建单个日期项
   */
  private static createDayItem(
    dateStr: string, 
    day: number, 
    current: boolean, 
    todayStr: string, 
    selectedDate: string,
    settings: CalendarSettings
  ): DayItem {
    return {
      date: dateStr,
      day,
      current,
      today: dateStr === todayStr,
      selected: dateStr === selectedDate,
      festivals: this.filterFestivals(holidayData[dateStr] || [], settings)
    };
  }

  /**
   * 获取默认设置
   */
  static getDefaultSettings(): CalendarSettings {
    return {
      showCN: wx.getStorageSync('holidayFilterCN') || this.DEFAULT_SETTINGS.showCN,
      showJP: wx.getStorageSync('holidayFilterJP') || this.DEFAULT_SETTINGS.showJP
    };
  }

  /**
   * 保存设置
   */
  static saveSettings(settings: CalendarSettings): void {
    wx.setStorageSync('holidayFilterCN', settings.showCN);
    wx.setStorageSync('holidayFilterJP', settings.showJP);
  }

  /**
   * 获取分享信息
   */
  static getShareInfo(year: number, month: number, settings: CalendarSettings) {
    return {
      title: `查看${year}年${month}月假日安排`,
      path: `/pages/calendar/calendar?year=${year}&month=${month}&cn=${settings.showCN ? 1 : 0}&jp=${settings.showJP ? 1 : 0}`,
      imageUrl: '/images/calendar.png'
    };
  }
} 
