import { Holiday, DayItem, CalendarSettings, UpcomingHoliday } from './calendarModel';
import { holidayData } from '../../../utils/holidays';

export class CalendarService {
  private static readonly baseUrl = 'https://cg-zhou.top/api/holidays';
  private static readonly cacheAge = 24 * 60 * 60 * 1000;
  private static readonly pending: Record<string, Promise<boolean> | undefined> = {};
  private static readonly attempted: Record<string, number> = {};
  private static readonly sources: Record<string, { source: string; time?: number }> = {};

  static getDataSource(year: number, region: 'CN' | 'JP'): string {
    const info = this.sources[`${region}-${year}`];
    if (!info) return `${region}：本地内置（更新时间未知）`;
    if (!info.time) return `${region}：${info.source}（更新时间未知）`;
    const date = new Date(info.time);
    const time = `${this.formatDate(date)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    return `${region}：${info.source} · 更新于 ${time}`;
  }

  private static request(url: string): Promise<any> {
    return new Promise((resolve, reject) => wx.request({
      url, timeout: 10000,
      success: result => result.statusCode === 200 ? resolve(result.data) : reject(new Error(`HTTP ${result.statusCode}`)),
      fail: reject
    }));
  }

  static async getYearRange(): Promise<{ min: number; max: number }> {
    const fallback = { min: 2002, max: 2026 };
    const key = 'holiday-index-v1';
    let data: any;
    try {
      data = await this.request(`${this.baseUrl}/index.json`);
      const regions = data && Array.isArray(data.regions) ? data.regions : [];
      const cn = regions.find((item: any) => item.name === 'CN');
      const jp = regions.find((item: any) => item.name === 'JP');
      if (!cn || !jp || ![cn.startYear, cn.endYear, jp.startYear, jp.endYear].every(Number.isInteger)) throw new Error('Invalid index');
      const range = { min: Math.max(cn.startYear, jp.startYear, 1900), max: Math.min(cn.endYear, jp.endYear, 2100) };
      if (range.min > range.max) throw new Error('Invalid range');
      try { wx.setStorageSync(key, range); } catch (_) { /* Storage is optional. */ }
      return range;
    } catch (_) {
      try {
        const cached = wx.getStorageSync(key);
        if (cached && Number.isInteger(cached.min) && Number.isInteger(cached.max) && cached.min >= 1900 && cached.max <= 2100 && cached.min <= cached.max) return cached;
      } catch (_) { /* Use bundled range. */ }
      return fallback;
    }
  }

  static loadYear(year: number, region: 'CN' | 'JP'): Promise<boolean> {
    if (year < 1900 || year > 2100) return Promise.resolve(false);
    const key = `holiday-data-v1-${region}-${year}`;
    const pending = this.pending[key];
    if (pending) return pending;
    if (Date.now() - (this.attempted[key] || 0) < this.cacheAge) return Promise.resolve(false);
    this.attempted[key] = Date.now();
    let cached: any;
    try { cached = wx.getStorageSync(key); } catch (_) { /* Storage is optional. */ }
    let restored = false;
    if (cached && this.applyYear(cached.data, year, region)) {
      restored = true;
      this.sources[`${region}-${year}`] = { source: '本地缓存', time: typeof cached.time === 'number' ? cached.time : undefined };
    }
    if (restored && typeof cached.time === 'number' && Date.now() - cached.time < this.cacheAge) return Promise.resolve(true);
    this.pending[key] = this.request(`${this.baseUrl}/${region}/${year}.json`).then(data => {
      if (!this.applyYear(data, year, region)) throw new Error('Invalid holiday data');
      const time = Date.now();
      this.sources[`${region}-${year}`] = { source: '接口', time };
      try { wx.setStorageSync(key, { time, data }); } catch (_) { /* Storage is optional. */ }
      return true;
    }).catch(() => {
      // Retry later in the same session after a temporary failure.
      this.attempted[key] = Date.now() - this.cacheAge + 60000;
      return restored;
    }).then(changed => {
      delete this.pending[key];
      return changed;
    });
    return this.pending[key];
  }

  private static applyYear(data: any, year: number, region: 'CN' | 'JP'): boolean {
    if (!data || data.year !== year || data.region !== region || !Array.isArray(data.dates) ||
        !data.dates.every((item: any) => item && typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && item.date.startsWith(`${year}-`) &&
          (item.type === 'public_holiday' || item.type === 'transfer_workday') && typeof (item.name_cn || item.name) === 'string')) return false;
    for (const date of Object.keys(holidayData)) {
      if (date.startsWith(`${year}-`)) holidayData[date] = holidayData[date].filter(item => item.region !== region);
    }
    for (const item of data.dates) {
      if (!holidayData[item.date]) holidayData[item.date] = [];
      holidayData[item.date].push({ date: item.date, name: item.name_cn || item.name, type: item.type === 'public_holiday' ? 'holiday' : 'workday', region });
    }
    return true;
  }
  private static DEFAULT_SETTINGS: CalendarSettings = {
    showCN: true,
    showJP: true
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
    const storedCN = wx.getStorageSync('holidayFilterCN');
    const storedJP = wx.getStorageSync('holidayFilterJP');

    return {
      showCN: typeof storedCN === 'boolean' ? storedCN : this.DEFAULT_SETTINGS.showCN,
      showJP: typeof storedJP === 'boolean' ? storedJP : this.DEFAULT_SETTINGS.showJP
    };
  }

  static getFestivals(date: string, settings: CalendarSettings): Holiday[] {
    return this.filterFestivals(holidayData[date] || [], settings);
  }

  static getUpcomingHolidays(fromDate: string, settings: CalendarSettings, limit = 5): UpcomingHoliday[] {
    const from = this.parseDate(fromDate);
    const upcoming: UpcomingHoliday[] = [];

    for (const date of Object.keys(holidayData).sort()) {
      if (date < fromDate) continue;

      const holidays = this.getFestivals(date, settings).filter(item => item.type === 'holiday');
      for (const holiday of holidays) {
        const current = this.parseDate(date);
        const previous = new Date(current);
        previous.setDate(previous.getDate() - 1);
        const isContinuation = this.getFestivals(this.formatDate(previous), settings).some(item =>
          item.type === 'holiday' && item.region === holiday.region && item.name === holiday.name
        );
        if (isContinuation) continue;

        upcoming.push({
          ...holiday,
          key: `${date}-${holiday.region}-${holiday.name}`,
          date,
          daysUntil: Math.round((current.getTime() - from.getTime()) / 86400000)
        });
        if (upcoming.length >= limit) return upcoming;
      }
    }

    return upcoming;
  }

  private static parseDate(date: string): Date {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day);
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
