require('dotenv').config();
const EnergySavingScraper = require('./scraper');

async function main() {
  console.log('=== 節能率自動化監控系統 ===');
  
  const notionToken = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  const targetUrl = process.env.TARGET_URL || 'http://192.168.50.143:8502/';
  
  if (!notionToken || !databaseId) {
    console.log('⚠️  未設置 Notion 配置，將只顯示抓取結果而不更新資料庫');
    console.log('請複製 .env.example 為 .env 並填入您的 Notion Token 和 Database ID');
  }
  
  const scraper = new EnergySavingScraper(notionToken, databaseId);
  
  try {
    await scraper.run(targetUrl);
    console.log('✅ 執行完成');
  } catch (error) {
    console.error('❌ 執行失敗:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}