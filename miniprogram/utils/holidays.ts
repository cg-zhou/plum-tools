interface Holiday {
  date: string;  // 格式：YYYY-MM-DD
  name: string;
  type: 'holiday' | 'workday' | 'festival';
  region: 'CN' | 'JP';  // 区分中国和日本
}

interface HolidayMap {
  [key: string]: Holiday[];  // key格式：YYYY-MM-DD
}

// 转换节日数据为按日期分组的格式
function convertHolidayData(holidays: Holiday[]): HolidayMap {
  const holidayMap: HolidayMap = {};
  
  holidays.forEach(holiday => {
    const key = holiday.date;
    
    if (!holidayMap[key]) {
      holidayMap[key] = [];
    }
    
    holidayMap[key].push(holiday);
  });
  
  return holidayMap;
}

// 2024年中国节假日数据
const CN_2024: Holiday[] = [
  // 元旦
  { date: '2024-01-01', name: '元旦', type: 'holiday', region: 'CN' },
  { date: '2024-01-01', name: '新年', type: 'festival', region: 'CN' },
  
  // 春节
  { date: '2024-02-10', name: '春节', type: 'holiday', region: 'CN' },
  { date: '2024-02-10', name: '除夕', type: 'festival', region: 'CN' },
  { date: '2024-02-11', name: '初一', type: 'holiday', region: 'CN' },
  { date: '2024-02-12', name: '初二', type: 'holiday', region: 'CN' },
  { date: '2024-02-13', name: '初三', type: 'holiday', region: 'CN' },
  { date: '2024-02-14', name: '初四', type: 'holiday', region: 'CN' },
  { date: '2024-02-15', name: '初五', type: 'holiday', region: 'CN' },
  { date: '2024-02-16', name: '初六', type: 'holiday', region: 'CN' },
  { date: '2024-02-17', name: '初七', type: 'holiday', region: 'CN' },
  
  // 清明节
  { date: '2024-04-04', name: '清明节', type: 'holiday', region: 'CN' },
  { date: '2024-04-05', name: '清明节', type: 'holiday', region: 'CN' },
  { date: '2024-04-06', name: '清明节', type: 'holiday', region: 'CN' },
  
  // 劳动节
  { date: '2024-05-01', name: '劳动节', type: 'holiday', region: 'CN' },
  { date: '2024-05-02', name: '劳动节', type: 'holiday', region: 'CN' },
  { date: '2024-05-03', name: '劳动节', type: 'holiday', region: 'CN' },
  { date: '2024-05-04', name: '劳动节', type: 'holiday', region: 'CN' },
  { date: '2024-05-05', name: '劳动节', type: 'holiday', region: 'CN' },
  
  // 端午节
  { date: '2024-06-10', name: '端午节', type: 'holiday', region: 'CN' },
  
  // 中秋节
  { date: '2024-09-17', name: '中秋节', type: 'holiday', region: 'CN' },
  
  // 国庆节
  { date: '2024-10-01', name: '国庆节', type: 'holiday', region: 'CN' },
  { date: '2024-10-02', name: '国庆节', type: 'holiday', region: 'CN' },
  { date: '2024-10-03', name: '国庆节', type: 'holiday', region: 'CN' },
  { date: '2024-10-04', name: '国庆节', type: 'holiday', region: 'CN' },
  { date: '2024-10-05', name: '国庆节', type: 'holiday', region: 'CN' },
  { date: '2024-10-06', name: '国庆节', type: 'holiday', region: 'CN' },
  { date: '2024-10-07', name: '国庆节', type: 'holiday', region: 'CN' },
];

