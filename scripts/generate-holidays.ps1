# 创建输出目录（如果不存在）
$outputDir = Join-Path (Join-Path $PSScriptRoot "..") "miniprogram\utils"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

# 定义不同地区的年份范围  
$regionYears = @{}  

$regionYears["CN"] = @{  
    "start" = 2002 
    "end" = 2025
}  

$regionYears["JP"] = @{  
    "start" = 2000  
    "end" = 2026
}  

$outputFile = Join-Path $outputDir "holidays.ts"

# 创建临时目录用于下载JSON文件
$tempDir = Join-Path $env:TEMP "holiday-calendar"
if (-not (Test-Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir -Force
}

# 定义下载函数，处理跳转
function Download-WithRedirect {
    param (
        [string]$url,
        [string]$outputFile
    )
    
    try {
        # 使用 System.Net.WebClient 替代 Invoke-WebRequest，更好的跨版本兼容性
        $webClient = New-Object System.Net.WebClient
        $webClient.Encoding = [System.Text.Encoding]::UTF8
        $content = $webClient.DownloadString($url)
        
        # 检查JSON是否有效
        $null = ConvertFrom-Json $content
        
        # 如果JSON有效，保存文件
        [System.IO.File]::WriteAllText($outputFile, $content, [System.Text.Encoding]::UTF8)
        return $true
    }
    catch {
        Write-Host "Error downloading or parsing $url : $_"
        return $false
    }
    finally {
        if ($webClient) {
            $webClient.Dispose()
        }
    }
}

# TypeScript接口定义
$tsContent = @"
interface Holiday {
  date: string;  // 格式：YYYY-MM-DD
  name: string;
  type: 'holiday' | 'workday';
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

"@

# 存储所有地区和年份的变量名，用于最后的导出
$allDataVars = @()

# 下载并处理每个地区和年份的数据
foreach ($region in $regionYears.Keys) {
    $startYear = $regionYears[$region]["start"]
    $endYear = $regionYears[$region]["end"]
    
    for ($year = $startYear; $year -le $endYear; $year++) {
        $url = "https://unpkg.com/holiday-calendar/data/$region/$year.json"
        $outputJson = Join-Path $tempDir "$region-$year.json"
        
        Write-Host "Downloading $url..."
        if (Download-WithRedirect -url $url -outputFile $outputJson) {
            try {
                $jsonContent = Get-Content $outputJson -Raw -Encoding UTF8 | ConvertFrom-Json
                
                # 生成节假日数据
                $holidayArray = @()
                foreach ($item in $jsonContent.dates) {
                    $date = $item.date
                    $name = $item.name_cn
                    $type = if ($item.type -eq "holiday" -or $item.type -eq "public_holiday") { 
                        "holiday" 
                    } else { 
                        "workday" 
                    }
                    
                    $holidayArray += "  { date: '$date', name: '$name', type: '$type', region: '$region' }"
                }
                
                if ($holidayArray.Count -gt 0) {
                    # 添加到TypeScript内容
                    $tsContent += @"

// ${year}年${region}节假日数据
const ${region}_${year}: Holiday[] = [
$($holidayArray -join ",`n")
];
"@
                    $allDataVars += "${region}_${year}"
                }
            }
            catch {
                Write-Host "Error processing data for $region $year : $_"
            }
        }
    }
}

# 添加导出语句
if ($allDataVars.Count -gt 0) {
    $spreadVars = $allDataVars | ForEach-Object { "  ...$_" }
    $tsContent += @"

// 合并所有节日数据
export const holidayData: HolidayMap = convertHolidayData([
$($spreadVars -join ",`n")
]);
"@

    # 写入文件
    [System.IO.File]::WriteAllText($outputFile, $tsContent, [System.Text.Encoding]::UTF8)
    Write-Host "Generated $outputFile successfully!"
}
else {
    Write-Host "No data was downloaded. Please check the URLs and try again."
}

# 清理临时文件
Remove-Item -Path $tempDir -Recurse -Force 