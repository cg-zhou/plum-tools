// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

Component({
  methods: {
    onCalendarTap() {
      wx.navigateTo({
        url: '/pages/calendar/calendar'
      })
    }
  }
})
