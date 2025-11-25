// 页面交互功能 - 全局函数（用于设备检测页面）

// ============================================
// 数据分析页面功能 - 全局函数
// ============================================

// 初始化图表变量
window.dataChart = null;
window.chartInitialized = false;

// 生成模拟数据函数（全局作用域）
window.generateMockData = function(paramType, startTime, endTime) {
    const data = {
        times: [],
        actual: [],
        upper: [],
        lower: [],
        average: []
    };
    
    // 根据参数类型设置基础值和上下限
    const paramConfig = {
        temperature: { base: 118, upper: 120, lower: 100, unit: '°C' },
        pressure: { base: 1.5, upper: 1.6, lower: 1.3, unit: 'Bar' },
        waterLevel: { base: 75, upper: 85, lower: 65, unit: '%' },
        current: { base: 80, upper: 90, lower: 70, unit: 'A' },
        voltage: { base: 380, upper: 400, lower: 360, unit: 'V' },
        power: { base: 280, upper: 320, lower: 240, unit: 'kW' },
        flow: { base: 120, upper: 150, lower: 100, unit: 'L/min' },
        frequency: { base: 50, upper: 52, lower: 48, unit: 'Hz' }
    };
    
    const config = paramConfig[paramType] || paramConfig.temperature;
    const baseValue = config.base;
    const upperLimit = config.upper;
    const lowerLimit = config.lower;
    
    // 如果没有指定时间，默认使用最近24小时
    let start, end;
    if (startTime && endTime) {
        start = new Date(startTime);
        end = new Date(endTime);
    } else {
        end = new Date();
        start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
    }
    
    // 计算时间间隔（根据时间范围自动调整）
    const timeDiff = end.getTime() - start.getTime();
    const hours = timeDiff / (1000 * 60 * 60);
    let intervalMinutes = 30; // 默认30分钟
    
    if (hours <= 1) {
        intervalMinutes = 1; // 1小时内，每分钟一个点
    } else if (hours <= 6) {
        intervalMinutes = 5; // 6小时内，每5分钟一个点
    } else if (hours <= 24) {
        intervalMinutes = 30; // 24小时内，每30分钟一个点
    } else if (hours <= 168) {
        intervalMinutes = 60; // 7天内，每小时一个点
    } else {
        intervalMinutes = 360; // 超过7天，每6小时一个点
    }
    
    // 格式化时间函数
    const formatTime = (date) => {
        if (hours <= 24) {
            return date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0');
        } else if (hours <= 168) {
            return (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':00';
        } else {
            return (date.getMonth() + 1) + '月' + date.getDate() + '日';
        }
    };
    
    // 生成数据点
    let currentTime = new Date(start);
    let index = 0;
    while (currentTime <= end) {
        data.times.push(formatTime(currentTime));
        
        // 生成实时值（在上下限之间波动，有15%概率超标）
        const random = Math.random();
        const waveOffset = Math.sin(index / 5) * 5; // 添加波浪效果
        let actualValue;
        
        if (random < 0.15) {
            // 超标值
            actualValue = upperLimit + Math.random() * (upperLimit * 0.1);
        } else {
            actualValue = baseValue + waveOffset + (Math.random() - 0.5) * (upperLimit - lowerLimit) * 0.3;
        }
        
        data.actual.push(parseFloat(actualValue.toFixed(1)));
        data.upper.push(upperLimit);
        data.lower.push(lowerLimit);
        
        // 计算均值（更平滑）
        const avgValue = (actualValue * 0.6 + baseValue * 0.4);
        data.average.push(parseFloat(avgValue.toFixed(1)));
        
        currentTime = new Date(currentTime.getTime() + intervalMinutes * 60 * 1000);
        index++;
    }
    
    return data;
};

// 绘制图表函数（全局作用域）
window.renderChart = function(paramType, startTime, endTime) {
    if (!window.dataChart) {
        console.error('图表未初始化！');
        return;
    }
    
    console.log('开始绘制图表...', { paramType, startTime, endTime });
    const data = window.generateMockData(paramType, startTime, endTime);
    console.log('生成数据点数:', data.times.length);
    
    // 根据参数类型设置单位和标题
    const paramConfig = {
        temperature: { unit: '°C', title: '温度趋势分析' },
        pressure: { unit: 'Bar', title: '压力趋势分析' },
        waterLevel: { unit: '%', title: '液位趋势分析' },
        current: { unit: 'A', title: '电流趋势分析' },
        voltage: { unit: 'V', title: '电压趋势分析' },
        power: { unit: 'kW', title: '功率趋势分析' },
        flow: { unit: 'L/min', title: '流量趋势分析' },
        frequency: { unit: 'Hz', title: '频率趋势分析' }
    };
    
    const config = paramConfig[paramType] || paramConfig.temperature;
    const chartTitle = document.querySelector('.chart-title');
    if (chartTitle) {
        chartTitle.textContent = config.title;
    }
    
    const option = {
        grid: {
            left: '70px',
            right: '50px',
            top: '50px',
            bottom: '70px',
            containLabel: false
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(50, 50, 50, 0.95)',
            borderColor: '#333',
            borderWidth: 1,
            textStyle: {
                color: '#fff',
                fontSize: 13
            },
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            },
            formatter: function(params) {
                let result = '<strong>' + params[0].name + '</strong><br/>';
                params.forEach(item => {
                    result += item.marker + ' ' + item.seriesName + ': ' + item.value + config.unit + '<br/>';
                });
                return result;
            }
        },
        xAxis: {
            type: 'category',
            data: data.times,
            boundaryGap: false,
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#d9d9d9',
                    width: 2
                }
            },
            axisTick: {
                show: true,
                lineStyle: {
                    color: '#d9d9d9'
                }
            },
            axisLabel: {
                color: '#595959',
                fontSize: 12,
                interval: 'auto',
                rotate: 0
            }
        },
        yAxis: {
            type: 'value',
            name: config.title.replace('趋势分析', '') + ' (' + config.unit + ')',
            nameTextStyle: {
                color: '#595959',
                fontSize: 14,
                fontWeight: 600,
                padding: [0, 0, 10, 0]
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#d9d9d9',
                    width: 2
                }
            },
            axisTick: {
                show: true,
                lineStyle: {
                    color: '#d9d9d9'
                }
            },
            axisLabel: {
                color: '#595959',
                fontSize: 12,
                formatter: '{value}'
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#e8e8e8',
                    type: 'dashed',
                    width: 1
                }
            }
        },
        series: [
            {
                name: '实时值',
                type: 'line',
                data: data.actual,
                smooth: true,
                showSymbol: false,
                symbol: 'circle',
                symbolSize: 4,
                lineStyle: {
                    width: 3,
                    color: '#1890ff',
                    type: 'solid'
                },
                itemStyle: {
                    color: '#1890ff',
                    borderColor: '#fff',
                    borderWidth: 2
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(24, 144, 255, 0.25)' },
                            { offset: 1, color: 'rgba(24, 144, 255, 0.02)' }
                        ]
                    }
                },
                emphasis: {
                    focus: 'series',
                    lineStyle: {
                        width: 4
                    },
                    showSymbol: true,
                    symbolSize: 6
                }
            },
            {
                name: '上限值',
                type: 'line',
                data: data.upper,
                showSymbol: false,
                lineStyle: {
                    width: 2,
                    color: '#ff4d4f',
                    type: 'dashed'
                },
                itemStyle: {
                    color: '#ff4d4f'
                },
                emphasis: {
                    focus: 'series',
                    lineStyle: {
                        width: 3
                    }
                }
            },
            {
                name: '下限值',
                type: 'line',
                data: data.lower,
                showSymbol: false,
                lineStyle: {
                    width: 2,
                    color: '#faad14',
                    type: 'dashed'
                },
                itemStyle: {
                    color: '#faad14'
                },
                emphasis: {
                    focus: 'series',
                    lineStyle: {
                        width: 3
                    }
                }
            },
            {
                name: '均值',
                type: 'line',
                data: data.average,
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 2,
                    color: '#52c41a',
                    type: 'dashed'
                },
                itemStyle: {
                    color: '#52c41a'
                },
                emphasis: {
                    focus: 'series',
                    lineStyle: {
                        width: 3
                    }
                }
            }
        ],
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
    };
    
    try {
        window.dataChart.setOption(option);
        console.log('✓ 图表渲染成功');
    } catch(error) {
        console.error('图表渲染失败:', error);
    }
};

