# GitHub Pages 设置指南

## 快速设置步骤

### 步骤 1: 访问仓库设置
1. 打开浏览器，访问：https://github.com/xiaoxiao98700/pinggao
2. 点击仓库顶部的 **Settings** (设置) 标签

### 步骤 2: 启用 GitHub Pages
1. 在左侧导航栏中找到并点击 **Pages**
2. 在 **Source** 下拉菜单中选择：
   - **Branch**: `main`
   - **Folder**: `/ (root)`
3. 点击 **Save** (保存) 按钮

### 步骤 3: 等待部署完成
- GitHub 通常需要 1-2 分钟来部署你的网站
- 页面刷新后，你会看到一条绿色提示：
  ```
  Your site is published at https://xiaoxiao98700.github.io/pinggao/
  ```

### 步骤 4: 访问你的网站
部署完成后，访问：
```
https://xiaoxiao98700.github.io/pinggao/
```

## 注意事项

1. **首次部署可能需要几分钟**：GitHub 需要时间来构建和部署你的网站
2. **后续更新自动部署**：每次你推送代码到 `main` 分支，GitHub Pages 会自动更新
3. **HTTPS 自动启用**：GitHub Pages 自动为你的网站提供 HTTPS 加密

## 自定义域名（可选）

如果你想使用自定义域名：

1. 在仓库的 `Settings > Pages` 中添加你的自定义域名
2. 在你的域名DNS中添加CNAME记录指向 `xiaoxiao98700.github.io`

## 故障排除

### 如果网站无法访问：
1. 检查仓库是否是公开的（Public）或已启用 Pages 访问
2. 确认已正确保存 Pages 设置
3. 等待几分钟后重试（有时需要更长时间）

### 查看部署状态：
1. 访问 `Actions` 标签查看部署日志
2. 检查是否有任何错误信息

## 测试本地构建

在推送前，可以在本地测试：

```bash
# 使用 Python 启动本地服务器
python -m http.server 8000

# 然后在浏览器访问
http://localhost:8000/index.html
```

