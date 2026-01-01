# Food Order - モバイルオーダーアプリ

飲食店向けLINEミニアプリ モバイルオーダーシステム

## 機能

- メニュー表示・注文
- カート機能
- 注文履歴確認
- 店員呼び出し
- お会計依頼
- LINE公式アカウントへの通知

## 技術スタック

- **フロントエンド**: React + TypeScript + Vite + Tailwind CSS
- **バックエンド**: Express + TypeScript + Prisma + SQLite
- **状態管理**: Zustand
- **LINE連携**: LIFF SDK, LINE Messaging API

## ローカル開発

### 1. 依存関係インストール

```bash
# フロントエンド
npm install

# バックエンド
cd server
npm install
```

### 2. データベースセットアップ

```bash
cd server
npx prisma generate --schema=src/prisma/schema.prisma
npx prisma db push --schema=src/prisma/schema.prisma
npm run db:seed
```

### 3. 開発サーバー起動

```bash
# バックエンド（別ターミナル）
cd server
npm run dev

# フロントエンド
npm run dev
```

### 4. ブラウザで確認

http://localhost:3000 を開く

## 環境変数

`.env.example` を参考に `.env` ファイルを作成

```env
VITE_LIFF_ID=your-liff-id
LINE_CHANNEL_ACCESS_TOKEN=your-channel-access-token
LINE_ADMIN_USER_ID=your-admin-user-id
```

## LINE通知設定

1. LINE Developersで Messaging API チャンネルを作成
2. チャンネルアクセストークンを取得
3. 通知先のユーザーIDを取得（LINE公式アカウント管理画面）
4. 環境変数に設定
