# 智选方案 - 项目管理页面

这是一个项目管理系统的前端页面，包含完整的项目信息表单和合同信息字段。

## 预览方式

### 🌐 GitHub Pages 在线预览（推荐）

页面已配置 GitHub Pages 自动部署，访问地址：
**https://xiaoxiao98700.github.io/pinggao/**

> **已配置 GitHub Actions 自动部署：**
> - ✅ 已创建 `.github/workflows/deploy.yml` 工作流文件
> - ✅ 每次推送到 `main` 分支会自动触发部署
> 
> **首次启用 GitHub Pages 的步骤：**
> 1. 进入仓库：https://github.com/xiaoxiao98700/pinggao
> 2. 点击 **Settings（设置）**
> 3. 在左侧菜单找到 **Pages**
> 4. 在 **Source** 下选择 **"GitHub Actions"**
> 5. 保存后，工作流会自动运行并部署页面
> 6. 部署完成后，访问地址：https://xiaoxiao98700.github.io/pinggao/

### 方式一：直接打开（最简单）
1. 双击 `index.html` 文件
2. 文件会在默认浏览器中打开并显示页面

### 方式二：使用本地服务器

#### 使用 Python（如果已安装 Python）
```bash
# Python 3.x
python -m http.server 8000

# 然后在浏览器中访问：http://localhost:8000
```

#### 使用 Node.js（如果已安装 Node.js）
```bash
# 安装 http-server（如果还没有安装）
npm install -g http-server

# 启动服务器
http-server

# 然后在浏览器中访问显示的地址（通常是 http://localhost:8080）
```

#### 使用 VS Code Live Server 扩展
1. 在 VS Code 中安装 "Live Server" 扩展
2. 右键点击 `index.html` 文件
3. 选择 "Open with Live Server"

## 文件说明

- `index.html` - 主页面文件，包含完整的HTML结构
- `styles.css` - 样式文件，包含所有页面样式
- `script.js` - JavaScript文件，包含表单验证和交互功能

## 功能特性

- ✅ 完整的项目信息表单
- ✅ 所有必填字段标记（红色*号）
- ✅ 合同信息字段（红色箭头指向的字段）
- ✅ 表单验证功能
- ✅ 响应式设计
- ✅ 现代化UI界面
- ✅ 设备检测数据分析功能
  - 支持多参数类型查询（温度、压力、液位、电流、电压、功率、流量、频率）
  - 实时数据折线图（实时值实线，上限/下限/均值虚线）
  - 实时数据表格展示
  - 时间范围查询

## 页面结构

1. **顶部导航栏** - 包含logo、公司信息和操作按钮
2. **左侧导航栏** - 包含系统菜单项
3. **主内容区** - 包含项目信息表单和合同信息字段
4. **页脚** - 包含备案信息

## 浏览器兼容性

支持所有现代浏览器：
- Chrome（推荐）
- Firefox
- Edge
- Safari

## 注意事项

- 所有CSS和JavaScript文件都是本地文件，无需网络连接即可预览
- 表单提交功能目前是演示功能，需要连接后端API才能实现真正的数据提交

