#!/bin/bash

# 设置环境变量
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# 定义项目目录
PROJECT_DIR="/Users/shenyandu/Desktop/mainshibaodian"

# 定义日志文件
LOG_FILE="/Users/shenyandu/Desktop/mainshibaodian/git_auto.log"

# 定义提交信息
COMMIT_MSG="Auto commit at $(date +'%Y-%m-%d %H:%M:%S')"

# 记录日志函数
log() {
    echo "$(date +'%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

log "Starting auto pull and push script"

# 进入项目目录
cd "$PROJECT_DIR" || { log "Failed to enter project directory"; exit 1; }

# 拉取最新代码
log "Pulling latest code"
git pull 2>&1 | tee -a "$LOG_FILE"

# 检查是否有未提交的更改
if [[ -n $(git status --porcelain) ]]; then
    log "Uncommitted changes found. Adding changes"
    git add . 2>&1 | tee -a "$LOG_FILE"
    log "Committing changes with message: $COMMIT_MSG"
    git commit -m "$COMMIT_MSG" 2>&1 | tee -a "$LOG_FILE"
    log "Pushing changes to remote repository"
    git push 2>&1 | tee -a "$LOG_FILE"
else
    log "No uncommitted changes found"
fi

log "Script finished"
