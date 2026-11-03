import { CalendarService } from './core/calendarService';
import { Holiday, CalendarSettings, UpcomingHoliday } from './core/calendarModel';
import { buildTime } from '../../utils/buildInfo';

const MIN_DATA_YEAR = 2002;
const MAX_DATA_YEAR = 2026;

interface DayItem {
  date: string;      // YYYY-MM-DD
  day: number;       // 日期数字
  current: boolean;  // 是否当前月份
  today: boolean;    // 是否今天
  selected: boolean; // 是否选中
  festivals: Holiday[];
}

interface CalendarPanel {
  key: string;
  year: number;
  month: number;
  days: DayItem[];
}

Component({
  data: {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    calendarPanels: [] as CalendarPanel[],
    swiperCurrent: 1,
    selectedDate: '',
    selectedFestivals: [] as Holiday[],
    upcomingHolidays: [] as UpcomingHoliday[],
    buildTime,
    apiStatus: 'checking',
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    years: [] as number[],
    months: Array.from({ length: 12 }, (_, i) => i + 1),
    yearIndex: 0,
    showCN: true,
    showJP: true,
    isSettingPanelVisible: false
  },

  lifetimes: {
    attached() {
      // 只开放中日节假日数据都有完整覆盖的年份
      const years: number[] = []
      for (let i = MIN_DATA_YEAR; i <= MAX_DATA_YEAR; i++) {
        years.push(i)
      }

      // 设置年份数组和当前年份索引
      const currentYear = new Date().getFullYear()
      const yearIndex = years.indexOf(currentYear)
      const settings = CalendarService.getDefaultSettings();

      this.setData({
        years,
        yearIndex,
        showCN: settings.showCN,
        showJP: settings.showJP
      }, () => {
        // 初始化当前日期
        this.initCalendar()
      })
      CalendarService.getYearRange().then(range => {
        const updatedYears = Array.from({ length: range.max - range.min + 1 }, (_, index) => range.min + index);
        const year = Math.min(Math.max(this.data.year, range.min), range.max);
        this.setData({ years: updatedYears, year, yearIndex: updatedYears.indexOf(year), apiStatus: range.online ? 'online' : 'offline' }, () => this.calculateDays());
      });
    }
  },

  pageLifetimes: {
    // 添加 pageLifetimes 处理页面加载
    show() {
      // 获取页面参数
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const options = currentPage?.options || {}
      const { year, month, cn, jp } = options

      const updates: Record<string, number | boolean> = {}
      if (year && month) {
        const sharedYear = Number(year)
        const sharedMonth = Number(month)
        if (Number.isInteger(sharedYear) && Number.isInteger(sharedMonth) && sharedMonth >= 1 && sharedMonth <= 12) {
          updates.year = Math.min(Math.max(sharedYear, 1900), 2100)
          updates.month = sharedMonth
          updates.yearIndex = this.data.years.indexOf(updates.year as number)
        }
      }

      let settings: CalendarSettings | undefined
      if (cn !== undefined || jp !== undefined) {
        settings = {
          showCN: cn === undefined ? this.data.showCN : cn !== '0',
          showJP: jp === undefined ? this.data.showJP : jp !== '0'
        }
        updates.showCN = settings.showCN
        updates.showJP = settings.showJP
      }

      if (Object.keys(updates).length > 0) {
        this.setData(updates, () => this.calculateDays())
      }
      if (settings) {
        CalendarService.saveSettings(settings)
      }
    }
  },

  methods: {
    initCalendar() {
      const now = new Date()
      const year = Math.min(Math.max(now.getFullYear(), this.data.years[0]), this.data.years[this.data.years.length - 1])
      this.setData({
        year,
        yearIndex: this.data.years.indexOf(year),
        month: now.getMonth() + 1,
        selectedDate: CalendarService.formatDate(now)
      }, () => this.calculateDays())
    },

    calculateDays() {
      const { year, month, selectedDate, showCN, showJP, swiperCurrent } = this.data;
      const currentYear = new Date().getFullYear();
      const yearsToLoad = Array.from(new Set([year - 1, year, year + 1, currentYear, currentYear + 1]));
      Promise.all(yearsToLoad.reduce((requests: Promise<boolean>[], targetYear) => {
        requests.push(CalendarService.loadYear(targetYear, 'CN'), CalendarService.loadYear(targetYear, 'JP'));
        return requests;
      }, [])).then(results => {
        if (results.some(Boolean)) this.calculateDays();
      });
      const settings: CalendarSettings = { showCN, showJP };
      const prevMonth = this.getShiftedMonth(year, month, -1);
      const nextMonth = this.getShiftedMonth(year, month, 1);
      const days = CalendarService.calculateDays(year, month, settings, selectedDate);
      const selectedDay = days.find(day => day.date === selectedDate);
      const selectedFestivals = selectedDay?.festivals || [];
      const now = new Date();
      const todayDate = CalendarService.formatDate(now);
      const upcomingHolidays = CalendarService.getUpcomingHolidays(todayDate, settings);
      const calendarPanels: CalendarPanel[] = [
        { key: '0', year, month, days: [] },
        { key: '1', year, month, days: [] },
        { key: '2', year, month, days: [] }
      ];

      calendarPanels[swiperCurrent] = { key: String(swiperCurrent), year, month, days };
      const prevIndex = (swiperCurrent + 2) % 3;
      const nextIndex = (swiperCurrent + 1) % 3;
      calendarPanels[prevIndex] = {
        key: String(prevIndex),
        ...prevMonth,
        days: CalendarService.calculateDays(prevMonth.year, prevMonth.month, settings, selectedDate)
      };
      calendarPanels[nextIndex] = {
        key: String(nextIndex),
        ...nextMonth,
        days: CalendarService.calculateDays(nextMonth.year, nextMonth.month, settings, selectedDate)
      };

      this.setData({
        calendarPanels,
        selectedFestivals,
        upcomingHolidays
      });
    },

    getShiftedMonth(year: number, month: number, offset: number) {
      const date = new Date(year, month - 1 + offset, 1);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1
      };
    },

    onYearChange(e: any) {
      const year = this.data.years[e.detail.value];
      this.setData({
        year,
        yearIndex: e.detail.value
      }, () => {
        this.calculateDays();
      });
    },

    onMonthChange(e: any) {
      const month = this.data.months[e.detail.value];
      this.setData({
        month
      }, () => {
        this.calculateDays();
      });
    },

    changeMonth(offset: number, animate: boolean = false) {
      const { year, month } = this.data;
      let newYear = year;
      let newMonth = month + offset;

      if (newMonth < 1) {
        newYear -= 1;
        newMonth = 12;
      } else if (newMonth > 12) {
        newYear += 1;
        newMonth = 1;
      }

      const minYear = this.data.years[0];
      const maxYear = this.data.years[this.data.years.length - 1];
      if (newYear < minYear || newYear > maxYear) {
        wx.showToast({ title: `仅支持${minYear}-${maxYear}年`, icon: 'none' });
        return;
      }

      if (animate) {
        const swiperCurrent = (this.data.swiperCurrent + (offset > 0 ? 1 : 2)) % 3;
        this.setData({
          year: newYear,
          month: newMonth,
          yearIndex: this.data.years.indexOf(newYear),
          swiperCurrent
        }, () => this.calculateDays());
      } else {
        this.setData({
          year: newYear,
          month: newMonth,
          yearIndex: this.data.years.indexOf(newYear)
        }, () => this.calculateDays());
      }
    },

    prevMonth() {
      this.changeMonth(-1, true);
    },

    nextMonth() {
      this.changeMonth(1, true);
    },

    selectDate(e: any) {
      const { date } = e.currentTarget.dataset;
      this.setData({
        selectedDate: date
      }, () => this.calculateDays());
    },

    selectUpcomingHoliday(e: any) {
      const { date } = e.currentTarget.dataset;
      const [year, month] = date.split('-').map(Number);
      if (!this.data.years.includes(year)) return;
      this.setData({
        year,
        month,
        yearIndex: this.data.years.indexOf(year),
        selectedDate: date
      }, () => this.calculateDays());
    },

    goToday() {
      const now = new Date();
      const year = Math.min(Math.max(now.getFullYear(), this.data.years[0]), this.data.years[this.data.years.length - 1]);
      const month = now.getMonth() + 1;
      const dateStr = CalendarService.formatDate(now);

      this.setData({
        year,
        month,
        yearIndex: this.data.years.indexOf(year),
        selectedDate: dateStr
      }, () => {
        this.calculateDays();
      });
    },

    // 添加分享给好友功能
    onShareAppMessage() {
      const settings: CalendarSettings = {
        showCN: this.data.showCN,
        showJP: this.data.showJP
      };
      return CalendarService.getShareInfo(this.data.year, this.data.month, settings);
    },

    onSwiperChange(e: any) {
      const nextIndex = e.detail.current;
      const currentIndex = this.data.swiperCurrent;
      if (nextIndex === currentIndex) return;

      const offset = nextIndex === (currentIndex + 1) % 3 ? 1 : -1;
      const target = this.getShiftedMonth(this.data.year, this.data.month, offset);
      const minYear = this.data.years[0];
      const maxYear = this.data.years[this.data.years.length - 1];
      if (target.year < minYear || target.year > maxYear) {
        wx.showToast({ title: `仅支持${minYear}-${maxYear}年`, icon: 'none' });
        this.setData({ swiperCurrent: currentIndex });
        return;
      }
      this.setData({
        year: target.year,
        month: target.month,
        yearIndex: this.data.years.indexOf(target.year),
        swiperCurrent: nextIndex
      }, () => this.calculateDays());
    },

    toggleSettings() {
      this.setData({
        isSettingPanelVisible: !this.data.isSettingPanelVisible
      });
    },

    toggleCN(e: any) {
      const showCN = e.detail.value;
      const settings: CalendarSettings = {
        showCN,
        showJP: this.data.showJP
      };
      
      this.setData({ showCN }, () => {
        CalendarService.saveSettings(settings);
        this.calculateDays();
      });
    },

    toggleJP(e: any) {
      const showJP = e.detail.value;
      const settings: CalendarSettings = {
        showCN: this.data.showCN,
        showJP
      };
      
      this.setData({ showJP }, () => {
        CalendarService.saveSettings(settings);
        this.calculateDays();
      });
    }
  }
})
