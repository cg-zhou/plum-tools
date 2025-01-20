// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

Component({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
      nickName: '',
    },
    hasUserInfo: false
  },
  methods: {
    // 事件处理函数
    bindViewTap() {
      wx.navigateTo({
        url: '../logs/logs',
      })
    },
    // 获取头像
    onChooseAvatar(e: any) {
      const { avatarUrl } = e.detail
      this.setData({
        'userInfo.avatarUrl': avatarUrl,
      })
    },
    // 获取昵称
    onInputChange(e: any) {
      const nickName = e.detail.value
      this.setData({
        'userInfo.nickName': nickName,
      })
    },
    // 确认登录
    getUserProfile() {
      const { avatarUrl, nickName } = this.data.userInfo
      
      if (!nickName.trim()) {
        wx.showToast({
          title: '请输入昵称',
          icon: 'error'
        })
        return
      }

      wx.showLoading({
        title: '登录中...',
      })
      
      wx.login({
        success: (loginRes) => {
          console.log('登录凭证：', loginRes.code)
          console.log('用户信息：', this.data.userInfo)
          
          this.setData({
            hasUserInfo: true
          })
          
          // 存储用户信息到本地
          wx.setStorageSync('userInfo', this.data.userInfo)
          
          wx.hideLoading()
          
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          })
        },
        fail: (err) => {
          console.error('登录失败：', err)
          wx.hideLoading()
          wx.showToast({
            title: '登录失败',
            icon: 'error'
          })
        }
      })
    },
  },
  lifetimes: {
    attached() {
      // 页面加载时检查本地存储的用户信息
      const userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        this.setData({
          userInfo,
          hasUserInfo: true
        })
      }
    }
  }
})
