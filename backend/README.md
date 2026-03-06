<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Building blocks for digital commerce
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
    <a href="https://www.producthunt.com/posts/medusa"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Day-%23DA552E" alt="Product Hunt"></a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

## Compatibility

This starter is compatible with versions >= 2 of `@medusajs/medusa`. 

## Getting Started

Visit the [Quickstart Guide](https://docs.medusajs.com/learn/installation) to set up a server.

Visit the [Docs](https://docs.medusajs.com/learn/installation#get-started) to learn more about our system requirements.

## What is Medusa

Medusa is a set of commerce modules and tools that allow you to build rich, reliable, and performant commerce applications without reinventing core commerce logic. The modules can be customized and used to build advanced ecommerce stores, marketplaces, or any product that needs foundational commerce primitives. All modules are open-source and freely available on npm.

Learn more about [Medusa’s architecture](https://docs.medusajs.com/learn/introduction/architecture) and [commerce modules](https://docs.medusajs.com/learn/fundamentals/modules/commerce-modules) in the Docs.

## Community & Contributions

The community and core team are available in [GitHub Discussions](https://github.com/medusajs/medusa/discussions), where you can ask for support, discuss roadmap, and share ideas.

Join our [Discord server](https://discord.com/invite/medusajs) to meet other community members.

## Other channels

- [GitHub Issues](https://github.com/medusajs/medusa/issues)
- [Twitter](https://twitter.com/medusajs)
- [LinkedIn](https://www.linkedin.com/company/medusajs)
- [Medusa Blog](https://medusajs.com/blog/)


### Backup and Restore SQL
```
docker exec medusa_postgres pg_dump -U postgres -d medusa-store > backup.sql

docker exec -it medusa_postgres psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'medusa-store' AND pid <> pg_backend_pid();"

docker exec -it medusa_postgres psql -U postgres -c "DROP DATABASE IF EXISTS \"medusa-store\";"
docker exec -it medusa_postgres psql -U postgres -c "CREATE DATABASE \"medusa-store\";"
docker exec -i medusa_postgres psql -U postgres -d medusa-store < backup.sql

```


### Medusa Modules
#### Product Type
Product Type 是產品的分類標籤，用簡單的字符串值來標識產品類型，例如 "T-Shirt"、"Shoes" 或 "Electronics"。它主要用於過濾和搜尋產品，一個產品可以屬於一個 type，且通常在建立產品時動態創建或選擇。

#### Product Category
Product Category 是階層式的分類系統，支持父子嵌套結構（如 Women > Tops > T-Shirt），幫助客戶導航並過濾產品。一個產品可以屬於多個類別，並可設定排名優先級，主要用於店面瀏覽和分類管理。
​
#### Product Collection
Product Collection 是行銷導向的產品群組，用來集合具有共同主題的產品（如 "Summer Sale" 或 "New Arrivals"），不支持嵌套。一個產品通常只屬於一個 collection，主要用於促銷或特色展示。


手作布袋的例子
假設產品「手作帆布袋」（title: "Handmade Canvas Tote"）：
Product Type: "Bag" – 用於基本類型過濾。
​Product Category: "Accessories > Bags > Tote Bags" – 階層式導航路徑。
​Product Collection: "Summer Handcrafts" – 促銷群組，如夏季手作系列。
​Product Tags: ["handmade", "organic", "beach"] – 多標籤用於精準搜尋，如搜 "handmade" 即可找到。
​

手鏈的例子
假設產品「銀質手鏈」（title: "Sterling Silver Bracelet"）：
Product Type: "Jewelry" – 產品基本類型。
​Product Category: "Jewelry > Bracelets > Silver" – 分層瀏覽分類。
​Product Collection: "New Arrivals" – 新品展示群組。
​roduct Tags: ["silver", "minimalist", "gift"] – 支援多重過濾，如搜 "gift" 顯示禮物相關商品。
​
這些分類互補使用：Type/Category 結構化組織，Collection 行銷導向，Tags 提供彈性標記，提升店面搜尋和導航體驗