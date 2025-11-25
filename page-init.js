// 页面初始化函数 - 用于动态加载的页面
(function() {
    'use strict';
    
    // 初始化页面事件
    window.initPageEvents = function(container) {
        // 如果没有指定容器，使用整个文档
        const scope = container || document;
        
        // 限制单元格文本显示长度
        function truncateTableCellText() {
            const tableCells = scope.querySelectorAll('.data-table td');
            tableCells.forEach(cell => {
                if (cell.querySelector('input[type="checkbox"]') || 
                    cell.classList.contains('actions') || 
                    cell.querySelector('.status-badge')) {
                    return;
                }
                const text = cell.textContent.trim();
                if (text.length > 20) {
                    cell.textContent = text.substring(0, 20) + '...';
                    cell.title = text;
                }
            });
        }
        truncateTableCellText();
        
        // 全选/取消全选 - 使用事件委托
        scope.addEventListener('change', function(e) {
            if (e.target.classList.contains('select-all')) {
                const table = e.target.closest('table');
                if (table) {
                    const rowCheckboxes = table.querySelectorAll('.row-checkbox');
                    rowCheckboxes.forEach(checkbox => {
                        checkbox.checked = e.target.checked;
                    });
                }
            } else if (e.target.classList.contains('row-checkbox')) {
                const table = e.target.closest('table');
                if (table) {
                    const selectAllCheckbox = table.querySelector('.select-all');
                    const rowCheckboxes = table.querySelectorAll('.row-checkbox');
                    if (selectAllCheckbox) {
                        const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
                        const someChecked = Array.from(rowCheckboxes).some(cb => cb.checked);
                        selectAllCheckbox.checked = allChecked;
                        selectAllCheckbox.indeterminate = someChecked && !allChecked;
                    }
                }
            }
        });
        
        // 查询按钮 - 使用事件委托
        scope.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-query') || e.target.closest('.btn-query')) {
                e.preventDefault();
                const btn = e.target.classList.contains('btn-query') ? e.target : e.target.closest('.btn-query');
                const searchSection = btn.closest('.search-section');
                if (searchSection) {
                    const filters = {};
                    const filterInputs = searchSection.querySelectorAll('.filter-input');
                    filterInputs.forEach(input => {
                        const label = input.closest('.filter-item').querySelector('label');
                        if (label) {
                            filters[label.textContent] = input.value.trim();
                        }
                    });
                    console.log('查询条件:', filters);
                    alert('查询功能：' + JSON.stringify(filters, null, 2));
                }
            }
        });
        
        // 重置按钮 - 使用事件委托
        scope.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-reset') || e.target.closest('.btn-reset')) {
                e.preventDefault();
                const btn = e.target.classList.contains('btn-reset') ? e.target : e.target.closest('.btn-reset');
                const searchSection = btn.closest('.search-section');
                if (searchSection) {
                    const filterInputs = searchSection.querySelectorAll('.filter-input');
                    filterInputs.forEach(input => {
                        input.value = '';
                    });
                }
                // 清除客户选中状态
                const customerItems = scope.querySelectorAll('.customer-item');
                customerItems.forEach(item => item.classList.remove('active'));
                
                // 显示所有表格行
                const tables = scope.querySelectorAll('.data-table tbody');
                tables.forEach(tbody => {
                    const rows = tbody.querySelectorAll('tr');
                    rows.forEach(row => {
                        row.style.display = '';
                    });
                });
                console.log('重置筛选条件');
            }
        });
        
        // 展开/收起按钮 - 使用事件委托
        scope.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-expand') || e.target.closest('.btn-expand')) {
                e.preventDefault();
                const btn = e.target.classList.contains('btn-expand') ? e.target : e.target.closest('.btn-expand');
                const searchSection = btn.closest('.search-section');
                if (searchSection) {
                    const isExpanded = searchSection.style.maxHeight === 'none' || !searchSection.style.maxHeight;
                    if (isExpanded) {
                        btn.textContent = '展开';
                        searchSection.style.maxHeight = '120px';
                    } else {
                        btn.textContent = '收起';
                        searchSection.style.maxHeight = 'none';
                    }
                }
            }
        });
        
        // 删除按钮 - 使用事件委托
        scope.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-delete') || e.target.closest('.btn-delete')) {
                e.preventDefault();
                const table = scope.querySelector('.data-table');
                if (table) {
                    const selectedRows = Array.from(table.querySelectorAll('.row-checkbox:checked'));
                    if (selectedRows.length === 0) {
                        alert('请至少选择一条记录');
                        return;
                    }
                    if (confirm(`确定要删除选中的 ${selectedRows.length} 条记录吗？`)) {
                        selectedRows.forEach(checkbox => {
                            const row = checkbox.closest('tr');
                            if (row) {
                                row.remove();
                            }
                        });
                        alert('删除成功');
                    }
                }
            }
        });
        
        // 导出按钮 - 使用事件委托
        scope.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-export') || e.target.closest('.btn-export')) {
                e.preventDefault();
                alert('导出功能');
            }
        });
        
        // 操作链接 - 使用事件委托
        scope.addEventListener('click', function(e) {
            const actionLink = e.target.closest('.action-link');
            if (actionLink) {
                // 如果已经有 onclick 属性，不阻止默认行为，让它执行
                if (actionLink.hasAttribute('onclick')) {
                    return; // 让内联 onclick 执行
                }
                
                e.preventDefault();
                const action = actionLink.textContent.trim();
                const row = actionLink.closest('tr');
                
                if (actionLink.classList.contains('action-no-jump')) {
                    return;
                }
                
                switch(action) {
                    case '签约':
                        if (row) {
                            const projectNumber = row.querySelector('td:nth-child(3)')?.textContent || '';
                            alert(`签约项目：${projectNumber}`);
                        }
                        break;
                    case '删除':
                        if (confirm('确定要删除这条记录吗？')) {
                            if (row) {
                                row.remove();
                                alert('删除成功');
                            }
                        }
                        break;
                    case '信息补充':
                        const modal = document.getElementById('infoSupplementModal');
                        if (modal) {
                            modal.style.display = 'flex';
                        }
                        break;
                    case '编辑':
                        // 编辑操作通常有 onclick，这里作为备选
                        break;
                    case '详情':
                        // 详情操作通常有 onclick，这里作为备选
                        break;
                    case '查看详情':
                        // 查看详情操作通常有 onclick，这里作为备选
                        break;
                    case '导出':
                        // 导出操作通常有 onclick，这里作为备选
                        break;
                }
            }
        });
        
        // 分页按钮 - 使用事件委托
        scope.addEventListener('click', function(e) {
            if (e.target.classList.contains('page-btn')) {
                e.preventDefault();
                const btn = e.target;
                if (btn.disabled) return;
                
                const text = btn.textContent.trim();
                const pagination = btn.closest('.pagination');
                if (!pagination) return;
                
                const pageInput = pagination.querySelector('.page-input');
                let currentPage = parseInt(pageInput?.value || 1);
                
                if (text === '<') {
                    if (currentPage > 1) {
                        currentPage--;
                        if (pageInput) pageInput.value = currentPage;
                        updatePaginationButtons(pagination, currentPage);
                    }
                } else if (text === '>') {
                    currentPage++;
                    if (pageInput) pageInput.value = currentPage;
                    updatePaginationButtons(pagination, currentPage);
                } else if (!isNaN(parseInt(text))) {
                    currentPage = parseInt(text);
                    if (pageInput) pageInput.value = currentPage;
                    updatePaginationButtons(pagination, currentPage);
                }
            }
        });
        
        // 分页输入框
        scope.addEventListener('keypress', function(e) {
            if (e.target.classList.contains('page-input') && e.key === 'Enter') {
                const page = parseInt(e.target.value);
                if (page > 0) {
                    const pagination = e.target.closest('.pagination');
                    if (pagination) {
                        updatePaginationButtons(pagination, page);
                    }
                }
            }
        });
        
        // 每页条数选择
        scope.addEventListener('change', function(e) {
            if (e.target.classList.contains('page-size')) {
                const size = parseInt(e.target.value);
                console.log('每页显示:', size);
                const pagination = e.target.closest('.pagination');
                if (pagination) {
                    const pageInput = pagination.querySelector('.page-input');
                    if (pageInput) {
                        pageInput.value = 1;
                        updatePaginationButtons(pagination, 1);
                    }
                }
            }
        });
        
        // 客户列表搜索
        scope.addEventListener('input', function(e) {
            if (e.target.classList.contains('customers-input')) {
                const searchText = e.target.value.toLowerCase().trim();
                const customersList = e.target.closest('.customers-section')?.querySelector('.customers-list');
                if (customersList) {
                    const customerItems = customersList.querySelectorAll('.customer-item');
                    customerItems.forEach(item => {
                        const text = item.textContent.toLowerCase();
                        if (text.includes(searchText)) {
                            item.style.display = '';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                }
            }
        });
        
        // 客户项点击
        scope.addEventListener('click', function(e) {
            if (e.target.classList.contains('customer-item')) {
                const customerItems = scope.querySelectorAll('.customer-item');
                customerItems.forEach(i => i.classList.remove('active'));
                e.target.classList.add('active');
                
                const customer = e.target.getAttribute('data-customer');
                console.log('选中客户:', customer);
            }
        });
        
        // 标签页关闭
        scope.addEventListener('click', function(e) {
            if (e.target.classList.contains('tab-close')) {
                e.stopPropagation();
                const tab = e.target.closest('.tab');
                if (tab && confirm('确定要关闭此标签吗？')) {
                    tab.remove();
                }
            }
        });
        
        // 开关切换
        scope.addEventListener('change', function(e) {
            if (e.target.type === 'checkbox' && e.target.closest('.toggle-switch')) {
                const row = e.target.closest('tr');
                if (row) {
                    const selectionName = row.querySelector('td:nth-child(3)')?.textContent || '';
                    const isChecked = e.target.checked;
                    console.log(`选型 ${selectionName} 采用状态: ${isChecked ? '已采用' : '未采用'}`);
                }
            }
        });
        
        // 模态框关闭
        scope.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal-close') || 
                e.target.classList.contains('btn-cancel-modal') ||
                (e.target.classList.contains('modal-overlay') && e.target.id)) {
                const modal = e.target.closest('.modal-overlay') || 
                             (e.target.classList.contains('modal-overlay') ? e.target : null);
                if (modal) {
                    modal.style.display = 'none';
                }
            }
        });
        
        // 表单提交 - 确定按钮
        scope.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-confirm') || e.target.closest('.btn-confirm')) {
                e.preventDefault();
                const btn = e.target.classList.contains('btn-confirm') ? e.target : e.target.closest('.btn-confirm');
                const form = scope.querySelector('form');
                if (form) {
                    // 触发表单提交事件
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    form.dispatchEvent(submitEvent);
                } else {
                    // 如果没有表单，执行默认操作
                    alert('操作已确认');
                }
            }
        });
        
        // 表单提交处理
        scope.addEventListener('submit', function(e) {
            if (e.target.tagName === 'FORM') {
                e.preventDefault();
                const form = e.target;
                
                // 验证必填字段
                const requiredFields = form.querySelectorAll('.required input, .required select, .required textarea');
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
                    console.log('表单提交:', new FormData(form));
                    alert('保存成功');
                    // 这里可以添加实际的保存逻辑
                } else {
                    alert('请填写所有必填字段');
                }
            }
        });
        
        // 输入框焦点事件
        scope.addEventListener('focus', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
                e.target.style.borderColor = '#1890ff';
            }
        }, true);
        
        scope.addEventListener('blur', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
                const field = e.target;
                if (!field.value && field.closest('.required')) {
                    field.style.borderColor = '#ff4d4f';
                } else {
                    field.style.borderColor = '#d9d9d9';
                }
            }
        }, true);
    };
    
    // 更新分页按钮状态
    function updatePaginationButtons(pagination, currentPage) {
        const pageBtns = pagination.querySelectorAll('.page-btn');
        pageBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.disabled = false;
            
            const text = btn.textContent.trim();
            if (text === '<') {
                btn.disabled = currentPage <= 1;
            } else if (text === '>') {
                // 这里可以根据总页数判断，暂时不限制
            } else if (!isNaN(parseInt(text)) && parseInt(text) === currentPage) {
                btn.classList.add('active');
            }
        });
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.initPageEvents();
        });
    } else {
        window.initPageEvents();
    }
})();

