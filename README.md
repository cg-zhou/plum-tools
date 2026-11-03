# 梅有小助手（plum-tools）

一个节假日管理、多国节日显示的工具

## 主要功能

### 📅 核心功能
- 中日节假日高亮显示
- 补班日期标记
- 日期选择与详情展示

### ✨ 特色功能
- 手势操作：滑动切换月份，支持弹性动画
- 节日过滤：独立开关控制中日节日显示
- 跨年浏览：年份范围根据中日数据的共同覆盖范围自动更新

小程序通过 `https://cg-zhou.top/api/holidays/` 获取年份索引和各年数据，并在本地缓存；网络不可用时使用缓存或内置数据。

## 自动上传开发版

推送到 `main` 后，GitHub Actions 使用微信官方 `miniprogram-ci` 上传开发版，也可以在 Actions 页面手动运行 **Upload WeChat Mini Program (development)**。无需在本机安装微信开发者工具。

配置步骤：

1. 在微信公众平台的「开发管理 → 开发设置 → 小程序代码上传」生成并下载代码上传密钥。
2. 在 GitHub 仓库的 Settings → Secrets and variables → Actions 中新增 `WECHAT_PRIVATE_KEY`，值为密钥文件的完整内容；不要将密钥提交到仓库。
3. 确认微信后台的上传 IP 白名单允许 GitHub Actions 的出口 IP。GitHub 托管运行器的 IP 可能变化，使用固定出口的自托管运行器或调整白名单设置。
4. 上传后到微信后台查看开发版本。上传不会自动提交审核或发布正式版。

## 数据来源

本项目使用 [holiday-calendar](https://www.npmjs.com/package/holiday-calendar) 提供的标准化节假日数据，该数据包聚合了以下官方来源：

- **中国节假日**  
  数据来源：国务院办公厅发布的节假日安排通知  
  数据类型：法定节假日、调休工作日

- **日本节假日**  
  数据来源：内閣府公示的「国民の祝日」  
  数据类型：法定节假日

### 数据包特性
✅ 多语言支持（中/英/日）  
✅ 按需获取指定年份/地区数据  
✅ 提供JSON格式原始数据访问  
✅ 支持浏览器和Node.js环境

[![npm-version](https://img.shields.io/npm/v/holiday-calendar)](https://www.npmjs.com/package/holiday-calendar)
