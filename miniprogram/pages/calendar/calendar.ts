import { holidayData } from '../../utils/holidays'

interface Holiday {
  name: string;
  type: 'holiday' | 'workday';
}

interface DayItem {
  date: string;      // YYYY-MM-DD
  day: number;       // 日期数字
  current: boolean;  // 是否当前月份
  today: boolean;    // 是否今天
  selected: boolean; // 是否选中
  festivals: Holiday[];
}

Component({
  data: {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    days: [] as DayItem[],
    selectedDate: '',
    selectedFestivals: [] as Holiday[],
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    years: [] as number[],
    months: Array.from({ length: 12 }, (_, i) => i + 1),
    yearIndex: 0
  },

  lifetimes: {
    attached() {
      // 生成年份数组（1900-2050）
      const years: number[] = []
      for (let i = 1900; i <= 2050; i++) {
        years.push(i)
      }

      // 设置年份数组和当前年份索引
      const currentYear = new Date().getFullYear()
      const yearIndex = years.indexOf(currentYear)

      this.setData({
        years,
        yearIndex
      })

      // 初始化当前日期
      this.initCalendar()
    }
  },

  pageLifetimes: {
    // 添加 pageLifetimes 处理页面加载
    show() {
      // 获取页面参数
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const options = currentPage?.options || {}
      const { year, month } = options

      // 如果有分享参数，则跳转到对应年月
      if (year && month) {
        this.setData({
          year: parseInt(year),
          month: parseInt(month)
        }, () => {
          this.calculateDays()
        })
      }
    }
  },

  methods: {
    initCalendar() {
      const now = new Date()
      this.setData({
        year: now.getFullYear(),
        month: now.getMonth() + 1
      })
      this.calculateDays()
    },

    formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    calculateDays() {
      const { year, month } = this.data;
      const days: DayItem[] = [];
      
      // 获取当前月的第一天
      const firstDay = new Date(year, month - 1, 1);
      // 获取当前月的最后一天
      const lastDay = new Date(year, month, 0);
      // 获取上个月的最后一天
      const prevLastDay = new Date(year, month - 1, 0);
      
      // 获取当前日期
      const today = new Date();
      const todayStr = this.formatDate(today);
      
      // 填充上个月的日期
      for (let i = firstDay.getDay(); i > 0; i--) {
        const day = prevLastDay.getDate() - i + 1;
        const date = new Date(year, month - 2, day);
        const dateStr = this.formatDate(date);
        days.push({
          date: dateStr,
          day,
          current: false,
          today: dateStr === todayStr,
          selected: dateStr === this.data.selectedDate,
          festivals: holidayData[dateStr] || []
        });
      }
      
      // 填充当前月的日期
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month - 1, day);
        const dateStr = this.formatDate(date);
        days.push({
          date: dateStr,
          day,
          current: true,
          today: dateStr === todayStr,
          selected: dateStr === this.data.selectedDate,
          festivals: holidayData[dateStr] || []
        });
      }
      
      // 填充下个月的日期
      const remainingDays = 42 - days.length; // 保持6行
      for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(year, month, day);
        const dateStr = this.formatDate(date);
        days.push({
          date: dateStr,
          day,
          current: false,
          today: dateStr === todayStr,
          selected: dateStr === this.data.selectedDate,
          festivals: holidayData[dateStr] || []
        });
      }
      
      this.setData({ days });
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

    prevMonth() {
      const { year, month } = this.data;
      if (month === 1) {
        this.setData({
          year: year - 1,
          month: 12
        }, () => {
          this.calculateDays();
        });
      } else {
        this.setData({
          month: month - 1
        }, () => {
          this.calculateDays();
        });
      }
    },

    nextMonth() {
      const { year, month } = this.data;
      if (month === 12) {
        this.setData({
          year: year + 1,
          month: 1
        }, () => {
          this.calculateDays();
        });
      } else {
        this.setData({
          month: month + 1
        }, () => {
          this.calculateDays();
        });
      }
    },

    selectDate(e: any) {
      const { date } = e.currentTarget.dataset;
      const days = this.data.days.map(day => ({
        ...day,
        selected: day.date === date
      }));
      
      this.setData({
        days,
        selectedDate: date,
        selectedFestivals: holidayData[date] || []
      });
    },

    goToday() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const dateStr = this.formatDate(now);
      
      this.setData({
        year,
        month,
        selectedDate: dateStr,
        selectedFestivals: holidayData[dateStr] || []
      }, () => {
        this.calculateDays();
      });
    },

    // 添加分享给好友功能
    onShareAppMessage() {
      return {
        title: `查看${this.data.year}年${this.data.month}月假日安排`,
        path: `/pages/calendar/calendar?year=${this.data.year}&month=${this.data.month}`,
        imageUrl: '/images/calendar.png'
      }
    }
  }
}) 