// 更新统计数据函数（全局作用域）
window.updateStats = function(paramType) {
    // 根据参数类型设置单位和基础值
    const paramConfig = {
        temperature: { base: 118, upper: 120, lower: 100, unit: '°C' },
        pressure: { base: 1.5, upper: 1.6, lower: 1.3, unit: 'Bar' },
        waterLevel: { base: 75, upper: 85, lower: 65, unit: '%' },
        current: { base: 80, upper: 90, lower: 70, unit: 'A' },
        voltage: { base: 380, upper: 400, lower: 360, unit: 'V' },
        power: { base: 280, upper: 320, lower: 240, unit: 'kW' },
        flow: { base: 120, upper: 150, lower: 100, unit: 'L/min' },
        frequency: { base: 50, upper: 52, lower: 48, unit: 'Hz' }
    };
    
    const config = paramConfig[paramType] || paramConfig.temperature;
    const baseValue = config.base;
    const upperLimit = config.upper;
    const lowerLimit = config.lower;
    const unit = config.unit;
    
    // 生成模拟统计数据
    const current = (baseValue + (Math.random() - 0.5) * (upperLimit - lowerLimit) * 0.3).toFixed(1);
    const avg = (baseValue * 0.95 + parseFloat(current) * 0.05).toFixed(1);
    const max = (upperLimit + Math.random() * (upperLimit * 0.05)).toFixed(1);
    const min = (lowerLimit - Math.random() * (lowerLimit * 0.05)).toFixed(1);
    
    // 格式化数值
    const formatValue = (val) => {
        if (paramType === 'pressure') {
            return parseFloat(val).toFixed(2) + unit;
        } else {
            return parseFloat(val).toFixed(1) + unit;
        }
    };
    
    const currentValueEl = document.getElementById('currentValue');
    const avgValueEl = document.getElementById('avgValue');
    const maxValueEl = document.getElementById('maxValue');
    const minValueEl = document.getElementById('minValue');
    
    if (currentValueEl) currentValueEl.textContent = formatValue(current);
    if (avgValueEl) avgValueEl.textContent = formatValue(avg);
    if (maxValueEl) maxValueEl.textContent = formatValue(max);
    if (minValueEl) minValueEl.textContent = formatValue(min);
};

