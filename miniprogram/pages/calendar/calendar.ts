interface DayItem {
  day: number
  date: string
  current: boolean
  today?: boolean
}

Component({
  data: {
    year: 2024,
    month: 1,
    days: [] as DayItem[],
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
  },

  lifetimes: {
    attached() {
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
      const { year, month } = this.data
      const days: DayItem[] = []
      
      // 获取当月第一天是星期几
      const firstDay = new Date(year, month - 1, 1).getDay()
      // 获取当月天数
      const monthDays = new Date(year, month, 0).getDate()
      // 获取上月天数
      const prevMonthDays = new Date(year, month - 1, 0).getDate()
      
      // 添加上月末尾的日期
      for (let i = 0; i < firstDay; i++) {
        days.push({
          day: prevMonthDays - firstDay + i + 1,
          date: `${month === 1 ? year - 1 : year}-${month === 1 ? 12 : month - 1}-${prevMonthDays - firstDay + i + 1}`,
          current: false
        })
      }
      
      // 添加当月日期
      const today = new Date()
      const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month - 1
      for (let i = 1; i <= monthDays; i++) {
        days.push({
          day: i,
          date: `${year}-${month}-${i}`,
          current: true,
          today: isCurrentMonth && today.getDate() === i
        })
      }
      
      // 计算需要补充的下月天数
      const totalDays = days.length
      const remainingDays = 7 - (totalDays % 7)
      if (remainingDays < 7) {  // 只有不足一行时才补充
        for (let i = 1; i <= remainingDays; i++) {
          days.push({
            day: i,
            date: `${month === 12 ? year + 1 : year}-${month === 12 ? 1 : month + 1}-${i}`,
            current: false
          })
        }
      }
      
      this.setData({ days })
    },

    prevMonth() {
      let { year, month } = this.data
      if (month === 1) {
        year--
        month = 12
      } else {
        month--
      }
      this.setData({ year, month }, () => {
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
      this.setData({ year, month }, () => {
        this.calculateDays()
      })
    },

    selectDate(e: any) {
      const date = e.currentTarget.dataset.date
      console.log('选择的日期：', date)
      // 这里可以添加选择日期后的处理逻辑
    }
  }
}) 