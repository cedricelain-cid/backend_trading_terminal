# Trading backend scaffold (NestJS + Hexagonal + Kafka + Postgres)

This repo is a **scaffold** for an event-driven backend that tracks trades on-chain, computes per-user metrics, maintains portfolios, and exposes data via an API (REST + WebSocket).

## Services

- **chain-ingestor-evm** (worker): detects trades and publishes `trading.trades.executed.v1`
- **metrics** (worker): consumes trades and writes `metrics.user_metrics`
- **portfolio** (worker): maintains balances and publishes `portfolio.balances.updated.v1`
- **api** (HTTP + Socket.IO): reads from Postgres schemas `metrics` and `portfolio`, and pushes realtime updates by consuming `portfolio.balances.updated.v1`

## Storage layout (Case 2)

Single Postgres instance, multiple schemas:

- `metrics` schema owned by **metrics**
- `portfolio` schema owned by **portfolio**

`api` connects to the same Postgres DB and can read both schemas.

## Run

1. Start infra

```bash
docker compose up -d
```

2. Configure env

```bash
cp .env.example .env
```

3. Install + run

Be careful: before starting the services, wait a few seconds to make sure Kafka is fully up and running.

```bash
pnpm i
pnpm dev
```

## Test from terminal

### REST

```bash
curl http://localhost:8000/health
curl http://localhost:8000/metrics/0xUserStub
curl http://localhost:8000/balances/0xUserStub
```

### WebSocket (Socket.IO)

This project uses **Socket.IO**, so `wscat` won't work.

```bash
cd test-ws/

node test-ws.js
```
