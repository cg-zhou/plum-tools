// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

Component({
  methods: {
    onCalendarTap() {
      wx.navigateTo({
        url: '/pages/calendar/calendar'
      })
    },
    // 添加分享给好友功能
    onShareAppMessage() {
      return {
        title: '节假日日历 - 查看法定节假日和调休安排',
        path: '/pages/index/index',
        imageUrl: '/images/calendar.png'
      }
    }
  }
})
