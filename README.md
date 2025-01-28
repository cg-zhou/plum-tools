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
- 跨年浏览：支持1900-2050年日期查看

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