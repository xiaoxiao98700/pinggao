// 页面路由和动态加载
(function() {
    'use strict';
    
    // 当前页面
    let currentPage = 'pages/project-info.html';
    
    // 初始化
    document.addEventListener('DOMContentLoaded', function() {
        // 加载默认页面
        loadPage(currentPage);
        
        // 绑定导航点击事件
        bindNavigation();
    });
    
    // 加载页面内容
    function loadPage(pagePath) {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;
        
        // 显示加载状态
        mainContent.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">正在加载...</div>';
        
        // 使用 fetch 加载页面内容
        fetch(pagePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('页面加载失败');
                }
                return response.text();
            })
            .then(html => {
                // 提取 body 中的内容（去掉 body 标签）
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const bodyContent = doc.body.innerHTML;
                
                // 更新主内容区域
                mainContent.innerHTML = bodyContent;
                
                // 更新当前页面
                currentPage = pagePath;
                
                // 更新导航激活状态
                updateActiveNav();
                
                // 初始化页面事件（重新绑定事件监听器）
                if (window.initPageEvents) {
                    window.initPageEvents(mainContent);
                }
                
                // 执行页面特定的脚本（如果有）
                executePageScripts(doc);
            })
            .catch(error => {
                console.error('加载页面失败:', error);
                mainContent.innerHTML = `
                    <div style="padding: 40px; text-align: center;">
                        <h3 style="color: #ff4d4f;">页面加载失败</h3>
                        <p style="color: #999;">${error.message}</p>
                        <button onclick="location.reload()" style="margin-top: 20px; padding: 8px 16px; background: #1890ff; color: #fff; border: none; border-radius: 4px; cursor: pointer;">重新加载</button>
                    </div>
                `;
            });
    }
    
    // 绑定导航事件
    function bindNavigation() {
        // 导航项点击
        document.querySelectorAll('.nav-item[data-page]').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const pagePath = this.getAttribute('data-page');
                if (pagePath && pagePath !== currentPage) {
                    loadPage(pagePath);
                }
            });
        });
        
        // 子菜单展开/收起
        const navParents = document.querySelectorAll('.nav-parent');
        navParents.forEach(parent => {
            parent.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const navGroup = this.closest('.nav-group');
                const submenu = navGroup.querySelector('.nav-submenu');
                
                if (submenu) {
                    const isShow = submenu.classList.contains('show');
                    if (isShow) {
                        submenu.classList.remove('show');
                        navGroup.classList.remove('active');
                    } else {
                        // 关闭其他展开的子菜单
                        document.querySelectorAll('.nav-submenu.show').forEach(menu => {
                            menu.classList.remove('show');
                            menu.closest('.nav-group').classList.remove('active');
                        });
                        submenu.classList.add('show');
                        navGroup.classList.add('active');
                    }
                }
            });
        });
        
        // 子菜单项点击时，不触发父菜单的展开/收起
        const navChildren = document.querySelectorAll('.nav-child');
        navChildren.forEach(child => {
            child.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });
    }
    
    // 更新导航激活状态
    function updateActiveNav() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        document.querySelectorAll('.nav-item[data-page]').forEach(item => {
            if (item.getAttribute('data-page') === currentPage) {
                item.classList.add('active');
                // 如果是子菜单项，确保父菜单展开
                const navGroup = item.closest('.nav-group');
                if (navGroup) {
                    const submenu = navGroup.querySelector('.nav-submenu');
                    if (submenu) {
                        submenu.classList.add('show');
                        navGroup.classList.add('active');
                    }
                }
            }
        });
    }
    
    // 执行页面特定的脚本
    function executePageScripts(doc) {
        const scripts = doc.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            if (oldScript.src) {
                newScript.src = oldScript.src;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            document.body.appendChild(newScript);
        });
    }
    
    // 导出 loadPage 函数供外部调用（如编辑、详情等页面跳转）
    window.loadPage = loadPage;
})();

