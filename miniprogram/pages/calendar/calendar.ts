interface DayItem {
  day: number
  date: string
  current: boolean
  today?: boolean
  selected?: boolean
}

Component({
  data: {
    year: 2024,
    month: 1,
    days: [] as DayItem[],
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    selectedDate: '',
    years: [] as number[],
    months: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    yearIndex: 0
  },

  lifetimes: {
    attached() {
      // 生成年份数组（1900-2050）
      const years: number[] = []
      for (let i = 1900; i <= 2050; i++) {
        years.push(i)
      }
      
      const now = new Date()
      const currentYear = now.getFullYear()
      const yearIndex = years.indexOf(currentYear)
      
      this.setData({
        years,
        yearIndex
      })
      
      this.initCalendar()
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

    calculateDays() {
      const { year, month, selectedDate } = this.data
      const days: DayItem[] = []
      
      // 获取当月第一天是星期几
      const firstDay = new Date(year, month - 1, 1).getDay()
      // 获取当月天数
      const monthDays = new Date(year, month, 0).getDate()
      // 获取上月天数
      const prevMonthDays = new Date(year, month - 1, 0).getDate()
      
      // 添加上月末尾的日期
      for (let i = 0; i < firstDay; i++) {
        const date = `${month === 1 ? year - 1 : year}-${month === 1 ? 12 : month - 1}-${prevMonthDays - firstDay + i + 1}`
        days.push({
          day: prevMonthDays - firstDay + i + 1,
          date,
          current: false,
          selected: date === selectedDate
        })
      }
      
      // 添加当月日期
      const today = new Date()
      const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month - 1
      for (let i = 1; i <= monthDays; i++) {
        const date = `${year}-${month}-${i}`
        days.push({
          day: i,
          date,
          current: true,
          today: isCurrentMonth && today.getDate() === i,
          selected: date === selectedDate
        })
      }
      
      // 计算需要补充的下月天数
      const totalDays = days.length
      const remainingDays = 7 - (totalDays % 7)
      if (remainingDays < 7) {  // 只有不足一行时才补充
        for (let i = 1; i <= remainingDays; i++) {
          const date = `${month === 12 ? year + 1 : year}-${month === 12 ? 1 : month + 1}-${i}`
          days.push({
            day: i,
            date,
            current: false,
            selected: date === selectedDate
          })
        }
      }
      
      this.setData({ days })
    },

    onYearChange(e: any) {
      const yearIndex = e.detail.value
      const year = this.data.years[yearIndex]
      this.setData({ 
        year,
        yearIndex
      }, () => {
        this.calculateDays()
      })
    },

    onMonthChange(e: any) {
      const month = parseInt(this.data.months[e.detail.value])
      this.setData({ month }, () => {
        this.calculateDays()
      })
    },

    prevMonth() {
      let { year, month } = this.data
      if (month === 1) {
        year--
        month = 12
      } else {
        month--
      }
      this.setData({ 
        year, 
        month,
        yearIndex: this.data.years.indexOf(year)
      }, () => {
        this.calculateDays()
      })
    },

    nextMonth() {
      let { year, month } = this.data
      if (month === 12) {
        year++
        month = 1
      } else {
        month++
      }
      this.setData({ 
        year, 
        month,
        yearIndex: this.data.years.indexOf(year)
      }, () => {
        this.calculateDays()
      })
    },

    selectDate(e: any) {
      const date = e.currentTarget.dataset.date
      this.setData({ selectedDate: date }, () => {
        this.calculateDays()
      })
    },

    goToday() {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      const date = `${year}-${month}-${now.getDate()}`
      
      this.setData({
        year,
        month,
        selectedDate: date,
        yearIndex: this.data.years.indexOf(year)
      }, () => {
        this.calculateDays()
      })
    }
  }
}) 