// 填充表格数据函数（全局作用域）
window.fillTableData = function(paramType, startTime, endTime) {
    const tbody = document.getElementById('dataTableBody');
    if (!tbody) return;
    
    // 清空现有数据
    tbody.innerHTML = '';
    
    // 根据参数类型设置基础值和上下限
    const paramConfig = {
        temperature: { base: 118, upper: 120, lower: 100, unit: '°C' },
        pressure: { base: 1.5, upper: 1.6, lower: 1.3, unit: 'Bar' },
        waterLevel: { base: 75, upper: 85, lower: 65, unit: '%' },
        current: { base: 80, upper: 90, lower: 70, unit: 'A' },
        voltage: { base: 380, upper: 400, lower: 360, unit: 'V' },
        power: { base: 280, upper: 320, lower: 240, unit: 'kW' },
        flow: { base: 120, upper: 150, lower: 100, unit: 'L/min' },
        frequency: { base: 50, upper: 52, lower: 48, unit: 'Hz' }
    };
    
    const config = paramConfig[paramType] || paramConfig.temperature;
    const baseValue = config.base;
    const upperLimit = config.upper;
    const lowerLimit = config.lower;
    const unit = config.unit;
    
    // 如果没有指定时间，默认使用最近24小时
    let start, end;
    if (startTime && endTime) {
        start = new Date(startTime);
        end = new Date(endTime);
    } else {
        end = new Date();
        start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
    }
    
    // 计算时间间隔（根据时间范围自动调整）
    const timeDiff = end.getTime() - start.getTime();
    const hours = timeDiff / (1000 * 60 * 60);
    let intervalMinutes = 30; // 默认30分钟
    
    if (hours <= 1) {
        intervalMinutes = 1; // 1小时内，每分钟一个点
    } else if (hours <= 6) {
        intervalMinutes = 5; // 6小时内，每5分钟一个点
    } else if (hours <= 24) {
        intervalMinutes = 30; // 24小时内，每30分钟一个点
    } else if (hours <= 168) {
        intervalMinutes = 60; // 7天内，每小时一个点
    } else {
        intervalMinutes = 360; // 超过7天，每6小时一个点
    }
    
    // 格式化时间函数
    const formatTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    
    // 生成数据点（最多显示50条，避免表格过长）
    let currentTime = new Date(start);
    let index = 0;
    const maxRows = 50;
    
    while (currentTime <= end && index < maxRows) {
        // 生成实时值（在上下限之间波动，有15%概率超标）
        const random = Math.random();
        const waveOffset = Math.sin(index / 5) * 5; // 添加波浪效果
        let actualValue;
        
        if (random < 0.15) {
            // 超标值
            actualValue = upperLimit + Math.random() * (upperLimit * 0.1);
        } else {
            actualValue = baseValue + waveOffset + (Math.random() - 0.5) * (upperLimit - lowerLimit) * 0.3;
        }
        
        // 计算均值
        const avgValue = (actualValue * 0.6 + baseValue * 0.4);
        
        // 格式化数值
        const formatValue = (val) => {
            if (paramType === 'pressure') {
                return val.toFixed(2);
            } else if (paramType === 'waterLevel' || paramType === 'frequency') {
                return val.toFixed(1);
            } else {
                return val.toFixed(1);
            }
        };
        
        const actual = formatValue(actualValue);
        const upper = formatValue(upperLimit);
        const lower = formatValue(lowerLimit);
        const avg = formatValue(avgValue);
        
        // 判断状态
        const status = parseFloat(actual) > parseFloat(upper) ? 'danger' : 
                      parseFloat(actual) < parseFloat(lower) ? 'warning' : 'normal';
        const statusText = parseFloat(actual) > parseFloat(upper) ? '超上限' : 
                           parseFloat(actual) < parseFloat(lower) ? '超下限' : '正常';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatTime(currentTime)}</td>
            <td>${actual}${unit}</td>
            <td>${upper}${unit}</td>
            <td>${lower}${unit}</td>
            <td>${avg}${unit}</td>
            <td class="status-${status}">${statusText}</td>
        `;
        tbody.appendChild(row);
        
        currentTime = new Date(currentTime.getTime() + intervalMinutes * 60 * 1000);
        index++;
    }
};

console.log('✓ 全局函数已加载完成');