// 2024年日本节假日数据
const JP_2024: Holiday[] = [
  { date: '2024-01-01', name: '元旦', type: 'holiday', region: 'JP' },
  { date: '2024-01-08', name: '成人节', type: 'holiday', region: 'JP' },
  { date: '2024-02-11', name: '建国纪念日', type: 'holiday', region: 'JP' },
  { date: '2024-02-12', name: '建国纪念日补假', type: 'holiday', region: 'JP' },
  { date: '2024-02-23', name: '天皇诞生日', type: 'holiday', region: 'JP' },
  { date: '2024-03-20', name: '春分日', type: 'holiday', region: 'JP' },
  { date: '2024-04-29', name: '昭和日', type: 'holiday', region: 'JP' },
  { date: '2024-05-03', name: '宪法纪念日', type: 'holiday', region: 'JP' },
  { date: '2024-05-04', name: '绿色日', type: 'holiday', region: 'JP' },
  { date: '2024-05-05', name: '儿童节', type: 'holiday', region: 'JP' },
  { date: '2024-05-06', name: '儿童节补假', type: 'holiday', region: 'JP' },
  { date: '2024-07-15', name: '海洋日', type: 'holiday', region: 'JP' },
  { date: '2024-08-11', name: '山之日', type: 'holiday', region: 'JP' },
  { date: '2024-08-12', name: '山之日补假', type: 'holiday', region: 'JP' },
  { date: '2024-09-16', name: '敬老日', type: 'holiday', region: 'JP' },
  { date: '2024-09-22', name: '秋分日', type: 'holiday', region: 'JP' },
  { date: '2024-09-23', name: '秋分日补假', type: 'holiday', region: 'JP' },
  { date: '2024-10-14', name: '体育日', type: 'holiday', region: 'JP' },
  { date: '2024-11-03', name: '文化日', type: 'holiday', region: 'JP' },
  { date: '2024-11-04', name: '文化日补假', type: 'holiday', region: 'JP' },
  { date: '2024-11-23', name: '勤劳感谢日', type: 'holiday', region: 'JP' }
];

// 2025年中国节假日数据
const CN_2025: Holiday[] = [
  { date: "2025-01-01", name: "元旦", type: "holiday", region: 'CN' },
  { date: "2025-01-28", name: "春节", type: "holiday", region: 'CN' },
  { date: "2025-01-29", name: "春节", type: "holiday", region: 'CN' },
  { date: "2025-01-30", name: "春节", type: "holiday", region: 'CN' },
  { date: "2025-01-31", name: "春节", type: "holiday", region: 'CN' },
  { date: "2025-02-01", name: "春节", type: "holiday", region: 'CN' },
  { date: "2025-02-02", name: "春节", type: "holiday", region: 'CN' },
  { date: "2025-02-03", name: "春节", type: "holiday", region: 'CN' },
  { date: "2025-02-04", name: "春节", type: "holiday", region: 'CN' },
  { date: "2025-04-04", name: "清明节", type: "holiday", region: 'CN' },
  { date: "2025-04-05", name: "清明节", type: "holiday", region: 'CN' },
  { date: "2025-04-06", name: "清明节", type: "holiday", region: 'CN' },
  { date: "2025-05-01", name: "劳动节", type: "holiday", region: 'CN' },
  { date: "2025-05-02", name: "劳动节", type: "holiday", region: 'CN' },
  { date: "2025-05-03", name: "劳动节", type: "holiday", region: 'CN' },
  { date: "2025-05-04", name: "劳动节", type: "holiday", region: 'CN' },
  { date: "2025-05-05", name: "劳动节", type: "holiday", region: 'CN' },
  { date: "2025-05-31", name: "端午节", type: "holiday", region: 'CN' },
  { date: "2025-06-01", name: "端午节", type: "holiday", region: 'CN' },
  { date: "2025-06-02", name: "端午节", type: "holiday", region: 'CN' },
  { date: "2025-10-01", name: "国庆节、中秋节", type: "holiday", region: 'CN' },
  { date: "2025-10-02", name: "国庆节、中秋节", type: "holiday", region: 'CN' },
  { date: "2025-10-03", name: "国庆节、中秋节", type: "holiday", region: 'CN' },
  { date: "2025-10-04", name: "国庆节、中秋节", type: "holiday", region: 'CN' },
  { date: "2025-10-05", name: "国庆节、中秋节", type: "holiday", region: 'CN' },
  { date: "2025-10-06", name: "国庆节、中秋节", type: "holiday", region: 'CN' },
  { date: "2025-10-07", name: "国庆节、中秋节", type: "holiday", region: 'CN' },
  { date: "2025-10-08", name: "国庆节、中秋节", type: "holiday", region: 'CN' }
];

