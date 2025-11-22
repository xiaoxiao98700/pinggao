// 页面交互功能

document.addEventListener('DOMContentLoaded', function() {
    // 限制单元格文本显示长度（20个字符）
    function truncateTableCellText() {
        const tableCells = document.querySelectorAll('.data-table td');
        tableCells.forEach(cell => {
            // 跳过复选框、操作列和状态标签
            if (cell.querySelector('input[type="checkbox"]') || 
                cell.classList.contains('actions') || 
                cell.querySelector('.status-badge')) {
                return;
            }
            
            const text = cell.textContent.trim();
            if (text.length > 20) {
                cell.textContent = text.substring(0, 20) + '...';
                cell.title = text; // 添加完整文本到title属性，鼠标悬停可查看
            }
        });
    }
    
    // 页面加载时执行文本截断
    truncateTableCellText();
    
    // 全选/取消全选
    const selectAllCheckbox = document.querySelector('.select-all');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // 单个复选框变化时更新全选状态
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
            const someChecked = Array.from(rowCheckboxes).some(cb => cb.checked);
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = allChecked;
                selectAllCheckbox.indeterminate = someChecked && !allChecked;
            }
        });
    });
    
    // 搜索筛选功能
    const queryBtn = document.querySelector('.btn-query');
    const resetBtn = document.querySelector('.btn-reset');
    const filterInputs = document.querySelectorAll('.filter-input');
    
    if (queryBtn) {
        queryBtn.addEventListener('click', function() {
            const filters = {};
            filterInputs.forEach(input => {
                const label = input.closest('.filter-item').querySelector('label').textContent;
                filters[label] = input.value.trim();
            });
            console.log('查询条件:', filters);
            // 这里可以添加实际的查询逻辑
            alert('查询功能：' + JSON.stringify(filters, null, 2));
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // 清除筛选输入框
            filterInputs.forEach(input => {
                input.value = '';
            });
            // 清除客户选中状态
            const customerItems = document.querySelectorAll('.customer-item');
            customerItems.forEach(item => item.classList.remove('active'));
            selectedCustomer = null;
            
            // 显示所有表格行
            const tableRows = document.querySelectorAll('#projectTable tbody tr');
            tableRows.forEach(row => {
                row.style.display = '';
            });
            
            // 更新分页信息
            updatePaginationInfo();
            console.log('重置筛选条件');
        });
    }
    
    // 展开/收起筛选
    const expandBtn = document.querySelector('.btn-expand');
    const searchSection = document.querySelector('.search-section');
    let isExpanded = false;
    
    if (expandBtn) {
        expandBtn.addEventListener('click', function() {
            isExpanded = !isExpanded;
            if (isExpanded) {
                this.textContent = '收起';
                searchSection.style.maxHeight = 'none';
            } else {
                this.textContent = '展开';
                searchSection.style.maxHeight = '120px';
            }
        });
    }
    
    // 新增按钮
    const addBtn = document.querySelector('.btn-add');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            window.location.href = 'add-project.html';
        });
    }
    
    // 删除按钮
    const deleteBtn = document.querySelector('.btn-delete');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            const selectedRows = Array.from(rowCheckboxes).filter(cb => cb.checked);
            if (selectedRows.length === 0) {
                alert('请至少选择一条记录');
                return;
            }
            if (confirm(`确定要删除选中的 ${selectedRows.length} 条记录吗？`)) {
                // 这里可以添加删除逻辑
                console.log('删除选中的记录');
                selectedRows.forEach(checkbox => {
                    const row = checkbox.closest('tr');
                    if (row) {
                        row.remove();
                    }
                });
                alert('删除成功');
            }
        });
    }
    
    // 导出按钮
    const exportBtn = document.querySelector('.btn-export');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            alert('导出功能');
            // 这里可以添加导出逻辑
        });
    }
    
    // 操作链接
    const actionLinks = document.querySelectorAll('.action-link');
    actionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 如果是"编辑"或"详情"链接，只阻止默认行为，不执行跳转
            if (this.classList.contains('action-no-jump')) {
                e.preventDefault();
                return;
            }
            
            e.preventDefault();
            const action = this.textContent.trim();
            const row = this.closest('tr');
            const projectNumber = row.querySelector('td:nth-child(3)').textContent;
            
            switch(action) {
                case '签约':
                    alert(`签约项目：${projectNumber}`);
                    break;
                case '编辑':
                    window.location.href = `edit-project.html?id=${projectNumber}`;
                    break;
                case '详情':
                    window.location.href = `detail-project.html?id=${projectNumber}`;
                    break;
                case '信息补充':
                    // 显示信息补充弹窗
                    const modal = document.getElementById('infoSupplementModal');
                    if (modal) {
                        modal.classList.add('show');
                    }
                    break;
            }
        });
    });
    
    // 分页功能
    const pageBtns = document.querySelectorAll('.page-btn');
    const pageInput = document.querySelector('.page-input');
    const pageSize = document.querySelector('.page-size');
    let currentPage = 1;
    
    pageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            
            const text = this.textContent.trim();
            if (text === '<') {
                if (currentPage > 1) {
                    currentPage--;
                    updatePagination();
                }
            } else if (text === '>') {
                currentPage++;
                updatePagination();
            } else {
                currentPage = parseInt(text);
                updatePagination();
            }
        });
    });
    
    if (pageInput) {
        pageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const page = parseInt(this.value);
                if (page > 0) {
                    currentPage = page;
                    updatePagination();
                }
            }
        });
    }
    
    if (pageSize) {
        pageSize.addEventListener('change', function() {
            const size = parseInt(this.value);
            console.log('每页显示:', size);
            currentPage = 1;
            updatePagination();
            // 这里可以添加重新加载数据的逻辑
        });
    }
    
    function updatePagination() {
        // 更新页码按钮状态
        pageBtns.forEach(btn => {
            btn.classList.remove('active');
            const text = btn.textContent.trim();
            if (text === currentPage.toString()) {
                btn.classList.add('active');
            }
            
            // 更新上一页/下一页按钮状态
            if (text === '<') {
                btn.disabled = currentPage === 1;
            } else if (text === '>') {
                // 这里应该根据总页数来判断，暂时设为false
                btn.disabled = false;
            }
        });
        
        if (pageInput) {
            pageInput.value = currentPage;
        }
        
        // 这里可以添加加载数据的逻辑
        console.log('当前页码:', currentPage);
    }
    
    // 客户列表搜索
    const customersInput = document.querySelector('.customers-input');
    const customerItems = document.querySelectorAll('.customer-item');
    const tableRows = document.querySelectorAll('#projectTable tbody tr');
    let selectedCustomer = null;
    
    if (customersInput) {
        customersInput.addEventListener('input', function() {
            const searchText = this.value.toLowerCase().trim();
            customerItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchText)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // 客户项点击 - 筛选项目列表
    customerItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除其他项的选中状态
            customerItems.forEach(i => i.classList.remove('active'));
            // 添加当前项的选中状态
            this.classList.add('active');
            
            // 获取选中的客户名称
            selectedCustomer = this.getAttribute('data-customer');
            
            // 筛选表格行
            filterTableByCustomer(selectedCustomer);
            
            console.log('选中客户:', selectedCustomer);
        });
    });
    
    // 根据客户筛选表格
    function filterTableByCustomer(customerName) {
        if (!customerName) {
            // 如果没有选中客户，显示所有行
            tableRows.forEach(row => {
                row.style.display = '';
            });
            return;
        }
        
        // 筛选表格行
        tableRows.forEach(row => {
            // 获取该行的所属客户（第5列，索引为5，因为前面有复选框和序号）
            const customerCell = row.querySelector('td:nth-child(5)');
            if (customerCell) {
                const rowCustomer = customerCell.textContent.trim();
                if (rowCustomer === customerName) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
        
        // 更新分页信息
        updatePaginationInfo();
    }
    
    // 更新分页信息
    function updatePaginationInfo() {
        const visibleRows = Array.from(tableRows).filter(row => row.style.display !== 'none');
        const paginationInfo = document.querySelector('.pagination-info span');
        if (paginationInfo) {
            paginationInfo.textContent = `共${visibleRows.length}条`;
        }
    }
    
    // 重置按钮 - 清除客户筛选
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // 清除客户选中状态
            customerItems.forEach(item => item.classList.remove('active'));
            selectedCustomer = null;
            
            // 显示所有表格行
            tableRows.forEach(row => {
                row.style.display = '';
            });
            
            // 更新分页信息
            updatePaginationInfo();
        });
    }
    
    // 标签页切换
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            if (this.classList.contains('active')) return;
            
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabText = this.textContent.replace('×', '').trim();
            console.log('切换到标签:', tabText);
        });
    });
    
    // 标签关闭
    const tabClose = document.querySelector('.tab-close');
    if (tabClose) {
        tabClose.addEventListener('click', function(e) {
            e.stopPropagation();
            const tab = this.closest('.tab');
            if (confirm('确定要关闭此标签吗？')) {
                tab.remove();
                // 激活第一个标签
                const firstTab = document.querySelector('.tab');
                if (firstTab) {
                    firstTab.classList.add('active');
                }
            }
        });
    }
    
    // 导航菜单项点击
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // 如果链接是 # 或空，则阻止默认行为并只切换激活状态
            if (!href || href === '#') {
                e.preventDefault();
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            }
            // 如果有有效的链接，允许默认跳转行为，但仍更新激活状态
            else {
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                // 允许浏览器正常跳转
            }
        });
    });
    
    // 初始化分页
    updatePagination();
    
    // 选型报表页面 - 开关切换
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const row = this.closest('tr');
            const selectionName = row.querySelector('td:nth-child(8)').textContent;
            const isChecked = this.checked;
            console.log(`选型 ${selectionName} 采用状态: ${isChecked ? '已采用' : '未采用'}`);
            // 这里可以添加实际的更新逻辑
        });
    });
    
    // 选型报表页面 - 新建电极热水简版按钮
    const addSimpleBtn = document.querySelector('.btn-add-simple');
    if (addSimpleBtn) {
        addSimpleBtn.addEventListener('click', function() {
            alert('新建电极热水简版');
            // 这里可以添加跳转逻辑
        });
    }
    
    // 信息补充弹窗
    const infoSupplementModal = document.getElementById('infoSupplementModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.querySelector('.btn-cancel-modal');
    const confirmModalBtn = document.querySelector('.btn-confirm-modal');
    const addCustomerBtn = document.querySelector('.btn-add-customer');
    const addProjectBtn = document.querySelector('.btn-add-project');
    
    if (infoSupplementModal) {
        // 关闭弹窗
        function closeModal() {
            infoSupplementModal.classList.remove('show');
            // 清空表单
            const form = document.getElementById('infoSupplementForm');
            if (form) {
                form.reset();
            }
        }
        
        // 点击关闭按钮
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        
        // 点击取消按钮
        if (cancelModalBtn) {
            cancelModalBtn.addEventListener('click', closeModal);
        }
        
        // 点击遮罩层关闭
        infoSupplementModal.addEventListener('click', function(e) {
            if (e.target === infoSupplementModal) {
                closeModal();
            }
        });
        
        // 确定按钮
        if (confirmModalBtn) {
            confirmModalBtn.addEventListener('click', function() {
                const customerName = document.querySelector('#infoSupplementForm .modal-input:first-of-type').value;
                const projectName = document.querySelector('#infoSupplementForm .modal-input:last-of-type').value;
                
                // 这里可以添加保存逻辑
                console.log('客户名称:', customerName);
                console.log('项目名称:', projectName);
                
                // 关闭弹窗
                closeModal();
                
                // 可以添加成功提示
                // alert('信息补充成功！');
            });
        }
        
        // 新增客户按钮
        if (addCustomerBtn) {
            addCustomerBtn.addEventListener('click', function() {
                alert('新增客户功能');
                // 这里可以添加跳转到新增客户页面的逻辑
            });
        }
        
        // 新增项目按钮
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', function() {
                alert('新增项目功能');
                // 这里可以添加跳转到新增项目页面的逻辑
            });
        }
    }
    
    // 新增项目页面表单验证
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        const requiredFields = projectForm.querySelectorAll('.required input, .required select');
        const confirmBtn = document.querySelector('.btn-confirm');
        
        // 表单提交处理
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff4d4f';
                } else {
                    field.style.borderColor = '#d9d9d9';
                }
            });
            
            if (isValid) {
                alert('项目创建成功！');
                // 这里可以添加实际的提交逻辑
                // window.location.href = 'index.html';
            } else {
                alert('请填写所有必填字段！');
            }
        });
        
        // 确定按钮点击
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                projectForm.dispatchEvent(new Event('submit'));
            });
        }
        
        // 输入框焦点事件
        const inputs = projectForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.borderColor = '#1890ff';
            });
            
            input.addEventListener('blur', function() {
                if (!this.value && this.closest('.required')) {
                    this.style.borderColor = '#ff4d4f';
                } else {
                    this.style.borderColor = '#d9d9d9';
                }
            });
        });
    }
    
    // ============================================
    // 数据分析页面功能
    // ============================================
    
    // 初始化图表
    let dataChart = null;
    const chartElement = document.getElementById('dataChart');
    
    if (chartElement && typeof echarts !== 'undefined') {
        dataChart = echarts.init(chartElement);
        
        // 生成模拟数据
        function generateMockData(timeRange = '24h') {
            const now = new Date();
            const data = {
                times: [],
                actual: [],
                upper: [],
                lower: [],
                average: []
            };
            
            const baseValue = 118;
            const upperLimit = 120;
            const lowerLimit = 100;
            
            // 根据时间范围确定数据点数量和时间间隔
            let points, intervalMinutes, formatTime;
            switch(timeRange) {
                case '1h':
                    points = 60;
                    intervalMinutes = 1;
                    formatTime = (date) => date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0');
                    break;
                case '6h':
                    points = 72;
                    intervalMinutes = 5;
                    formatTime = (date) => date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0');
                    break;
                case '7d':
                    points = 168;
                    intervalMinutes = 60;
                    formatTime = (date) => (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':00';
                    break;
                case '30d':
                    points = 120;
                    intervalMinutes = 360;
                    formatTime = (date) => (date.getMonth() + 1) + '月' + date.getDate() + '日';
                    break;
                default: // 24h
                    points = 48;
                    intervalMinutes = 30;
                    formatTime = (date) => date.getHours() + ':' + (date.getMinutes() === 0 ? '00' : '30');
            }
            
            for (let i = points; i >= 0; i--) {
                const time = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
                data.times.push(formatTime(time));
                
                // 生成实时值（在上下限之间波动，有15%概率超标）
                const random = Math.random();
                const waveOffset = Math.sin(i / 5) * 5; // 添加波浪效果
                let actualValue;
                
                if (random < 0.15) {
                    // 超标值
                    actualValue = upperLimit + Math.random() * 8;
                } else {
                    actualValue = baseValue + waveOffset + (Math.random() - 0.5) * 8;
                }
                
                data.actual.push(parseFloat(actualValue.toFixed(1)));
                data.upper.push(upperLimit);
                data.lower.push(lowerLimit);
                
                // 计算均值（更平滑）
                const avgValue = (actualValue * 0.6 + baseValue * 0.4);
                data.average.push(parseFloat(avgValue.toFixed(1)));
            }
            
            return data;
        }
        
        // 绘制图表
        function renderChart(paramType, timeRange) {
            const data = generateMockData(timeRange);
            
            // 根据参数类型设置单位和标题
            const paramConfig = {
                temperature: { unit: '°C', title: '温度趋势分析' },
                pressure: { unit: 'Bar', title: '压力趋势分析' },
                current: { unit: 'A', title: '电流趋势分析' },
                voltage: { unit: 'V', title: '电压趋势分析' },
                waterLevel: { unit: '%', title: '水位趋势分析' },
                power: { unit: 'kW', title: '功率趋势分析' }
            };
            
            const config = paramConfig[paramType] || paramConfig.temperature;
            document.querySelector('.chart-title').textContent = config.title;
            
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
                        showSymbol: true,
                        symbol: 'circle',
                        symbolSize: 4,
                        lineStyle: {
                            width: 4,
                            color: '#1890ff',
                            shadowColor: 'rgba(24, 144, 255, 0.3)',
                            shadowBlur: 10
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
                                width: 5
                            }
                        }
                    },
                    {
                        name: '上限值',
                        type: 'line',
                        data: data.upper,
                        showSymbol: false,
                        lineStyle: {
                            width: 3,
                            color: '#ff4d4f',
                            type: 'dashed',
                            dashOffset: 5
                        },
                        itemStyle: {
                            color: '#ff4d4f'
                        },
                        emphasis: {
                            focus: 'series',
                            lineStyle: {
                                width: 4
                            }
                        }
                    },
                    {
                        name: '下限值',
                        type: 'line',
                        data: data.lower,
                        showSymbol: false,
                        lineStyle: {
                            width: 3,
                            color: '#faad14',
                            type: 'dashed',
                            dashOffset: 5
                        },
                        itemStyle: {
                            color: '#faad14'
                        },
                        emphasis: {
                            focus: 'series',
                            lineStyle: {
                                width: 4
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
                            width: 3,
                            color: '#52c41a'
                        },
                        itemStyle: {
                            color: '#52c41a'
                        },
                        emphasis: {
                            focus: 'series',
                            lineStyle: {
                                width: 4
                            }
                        }
                    }
                ],
                animation: true,
                animationDuration: 1000,
                animationEasing: 'cubicOut'
            };
            
            dataChart.setOption(option);
        }
        
        // 初始渲染（确保图表在页面加载时立即显示）
        setTimeout(() => {
            renderChart('temperature', '24h');
        }, 100);
        
        // 查询按钮
        const queryBtn = document.getElementById('queryBtn');
        const paramTypeSelect = document.getElementById('paramType');
        const timeRangeSelect = document.getElementById('timeRange');
        
        if (queryBtn && paramTypeSelect && timeRangeSelect) {
            queryBtn.addEventListener('click', function() {
                const paramType = paramTypeSelect.value;
                const timeRange = timeRangeSelect.value;
                
                console.log('查询参数:', paramType, timeRange); // 调试输出
                
                renderChart(paramType, timeRange);
                updateStats(paramType);
            });
        }
        
        // 更新统计数据
        function updateStats(paramType) {
            // 模拟更新统计卡片数据
            const stats = {
                temperature: { current: '125.8°C', avg: '118.6°C', max: '128.4°C', min: '108.2°C' },
                pressure: { current: '1.52Bar', avg: '1.45Bar', max: '1.68Bar', min: '1.32Bar' },
                current: { current: '82.5A', avg: '78.3A', max: '88.2A', min: '72.1A' },
                voltage: { current: '385V', avg: '380V', max: '392V', min: '375V' },
                waterLevel: { current: '75.3%', avg: '72.8%', max: '84.5%', min: '65.2%' },
                power: { current: '285kW', avg: '268kW', max: '312kW', min: '245kW' }
            };
            
            const stat = stats[paramType];
            document.getElementById('currentValue').textContent = stat.current;
            document.getElementById('avgValue').textContent = stat.avg;
            document.getElementById('maxValue').textContent = stat.max;
            document.getElementById('minValue').textContent = stat.min;
        }
        
        // 时间范围变化
        const timeRangeSelect = document.getElementById('timeRange');
        const customTime = document.querySelector('.custom-time');
        if (timeRangeSelect && customTime) {
            timeRangeSelect.addEventListener('change', function() {
                if (this.value === 'custom') {
                    customTime.style.display = 'flex';
                } else {
                    customTime.style.display = 'none';
                }
            });
        }
        
        // 表格展开/收起
        const toggleTableBtn = document.getElementById('toggleTable');
        const dataTableWrapper = document.querySelector('.data-table-wrapper');
        if (toggleTableBtn && dataTableWrapper) {
            toggleTableBtn.addEventListener('click', function() {
                if (dataTableWrapper.style.display === 'none') {
                    dataTableWrapper.style.display = 'block';
                    this.textContent = '收起 ▲';
                    
                    // 填充表格数据
                    fillTableData();
                } else {
                    dataTableWrapper.style.display = 'none';
                    this.textContent = '展开 ▼';
                }
            });
        }
        
        // 填充表格数据
        function fillTableData() {
            const tbody = document.getElementById('dataTableBody');
            if (!tbody || tbody.children.length > 0) return;
            
            const now = new Date();
            for (let i = 0; i < 24; i++) {
                const time = new Date(now.getTime() - i * 60 * 60 * 1000);
                const hour = time.getHours();
                const timeStr = time.getFullYear() + '-' + 
                               String(time.getMonth() + 1).padStart(2, '0') + '-' +
                               String(time.getDate()).padStart(2, '0') + ' ' +
                               String(hour).padStart(2, '0') + ':00';
                
                const actual = (118 + (Math.random() - 0.5) * 20).toFixed(1);
                const upper = 120;
                const lower = 100;
                const avg = (118 + (Math.random() - 0.5) * 10).toFixed(1);
                const status = actual > upper ? 'danger' : actual < lower ? 'warning' : 'normal';
                const statusText = actual > upper ? '超上限' : actual < lower ? '超下限' : '正常';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${timeStr}</td>
                    <td>${actual}°C</td>
                    <td>${upper}°C</td>
                    <td>${lower}°C</td>
                    <td>${avg}°C</td>
                    <td class="status-${status}">${statusText}</td>
                `;
                tbody.appendChild(row);
            }
        }
        
        // 导出按钮
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                alert('导出功能开发中...');
            });
        }
        
        // 响应式调整
        window.addEventListener('resize', function() {
            if (dataChart) {
                dataChart.resize();
            }
        });
    }
});
