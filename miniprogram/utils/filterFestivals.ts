import { Holiday } from '../pages/calendar/calendar';

/**
 * 根据设置过滤节假日
 * @param festivals 节假日数组
 * @param showCN 是否显示中国节假日
 * @param showJP 是否显示日本节假日
 * @returns 过滤后的节假日数组
 */
export function filterFestivals(festivals: Holiday[], showCN: boolean, showJP: boolean): Holiday[] {
  return festivals.filter(festival => {
    const region = (festival as any).region;
    return (region === 'CN' && showCN) || 
           (region === 'JP' && showJP);
  });
} 