// 2025年日本节假日数据
const JP_2025: Holiday[] = [
  { date: '2025-01-01', name: '元旦', type: 'holiday', region: 'JP' },
  { date: '2025-01-13', name: '成人节', type: 'holiday', region: 'JP' },
  { date: '2025-02-11', name: '建国纪念日', type: 'holiday', region: 'JP' },
  { date: '2025-02-23', name: '天皇诞生日', type: 'holiday', region: 'JP' },
  { date: '2025-02-24', name: '补假', type: 'holiday', region: 'JP' },
  { date: '2025-03-21', name: '春分日', type: 'holiday', region: 'JP' },
  { date: '2025-04-29', name: '昭和日', type: 'holiday', region: 'JP' },
  { date: '2025-05-03', name: '宪法纪念日', type: 'holiday', region: 'JP' },
  { date: '2025-05-04', name: '绿色日', type: 'holiday', region: 'JP' },
  { date: '2025-05-05', name: '儿童节', type: 'holiday', region: 'JP' },
  { date: '2025-05-06', name: '补假', type: 'holiday', region: 'JP' },
  { date: '2025-07-21', name: '海洋日', type: 'holiday', region: 'JP' },
  { date: '2025-08-11', name: '山之日', type: 'holiday', region: 'JP' },
  { date: '2025-09-15', name: '敬老日', type: 'holiday', region: 'JP' },
  { date: '2025-09-23', name: '秋分日', type: 'holiday', region: 'JP' },
  { date: '2025-10-13', name: '体育日', type: 'holiday', region: 'JP' },
  { date: '2025-11-03', name: '文化日', type: 'holiday', region: 'JP' },
  { date: '2025-11-24', name: '勤劳感谢日', type: 'holiday', region: 'JP' }
];

// 中国补班数据
const WORKDAYS_2024: Holiday[] = [
  { date: "2024-02-04", name: "春节补班", type: "workday", region: 'CN' },
  { date: "2024-02-18", name: "春节补班", type: "workday", region: 'CN' },
  { date: "2024-04-07", name: "清明节补班", type: "workday", region: 'CN' },
  { date: "2024-04-28", name: "劳动节补班", type: "workday", region: 'CN' },
  { date: "2024-05-11", name: "劳动节补班", type: "workday", region: 'CN' },
  { date: "2024-09-14", name: "中秋节补班", type: "workday", region: 'CN' },
  { date: "2024-09-29", name: "国庆节补班", type: "workday", region: 'CN' },
  { date: "2024-10-12", name: "国庆节补班", type: "workday", region: 'CN' }
];

const WORKDAYS_2025: Holiday[] = [
  { date: "2025-01-26", name: "春节补班", type: "workday", region: 'CN' },
  { date: "2025-02-08", name: "春节补班", type: "workday", region: 'CN' },
  { date: "2025-04-27", name: "劳动节补班", type: "workday", region: 'CN' },
  { date: "2025-09-28", name: "国庆节补班", type: "workday", region: 'CN' },
  { date: "2025-10-11", name: "国庆节补班", type: "workday", region: 'CN' }
];

// 合并所有节日数据
export const holidayData: HolidayMap = convertHolidayData([
  ...CN_2024, ...CN_2025, ...WORKDAYS_2024, ...WORKDAYS_2025,
  ...JP_2024, ...JP_2025
]); 