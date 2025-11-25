# 回退到中午12点之前的提交并推送到GitHub

# 设置环境变量禁用分页器
$env:GIT_PAGER = ""
$env:PAGER = ""

Write-Host "=== 开始回退操作 ===" -ForegroundColor Green

# 查看当前提交
Write-Host "`n当前HEAD位置:" -ForegroundColor Yellow
git log --oneline -5 --no-pager

# 回退3个提交（回到"重新设计项目列表"之前的状态）
Write-Host "`n回退3个提交..." -ForegroundColor Yellow
git reset --hard HEAD~3

# 查看回退后的状态
Write-Host "`n回退后的HEAD位置:" -ForegroundColor Yellow
git log --oneline -5 --no-pager

# 推送到GitHub（强制推送）
Write-Host "`n推送到GitHub..." -ForegroundColor Yellow
git push origin main --force

Write-Host "`n=== 操作完成 ===" -ForegroundColor Green

