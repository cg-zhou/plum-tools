interface Holiday {
  date: string
  name: string
  name_cn: string
  name_en: string
  type: string
}

interface HolidayMap {
  [key: string]: {
    [key: string]: {
      [key: string]: Array<{
        name: string
        type: string
      }>
    }
  }
}

// 将原始数据转换为我们需要的格式
function convertHolidayData(data: Holiday[]): HolidayMap {
  const result: HolidayMap = {}
  
  data.forEach(holiday => {
    const [year, month, day] = holiday.date.split('-')
    // 确保月份和日期是两位数格式
    const monthKey = month.padStart(2, '0')
    const dayKey = day.padStart(2, '0')
    
    if (!result[year]) {
      result[year] = {}
    }
    if (!result[year][monthKey]) {
      result[year][monthKey] = {}
    }
    if (!result[year][monthKey][dayKey]) {
      result[year][monthKey][dayKey] = []
    }

    // 根据类型映射
    let type = 'festival'
    if (holiday.type === 'public_holiday') {
      type = 'holiday'
    } else if (holiday.type === 'transfer_workday') {
      type = 'workday'
    }

    result[year][monthKey][dayKey].push({
      name: holiday.name_cn,
      type
    })
  })

  return result
}

// 2024年中国节假日数据
const CN_2024: Holiday[] = [
  { date: "2024-01-01", name: "元旦", name_cn: "元旦", name_en: "New Year's Day", type: "public_holiday" },
  { date: "2024-02-10", name: "春节", name_cn: "春节", name_en: "Chinese New Year", type: "public_holiday" },
  { date: "2024-02-11", name: "春节", name_cn: "春节", name_en: "Chinese New Year", type: "public_holiday" },
  { date: "2024-02-12", name: "春节", name_cn: "春节", name_en: "Chinese New Year", type: "public_holiday" },
  { date: "2024-02-13", name: "春节", name_cn: "春节", name_en: "Chinese New Year", type: "public_holiday" },
  { date: "2024-02-14", name: "春节", name_cn: "春节", name_en: "Chinese New Year", type: "public_holiday" },
  { date: "2024-02-15", name: "春节", name_cn: "春节", name_en: "Chinese New Year", type: "public_holiday" },
  { date: "2024-02-16", name: "春节", name_cn: "春节", name_en: "Chinese New Year", type: "public_holiday" },
  { date: "2024-02-17", name: "春节", name_cn: "春节", name_en: "Chinese New Year", type: "public_holiday" },
  { date: "2024-04-04", name: "清明节", name_cn: "清明节", name_en: "Tomb-Sweeping Day", type: "public_holiday" },
  { date: "2024-04-05", name: "清明节", name_cn: "清明节", name_en: "Tomb-Sweeping Day", type: "public_holiday" },
  { date: "2024-04-06", name: "清明节", name_cn: "清明节", name_en: "Tomb-Sweeping Day", type: "public_holiday" },
  { date: "2024-05-01", name: "劳动节", name_cn: "劳动节", name_en: "Labor Day", type: "public_holiday" },
  { date: "2024-05-02", name: "劳动节", name_cn: "劳动节", name_en: "Labor Day", type: "public_holiday" },
  { date: "2024-05-03", name: "劳动节", name_cn: "劳动节", name_en: "Labor Day", type: "public_holiday" },
  { date: "2024-05-04", name: "劳动节", name_cn: "劳动节", name_en: "Labor Day", type: "public_holiday" },
  { date: "2024-05-05", name: "劳动节", name_cn: "劳动节", name_en: "Labor Day", type: "public_holiday" },
  { date: "2024-06-10", name: "端午节", name_cn: "端午节", name_en: "Dragon Boat Festival", type: "public_holiday" },
  { date: "2024-09-15", name: "中秋节", name_cn: "中秋节", name_en: "Mid-Autumn Festival", type: "public_holiday" },
  { date: "2024-09-16", name: "中秋节", name_cn: "中秋节", name_en: "Mid-Autumn Festival", type: "public_holiday" },
  { date: "2024-09-17", name: "中秋节", name_cn: "中秋节", name_en: "Mid-Autumn Festival", type: "public_holiday" },
  { date: "2024-10-01", name: "国庆节", name_cn: "国庆节", name_en: "National Day", type: "public_holiday" },
  { date: "2024-10-02", name: "国庆节", name_cn: "国庆节", name_en: "National Day", type: "public_holiday" },
  { date: "2024-10-03", name: "国庆节", name_cn: "国庆节", name_en: "National Day", type: "public_holiday" },
  { date: "2024-10-04", name: "国庆节", name_cn: "国庆节", name_en: "National Day", type: "public_holiday" },
  { date: "2024-10-05", name: "国庆节", name_cn: "国庆节", name_en: "National Day", type: "public_holiday" },
  { date: "2024-10-06", name: "国庆节", name_cn: "国庆节", name_en: "National Day", type: "public_holiday" },
  { date: "2024-10-07", name: "国庆节", name_cn: "国庆节", name_en: "National Day", type: "public_holiday" }
]

