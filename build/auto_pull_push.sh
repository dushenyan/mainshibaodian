#!/bin/bash

# 设置环境变量
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# 定义项目目录
PROJECT_DIR="/Users/shenyandu/Desktop/mainshibaodian"

# 定义日志文件
LOG_FILE="/Users/shenyandu/Desktop/mainshibaodian/build/git_auto.log"

# 定义提交信息
COMMIT_MSG="自动提交于 $(date +'%Y-%m-%d %H:%M:%S')"

# 记录日志函数
log() {
    echo "$(date +'%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

log "-------------------------------"
log "开始执行自动拉取和推送脚本"

# 进入项目目录
cd "$PROJECT_DIR" || { log "无法进入项目目录"; exit 1; }

# 拉取最新代码
log "正在拉取最新代码"
git pull 2>&1 | tee -a "$LOG_FILE"

# 检查是否有未提交的更改
if [[ -n $(git status --porcelain) ]]; then
    log "发现未提交的更改，正在添加更改"
    git add . 2>&1 | tee -a "$LOG_FILE"
    log "正在使用以下信息提交更改：$COMMIT_MSG"
    git commit -m "$COMMIT_MSG" 2>&1 | tee -a "$LOG_FILE"
    log "正在将更改推送到远程仓库"
    git push 2>&1 | tee -a "$LOG_FILE"
else
    log "未发现未提交的更改"
fi

log "脚本执行完毕"
