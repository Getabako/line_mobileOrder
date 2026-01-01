# アーキテクチャ設計書 - Food Order

## システム構成図

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   LINE App      │────▶│   LIFF App      │────▶│   Backend API   │
│   (ユーザー)     │     │   (React)       │     │   (Express)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │   SQLite DB     │
                                               │   (Prisma)      │
                                               └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │  LINE Messaging │
                                               │      API        │
                                               └─────────────────┘
```

## API設計

### メニュー
- `GET /api/menu` - メニュー一覧取得
- `GET /api/menu/:id` - メニュー詳細取得

### 注文
- `POST /api/orders` - 注文作成
- `GET /api/orders` - 注文履歴取得
- `GET /api/orders/:id` - 注文詳細取得
- `PUT /api/orders/:id/status` - 注文ステータス更新

### 店員呼び出し
- `POST /api/call-staff` - 店員呼び出し

### 精算
- `POST /api/checkout` - 精算依頼

## データベース設計

### テーブル
- `User` - ユーザー情報
- `MenuItem` - メニュー項目
- `Order` - 注文
- `OrderItem` - 注文明細
- `StaffCall` - 店員呼び出し履歴
- `Table` - テーブル情報

## 通知フロー

1. ユーザーが注文/呼び出し/精算依頼
2. バックエンドがリクエストを処理
3. LINE Messaging APIで店舗アカウントに通知
