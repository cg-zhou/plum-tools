import { CalendarService } from './core/calendarService';
import { Holiday, CalendarSettings } from './core/calendarModel';

// 定义默认值常量
const DEFAULT_SETTINGS = {
  SHOW_CN: true,
  SHOW_JP: false
};

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
    isSwiping: false,
    animationData: {},
    isAnimating: false,
    touchStartX: 0,
    touchEndX: 0,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    days: [] as DayItem[],
    selectedDate: '',
    selectedFestivals: [] as Holiday[],
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    years: [] as number[],
    months: Array.from({ length: 12 }, (_, i) => i + 1),
    yearIndex: 0,
    currentTranslateX: 0,
    swipeProgress: 0,
    showCN: true,
    showJP: false,
    isSettingPanelVisible: false
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
      const settings = CalendarService.getDefaultSettings();

      this.setData({
        years,
        yearIndex,
        showCN: settings.showCN,
        showJP: settings.showJP
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
      const { year, month, cn, jp } = options

      // 如果有分享参数，则跳转到对应年月
      if (year && month) {
        this.setData({
          year: parseInt(year),
          month: parseInt(month)
        }, () => {
          this.calculateDays()
        })
      }

      if (cn !== undefined || jp !== undefined) {
        const settings: CalendarSettings = {
          showCN: cn !== '0',
          showJP: jp !== '0'
        };
        this.setData(settings);
        CalendarService.saveSettings(settings);
      }
    }
  },

  methods: {
    onTouchStart(e: any) {
      this.setData({
        touchStartX: e.touches[0].clientX,
        isSwiping: false,
        currentTranslateX: 0
      });
    },

    onTouchMove(e: any) {
      if (this.data.isAnimating) return;
      
      const deltaX = e.touches[0].clientX - this.data.touchStartX;
      const windowInfo = wx.getWindowInfo();
      const screenWidth = windowInfo.windowWidth;
      
      // 限制最大滑动距离为屏幕宽度的 30%
      const maxDelta = screenWidth * 0.3;
      const translateX = Math.min(Math.max(deltaX, -maxDelta), maxDelta);
      
      const animation = wx.createAnimation({
        duration: 0,
        timingFunction: 'linear'
      });
      
      animation.translateX(translateX).step();
      
      this.setData({
        touchEndX: e.touches[0].clientX,
        isSwiping: true,
        animationData: animation.export(),
        currentTranslateX: translateX
      });
    },

    onTouchEnd() {
      const { touchStartX, touchEndX, isSwiping, currentTranslateX } = this.data;
      const windowInfo = wx.getWindowInfo();
      const screenWidth = windowInfo.windowWidth;

      if (Math.abs(currentTranslateX) > screenWidth * 0.15) {
        // 达到切换阈值，执行切换动画
        const direction = currentTranslateX > 0 ? 'right' : 'left';
        this.slideToMonth(direction);
      } else {
        // 未达阈值，回弹动画
        const animation = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease-out'
        });
        animation.translateX(0).step();
        this.setData({
          animationData: animation.export(),
          isAnimating: true
        });
        
        setTimeout(() => {
          this.setData({ isAnimating: false });
        }, 300);
      }
    },

    initCalendar() {
      const now = new Date()
      this.setData({
        year: now.getFullYear(),
        month: now.getMonth() + 1
      })
      this.calculateDays()
    },

    calculateDays() {
      const { year, month, selectedDate, showCN, showJP } = this.data;
      const settings: CalendarSettings = { showCN, showJP };
      const days = CalendarService.calculateDays(year, month, settings, selectedDate);
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

      if (animate) {
        this.slideToMonth(offset > 0 ? 'left' : 'right');
      } else {
        this.setData({
          year: newYear,
          month: newMonth,
          animationData: {}
        }, () => {
          this.calculateDays();
          const resetAnim = wx.createAnimation({ duration: 0 });
          resetAnim.translateX(0).step();
          this.setData({
            animationData: resetAnim.export()
          });
        });
      }
    },

    startAnimation(direction: 'left' | 'right', callback: () => void) {
      this.setData({ isAnimating: true });

      const animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      });

      if (direction === 'left') {
        animation.translateX('-100%').step();
      } else {
        animation.translateX('100%').step();
      }

      this.setData({
        animationData: animation.export()
      });

      setTimeout(() => {
        animation.translateX(0).step();
        this.setData({
          animationData: animation.export()
        });

        setTimeout(callback, 500);
      }, 50);
    },

    prevMonth() {
      this.changeMonth(-1, false);
    },

    nextMonth() {
      this.changeMonth(1, false);
    },

    selectDate(e: any) {
      const { date } = e.currentTarget.dataset;
      const days = this.data.days.map(day => ({
        ...day,
        selected: day.date === date
      }));

      const settings: CalendarSettings = {
        showCN: this.data.showCN,
        showJP: this.data.showJP
      };

      const selectedDay = this.data.days.find(d => d.date === date);
      const selectedFestivals = selectedDay ? CalendarService.filterFestivals(selectedDay.festivals, settings) : [];

      this.setData({
        days,
        selectedDate: date,
        selectedFestivals
      });
    },

    goToday() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const dateStr = CalendarService.formatDate(now);

      this.setData({
        year,
        month,
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

    slideToMonth(direction: 'left' | 'right') {
      this.setData({ isAnimating: true });
      
      const animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-out'
      });
      
      const windowInfo = wx.getWindowInfo();
      const screenWidth = windowInfo.windowWidth;
      const targetX = Number(direction === 'left' ? -screenWidth : screenWidth);
      
      animation.translateX(targetX).step();
      
      this.setData({
        animationData: animation.export()
      });

      setTimeout(() => {
        this.changeMonth(direction === 'left' ? 1 : -1, false);
        // 重置位置并刷新数据
        const resetAnimation = wx.createAnimation({ duration: 0 });
        resetAnimation.translateX(0).step();
        this.setData({
          animationData: resetAnimation.export(),
          isAnimating: false
        });
      }, 300);
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
        this.updateSelectedFestivals();
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
        this.updateSelectedFestivals();
      });
    },

    // 新增方法：更新当前选中日期的节假日列表
    updateSelectedFestivals() {
      if (this.data.selectedDate) {
        const settings: CalendarSettings = {
          showCN: this.data.showCN,
          showJP: this.data.showJP
        };
        
        const selectedDay = this.data.days.find(d => d.date === this.data.selectedDate);
        const selectedFestivals = selectedDay ? CalendarService.filterFestivals(selectedDay.festivals, settings) : [];
        
        this.setData({ selectedFestivals });
      }
    }
  }
}) 