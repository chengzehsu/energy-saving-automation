# GitHub Secrets 設置指南

## 需要設置的 Secrets

### 方法 1: 使用 Zeabur CLI Token（推薦）

1. **獲取 Zeabur Token**
   ```bash
   zeabur auth login
   zeabur auth token
   ```

2. **在 GitHub 倉庫設置 Secrets**
   - 前往 https://github.com/chengzehsu/energy-saving-automation/settings/secrets/actions
   - 點擊 "New repository secret"
   - 添加以下 secret：
     
   | Secret 名稱 | 說明 | 取得方式 |
   |------------|------|----------|
   | `ZEABUR_TOKEN` | Zeabur API Token | 執行 `zeabur auth token` |

### 方法 2: 使用用戶名密碼

如果 Token 方式無法使用，可以設置：

| Secret 名稱 | 說明 | 值 |
|------------|------|-----|
| `ZEABUR_USERNAME` | Zeabur 用戶名 | 你的 Zeabur 用戶名 |
| `ZEABUR_PASSWORD` | Zeabur 密碼 | 你的 Zeabur 密碼 |

## 設置步驟

1. 前往 GitHub 倉庫
2. 點擊 "Settings" 標籤
3. 在左側選單選擇 "Secrets and variables" > "Actions"
4. 點擊 "New repository secret"
5. 輸入 Secret 名稱和值
6. 點擊 "Add secret"

## 注意事項

- 這些 secrets 僅用於 CI/CD 自動部署
- Notion 相關的環境變數需要在 Zeabur 後台設置
- 不要在代碼中包含任何敏感資訊