// 2025年中国节假日数据
const CN_2025: Holiday[] = [
  { date: "2025-01-01", name: "元旦", name_cn: "元旦", name_en: "New Year's Day", type: "public_holiday" },
  { date: "2025-01-28", name: "春节", name_cn: "春节", name_en: "Chinese New Year", type: "public_holiday" },
  { date: "2025-01-29", name: "春节", name_cn: "春节", name_en: "Chinese New Year", type: "public_holiday" },
  { date: "2025-01-30", name: "春节", name_cn: "春节", name_en: "Chinese New Year", type: "public_holiday" },
  { date: "2025-01-31", name: "春节", name_cn: "春节", name_en: "Chinese New Year", type: "public_holiday" },
  { date: "2025-02-01", name: "春节", name_cn: "春节", name_en: "Chinese New Year", type: "public_holiday" },
  { date: "2025-02-02", name: "春节", name_cn: "春节", name_en: "Chinese New Year", type: "public_holiday" },
  { date: "2025-02-03", name: "春节", name_cn: "春节", name_en: "Chinese New Year", type: "public_holiday" },
  { date: "2025-02-04", name: "春节", name_cn: "春节", name_en: "Chinese New Year", type: "public_holiday" },
  { date: "2025-04-04", name: "清明节", name_cn: "清明节", name_en: "Tomb-Sweeping Day", type: "public_holiday" },
  { date: "2025-04-05", name: "清明节", name_cn: "清明节", name_en: "Tomb-Sweeping Day", type: "public_holiday" },
  { date: "2025-04-06", name: "清明节", name_cn: "清明节", name_en: "Tomb-Sweeping Day", type: "public_holiday" },
  { date: "2025-05-01", name: "劳动节", name_cn: "劳动节", name_en: "Labor Day", type: "public_holiday" },
  { date: "2025-05-02", name: "劳动节", name_cn: "劳动节", name_en: "Labor Day", type: "public_holiday" },
  { date: "2025-05-03", name: "劳动节", name_cn: "劳动节", name_en: "Labor Day", type: "public_holiday" },
  { date: "2025-05-04", name: "劳动节", name_cn: "劳动节", name_en: "Labor Day", type: "public_holiday" },
  { date: "2025-05-05", name: "劳动节", name_cn: "劳动节", name_en: "Labor Day", type: "public_holiday" },
  { date: "2025-05-31", name: "端午节", name_cn: "端午节", name_en: "Dragon Boat Festival", type: "public_holiday" },
  { date: "2025-06-01", name: "端午节", name_cn: "端午节", name_en: "Dragon Boat Festival", type: "public_holiday" },
  { date: "2025-06-02", name: "端午节", name_cn: "端午节", name_en: "Dragon Boat Festival", type: "public_holiday" },
  { date: "2025-10-01", name: "国庆节、中秋节", name_cn: "国庆节、中秋节", name_en: "National Day & Mid-Autumn Festival", type: "public_holiday" },
  { date: "2025-10-02", name: "国庆节、中秋节", name_cn: "国庆节、中秋节", name_en: "National Day & Mid-Autumn Festival", type: "public_holiday" },
  { date: "2025-10-03", name: "国庆节、中秋节", name_cn: "国庆节、中秋节", name_en: "National Day & Mid-Autumn Festival", type: "public_holiday" },
  { date: "2025-10-04", name: "国庆节、中秋节", name_cn: "国庆节、中秋节", name_en: "National Day & Mid-Autumn Festival", type: "public_holiday" },
  { date: "2025-10-05", name: "国庆节、中秋节", name_cn: "国庆节、中秋节", name_en: "National Day & Mid-Autumn Festival", type: "public_holiday" },
  { date: "2025-10-06", name: "国庆节、中秋节", name_cn: "国庆节、中秋节", name_en: "National Day & Mid-Autumn Festival", type: "public_holiday" },
  { date: "2025-10-07", name: "国庆节、中秋节", name_cn: "国庆节、中秋节", name_en: "National Day & Mid-Autumn Festival", type: "public_holiday" },
  { date: "2025-10-08", name: "国庆节、中秋节", name_cn: "国庆节、中秋节", name_en: "National Day & Mid-Autumn Festival", type: "public_holiday" }
]

// 补班数据
const WORKDAYS_2024 = [
  { date: "2024-02-04", name: "春节补班", name_cn: "春节补班", name_en: "Spring Festival Workday", type: "transfer_workday" },
  { date: "2024-02-18", name: "春节补班", name_cn: "春节补班", name_en: "Spring Festival Workday", type: "transfer_workday" },
  { date: "2024-04-07", name: "清明节补班", name_cn: "清明节补班", name_en: "Tomb-Sweeping Day Workday", type: "transfer_workday" },
  { date: "2024-04-28", name: "劳动节补班", name_cn: "劳动节补班", name_en: "Labor Day Workday", type: "transfer_workday" },
  { date: "2024-05-11", name: "劳动节补班", name_cn: "劳动节补班", name_en: "Labor Day Workday", type: "transfer_workday" },
  { date: "2024-09-14", name: "中秋节补班", name_cn: "中秋节补班", name_en: "Mid-Autumn Festival Workday", type: "transfer_workday" },
  { date: "2024-09-29", name: "国庆节补班", name_cn: "国庆节补班", name_en: "National Day Workday", type: "transfer_workday" },
  { date: "2024-10-12", name: "国庆节补班", name_cn: "国庆节补班", name_en: "National Day Workday", type: "transfer_workday" }
]

const WORKDAYS_2025 = [
  { date: "2025-01-26", name: "春节补班", name_cn: "春节补班", name_en: "Spring Festival Workday", type: "transfer_workday" },
  { date: "2025-02-08", name: "春节补班", name_cn: "春节补班", name_en: "Spring Festival Workday", type: "transfer_workday" },
  { date: "2025-04-27", name: "劳动节补班", name_cn: "劳动节补班", name_en: "Labor Day Workday", type: "transfer_workday" },
  { date: "2025-09-28", name: "国庆节补班", name_cn: "国庆节补班", name_en: "National Day Workday", type: "transfer_workday" },
  { date: "2025-10-11", name: "国庆节补班", name_cn: "国庆节补班", name_en: "National Day Workday", type: "transfer_workday" }
]

// 合并所有数据并转换格式
export const holidayData = convertHolidayData([
  ...CN_2024,
  ...CN_2025,
  ...WORKDAYS_2024,
  ...WORKDAYS_2025
]) 