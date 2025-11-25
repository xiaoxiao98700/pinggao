@echo off
chcp 65001 >nul
echo ========================================
echo 开始回退代码到中午12点之前的状态
echo ========================================
echo.

cd /d "%~dp0"

echo 步骤1: 禁用Git分页器...
set GIT_PAGER=
set PAGER=
git config --global core.pager ""

echo.
echo 步骤2: 回退3个提交...
git reset --hard HEAD~3

echo.
echo 步骤3: 查看当前HEAD...
git rev-parse --short HEAD

echo.
echo 步骤4: 推送到GitHub（强制推送）...
git push origin main --force

echo.
echo ========================================
echo 操作完成！
echo ========================================
pause

