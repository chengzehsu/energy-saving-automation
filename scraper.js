const { chromium } = require('playwright');
const { Client } = require('@notionhq/client');

class EnergySavingScraper {
  constructor(notionToken, databaseId) {
    this.notion = new Client({ auth: notionToken });
    this.databaseId = databaseId;
  }

  async scrapeWebsite(url) {
    console.log('啟動瀏覽器...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      console.log(`導航到 ${url}...`);
      await page.goto(url, { waitUntil: 'networkidle' });
      
      // 等待頁面載入完成
      await page.waitForTimeout(3000);
      
      // 嘗試提取頁面上的節能相關資訊
      const data = await page.evaluate(() => {
        const result = {
          統計區間: '',
          基線標準: '',
          目前數據: '',
          節能率: '',
          目標節能率: ''
        };

        const textContent = document.body.innerText;
        
        // 提取平均節能率
        const avgEfficiencyMatch = textContent.match(/平均節能率\s*(\d+\.?\d*)%/);
        if (avgEfficiencyMatch) {
          result.節能率 = avgEfficiencyMatch[1] + '%';
        }

        // 提取統計資訊
        const totalRecordsMatch = textContent.match(/總記錄數\s*(\d+)/);
        const systemEfficiencyMatch = textContent.match(/系統效率記錄\s*(\d+)/);
        const coolerEfficiencyMatch = textContent.match(/冰機效率記錄\s*(\d+)/);

        // 組合目前數據
        const currentData = [];
        if (totalRecordsMatch) currentData.push(`總記錄數: ${totalRecordsMatch[1]}`);
        if (systemEfficiencyMatch) currentData.push(`系統效率記錄: ${systemEfficiencyMatch[1]}`);
        if (coolerEfficiencyMatch) currentData.push(`冰機效率記錄: ${coolerEfficiencyMatch[1]}`);
        
        result.目前數據 = currentData.join(', ');
        
        // 設定統計區間為當前日期
        result.統計區間 = new Date().toLocaleDateString('zh-TW');
        
        // 基線標準設為平台標準值（可根據實際需求調整）
        result.基線標準 = '案場節能率檢視平台統計';

        return {
          ...result,
          提取詳情: {
            平均節能率: avgEfficiencyMatch ? avgEfficiencyMatch[1] + '%' : '未找到',
            總記錄數: totalRecordsMatch ? totalRecordsMatch[1] : '未找到',
            系統效率記錄: systemEfficiencyMatch ? systemEfficiencyMatch[1] : '未找到',
            冰機效率記錄: coolerEfficiencyMatch ? coolerEfficiencyMatch[1] : '未找到'
          }
        };
      });

      console.log('提取的資料:', data);
      return data;
      
    } catch (error) {
      console.error('抓取網頁時出錯:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async updateNotionDatabase(data) {
    try {
      console.log('更新 Notion 資料庫...');
      
      const response = await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties: {
          '統計區間': {
            title: [
              {
                text: {
                  content: data.統計區間 || new Date().toISOString().split('T')[0]
                }
              }
            ]
          },
          '基線標準': {
            rich_text: [
              {
                text: {
                  content: data.基線標準 || '待提取'
                }
              }
            ]
          },
          '目前數據': {
            rich_text: [
              {
                text: {
                  content: data.目前數據 || '待提取'
                }
              }
            ]
          },
          '節能率（%）': {
            number: data.節能率 ? parseFloat(data.節能率.replace('%', '')) : null
          },
          '目標節能率（%）': {
            number: data.目標節能率 ? parseFloat(data.目標節能率.replace('%', '')) : null
          }
        }
      });

      console.log('Notion 更新成功:', response.id);
      return response;
      
    } catch (error) {
      console.error('更新 Notion 時出錯:', error);
      throw error;
    }
  }

  async run(url) {
    try {
      const data = await this.scrapeWebsite(url);
      
      if (this.databaseId && this.notion) {
        await this.updateNotionDatabase(data);
      } else {
        console.log('未設置 Notion 配置，僅顯示抓取結果:');
        console.log(data);
      }
      
    } catch (error) {
      console.error('執行過程中出錯:', error);
    }
  }
}

module.exports = EnergySavingScraper;

// 如果直接執行此檔案
if (require.main === module) {
  const scraper = new EnergySavingScraper(
    process.env.NOTION_TOKEN,
    process.env.NOTION_DATABASE_ID
  );
  
  scraper.run('http://192.168.50.143:8502/');
}