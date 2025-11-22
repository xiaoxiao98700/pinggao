// 页面交互功能

document.addEventListener('DOMContentLoaded', function() {
    // 表单验证
    const form = document.getElementById('projectForm');
    const requiredFields = form.querySelectorAll('.required input, .required select');
    
    // 表单提交处理
    form.addEventListener('submit', function(e) {
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
            alert('表单提交成功！');
            // 这里可以添加实际的提交逻辑
        } else {
            alert('请填写所有必填字段！');
        }
    });
    
    // 输入框焦点事件
    const inputs = form.querySelectorAll('input, select, textarea');
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
    
    // 确定按钮点击
    const confirmBtn = document.querySelector('.btn-confirm');
    confirmBtn.addEventListener('click', function() {
        form.dispatchEvent(new Event('submit'));
    });
    
    // 取消按钮点击
    const cancelBtn = document.querySelector('.btn-cancel');
    cancelBtn.addEventListener('click', function() {
        if (confirm('确定要取消吗？未保存的数据将丢失。')) {
            form.reset();
            // 重置项目编号为默认值
            const projectNumber = form.querySelector('input[type="text"][value="PE2025-11-1301"]');
            if (projectNumber) {
                projectNumber.value = 'PE2025-11-1301';
            }
        }
    });
    
    // 返回按钮
    const backBtn = document.querySelector('.btn-back');
    backBtn.addEventListener('click', function() {
        if (confirm('确定要返回吗？未保存的数据将丢失。')) {
            window.history.back();
        }
    });
    
    // 标签页切换
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 导航菜单项点击
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 日期输入框的默认值处理
    const dateInputs = form.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('change', function() {
            // 可以在这里添加日期验证逻辑
        });
    });
    
    // 数字输入框验证
    const numberInputs = form.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });
    
    // 下拉框占位符样式
    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
        if (!select.value) {
            select.style.color = '#999';
        }
        select.addEventListener('change', function() {
            if (this.value) {
                this.style.color = '#333';
            } else {
                this.style.color = '#999';
            }
        });
    });
});

