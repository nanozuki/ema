# vi:ft=make

set shell := ["fish", "-c"]

image := "asia-southeast1-docker.pkg.dev/crows-moe/images/ema"

default:
	just --list

gen-migration:
	pnpm drizzle-kit generate:pg

build-image TAG:
	docker build --platform=linux/amd64 -t {{image}}:{{TAG}} .
	docker push {{image}}:{{TAG}}

migrate:
	pnpx tsx ./src/lib/server/data/migrate.ts

run-dev-db:
	docker run --name ema-db -p 5432:5432 \
		-e POSTGRES_PASSWORD=ema -e POSTGRES_USER=ema -e POSTGRES_DB=ema \
		-e PGDATA=/var/lib/postgresql/data/pgdata -v $(pwd)/devdata/pgdata:/var/lib/postgresql/data \
		-d postgres

clean-dev-db:
	docker stop ema-db && docker rm ema-db && rm -rf devdata/pgdata

dev-migrate:
	EMA_POSTGRES_URL=postgresql://ema:ema@localhost:5432/ema pnpx tsx ./src/lib/server/data/migrate.ts

dev-server:
	EMA_POSTGRES_URL=postgresql://ema:ema@localhost:5432/ema \
		EMA_JWT_SECRET=secret \
		EMA_INVITE_KEY=invite \
		pnpm run dev

node-server:
	EMA_POSTGRES_URL=postgresql://ema:ema@localhost:5432/ema \
		EMA_JWT_SECRET=secret \
		EMA_INVITE_KEY=invite \
		node build
