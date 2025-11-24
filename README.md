# 平高项目 - 智选方案管理系统

这是一个基于纯HTML/CSS/JavaScript的项目管理系统，提供项目管理和设备检测功能。

## 功能特性

- 📊 项目管理：项目列表展示、筛选、新增、编辑
- 📈 选型报表：选型方案管理和报表查看
- ⚙️ 电价时段配置：电价时段管理
- 🔍 设备检测：设备监控和数据分析

## 技术栈

- HTML5
- CSS3
- JavaScript (原生)
- GitHub Pages (部署)

## GitHub Pages 部署说明

### 方法一：通过 GitHub 仓库设置（推荐）

1. 访问仓库：https://github.com/xiaoxiao98700/pinggao
2. 点击 **Settings** (设置)
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 部分选择：
   - Branch: `main`
   - Folder: `/ (root)`
5. 点击 **Save** (保存)
6. 等待几分钟，GitHub Pages 会自动生成访问地址

### 方法二：通过 GitHub Actions（已配置）

项目已配置 GitHub Actions 工作流，每次推送到 `main` 分支时会自动部署到 GitHub Pages。

## 访问地址

部署完成后，可通过以下地址访问：

```
https://xiaoxiao98700.github.io/pinggao/
```

## 项目结构

```
├── index.html              # 项目管理主页面
├── selection-report.html   # 选型报表页面
├── price-time-config.html  # 电价时段配置页面
├── device-detection.html   # 设备检测页面
├── add-project.html        # 新增项目页面
├── edit-project.html       # 编辑项目页面
├── detail-project.html     # 项目详情页面
├── add-selection.html      # 新增选型页面
├── styles.css              # 全局样式文件
├── script.js               # 全局脚本文件
└── README.md               # 项目说明文档
```

## 本地开发

1. 克隆仓库
```bash
git clone https://github.com/xiaoxiao98700/pinggao.git
cd pinggao
```

2. 直接在浏览器中打开 `index.html` 即可查看

或者使用本地服务器：
```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx http-server
```

然后在浏览器访问 `http://localhost:8000`

## 更新日志

### 2025-01-XX
- ✨ 重新设计项目列表：精简表格列数，优化视觉呈现
- 🎨 优化表格样式，提升用户体验
- 📱 改进响应式布局

## 许可证

本项目为内部使用项目。

## 联系方式

如有问题，请联系项目维护者。
