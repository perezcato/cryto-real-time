# Crypto Price Tracker

Track live prices for Bitcoin (BTC), Ethereum (ETH), and Solana (SOL) in real time. This project streams data from the CoinMetrics and Binance WebSocket APIs through a Node.js backend to a sleek Next.js/React frontend.

---

## 🚀 Features

- **Live Crypto Prices:** Instant updates for BTC, ETH, and SOL.
- **WebSocket Streaming:** End-to-end real-time data flow from CoinMetrics and Binance.
- **Modern UI:** Responsive, dark-mode interface with Tailwind CSS.
- **Connection Status:** Visual indicator for WebSocket connectivity.

---

## 🏗️ Architecture

```
CoinMetrics API   Binance API
      │              │
      └──────┬───────┘
             ▼
   [ Node.js WebSocket Server ]
             │
             ▼
   [ Next.js/React Frontend ]
```

- The backend relays price updates from CoinMetrics and Binance to all connected clients.
- The frontend displays live prices, price changes, and connection status.

---

## 🗂️ Monorepo Structure

- `server/` — Node.js WebSocket relay server (TypeScript)
- `ui/` — Next.js/React frontend (TypeScript, Tailwind CSS)

---

## ⚡ Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (`npm i -g pnpm`)

### 1. Install Dependencies

```sh
pnpm install
```

### 2. Configure Environment

Create `server/.env`:

```
COINMETRICS_API_KEY=your_coinmetrics_api_key_here
PORT=8080 # optional, default: 8080
# Add any Binance-specific environment variables here if needed
```

### 3. Build All

```sh
pnpm run build
```

### 4. Start Everything

```sh
pnpm run start
```

- Backend: `ws://localhost:8080`
- Frontend: `http://localhost:3000`

### 5. Development Mode

For hot-reloading:

```sh
pnpm run dev
```

---

## 🖥️ Usage

- Open [http://localhost:3000](http://localhost:3000)
- Watch live price cards for BTC, ETH, and SOL.
- The colored dot in the header shows WebSocket status.

---

## 📜 Scripts

- `pnpm run build` — Build both server and UI
- `pnpm run start` — Start both server and UI
- `pnpm run dev` — Start both in development mode (hot reload)

---

## 🛠️ Tech Stack

- **Backend:** Node.js, TypeScript, ws, dotenv
- **Frontend:** Next.js, React, Tailwind CSS
- **Monorepo:** pnpm workspaces
- **Data Sources:** CoinMetrics WebSocket API, Binance WebSocket API

---

## 🔑 Environment Variables

- `COINMETRICS_API_KEY` (required, in `server/.env`)
- `PORT` (optional, in `server/.env`, default: 8080)
- `NEXT_PUBLIC_WS_URL` (optional, in `ui/.env`, default: ws://localhost:8080)
- (Add any Binance-specific variables if required)

---

## 📄 License

ISC

---

*This project is for educational/demo purposes only. Not for production trading use.* 