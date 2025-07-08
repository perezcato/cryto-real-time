# Crypto Price Tracker

A full-stack application that displays real-time cryptocurrency prices (BTC, ETH, USDT) using data streamed from the CoinMetrics WebSocket API. The backend Node.js server relays this data to a modern Next.js/React frontend.

## Features
- **Live Price Updates:** Real-time price tracking for Bitcoin, Ethereum, and Tether.
- **WebSocket Architecture:** Efficient, low-latency updates using WebSockets end-to-end.
- **Modern UI:** Responsive, dark-themed interface built with Next.js, React, and Tailwind CSS.
- **Status Indicator:** Visual feedback for WebSocket connection status.

## Architecture
```
CoinMetrics API
      |
      v
[ Node.js WebSocket Server ]
      |
      v
[ Next.js/React Frontend ]
```

- The backend connects to the CoinMetrics API and relays price updates to all connected frontend clients via WebSocket.
- The frontend displays live prices, price changes, and connection status.

## Monorepo Structure
- `server/` — Node.js WebSocket relay server (TypeScript)
- `ui/` — Next.js/React frontend (TypeScript, Tailwind CSS)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (install globally with `npm i -g pnpm`)

### 1. Install Dependencies
```
pnpm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the `server/` directory with your [CoinMetrics API key](https://docs.coinmetrics.io/api/v4#section/Authentication):

```
COINMETRICS_API_KEY=your_coinmetrics_api_key_here
PORT=8080 # (optional, default: 8080)
```

### 3. Build the Project
```
pnpm run build
```

### 4. Start the Application
```
pnpm run start
```
This will start both the server and the UI concurrently.

- The backend WebSocket server runs on `ws://localhost:8080` (by default).
- The frontend UI runs on `http://localhost:3000`.

### 5. Development Mode
For hot-reloading in both server and UI:
```
pnpm run dev
```

## Usage
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- You will see live price cards for BTC, ETH, and USDT.
- The colored dot in the header shows the WebSocket connection status.

## Scripts
- `pnpm run build` — Build both server and UI
- `pnpm run start` — Start both server and UI
- `pnpm run dev` — Start both in development mode (hot reload)

## Tech Stack
- **Backend:** Node.js, TypeScript, ws, dotenv
- **Frontend:** Next.js, React, Tailwind CSS
- **Monorepo:** pnpm workspaces

## Environment Variables
- `COINMETRICS_API_KEY` (required, in `server/.env`): Your CoinMetrics API key
- `PORT` (optional, in `server/.env`): Port for the backend WebSocket server (default: 8080)
- `NEXT_PUBLIC_WS_URL` (optional, in `ui/.env`): WebSocket URL for the frontend (default: ws://localhost:8080)

## License
ISC

---

*Built for educational/demo purposes. Not for production trading use.* 