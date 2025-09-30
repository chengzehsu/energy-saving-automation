# 節能率自動化監控系統設置指南

## 概述
這個系統會自動從 http://192.168.50.143:8502/ 抓取節能率資訊，並更新到 Notion 資料庫中。

## 安裝與設置

### 1. 安裝依賴套件
```bash
npm install
```

### 2. Notion 設置

#### 步驟 1: 建立 Notion Integration
1. 前往 https://www.notion.so/my-integrations
2. 點擊 "New integration"
3. 填入名稱（例如：節能率監控）
4. 選擇 workspace
5. 點擊 "Submit"
6. 複製 "Internal Integration Token"

#### 步驟 2: 建立 Notion 資料庫
1. 在 Notion 中建立新的資料庫
2. 設置以下欄位：

| 欄位名稱 | 類型 |
|---------|------|
| 統計區間 | Title |
| 基線標準 | Text |
| 目前數據 | Text |
| 節能率（%） | Number |
| 目標節能率（%） | Number |

#### 步驟 3: 分享資料庫給 Integration
1. 在資料庫頁面點擊右上角的 "Share"
2. 點擊 "Invite"
3. 搜尋並選擇您剛建立的 integration
4. 點擊 "Invite"

#### 步驟 4: 取得資料庫 ID
1. 複製資料庫的 URL
2. URL 格式：`https://www.notion.so/{workspace_name}/{database_id}?v={view_id}`
3. 取出 `database_id` 部分（32個字符的字串）

### 3. 環境變數設置
1. 複製 `.env.example` 為 `.env`：
```bash
cp .env.example .env
```

2. 編輯 `.env` 檔案，填入您的設定：
```env
NOTION_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_database_id_here
TARGET_URL=http://192.168.50.143:8502/
```

## 使用方法

### 執行監控
```bash
npm start
```

### 測試模式（不更新 Notion）
如果未設置 Notion 配置，系統會以測試模式運行，只顯示抓取到的資料而不更新資料庫。

## 抓取的資料說明

系統會從目標網址提取以下資訊：
- **統計區間**: 執行日期
- **基線標準**: 案場節能率檢視平台統計
- **目前數據**: 包含總記錄數、系統效率記錄、冰機效率記錄
- **節能率（%）**: 平均節能率
- **目標節能率（%）**: 目前設為空值，可根據需求調整

## 故障排除

### 常見問題
1. **Notion API 錯誤**: 檢查 Token 和 Database ID 是否正確
2. **網頁無法訪問**: 確認目標網址是否可以正常訪問
3. **資料提取失敗**: 檢查目標網頁結構是否有變更

### 日誌查看
執行時會顯示詳細的處理過程，包括：
- 瀏覽器啟動狀態
- 網頁導航過程
- 資料提取結果
- Notion 更新狀態

## 自動化執行

您可以使用 cron（Linux/Mac）或任務排程器（Windows）來定期執行這個腳本：

### macOS/Linux cron 設置
```bash
# 每小時執行一次
0 * * * * cd /path/to/energy-saving-automation && npm start

# 每天早上 9 點執行
0 9 * * * cd /path/to/energy-saving-automation && npm start
```

## 客製化

如果目標網頁結構有變更，可以修改 `scraper.js` 中的資料提取邏輯來適應新的頁面結構。