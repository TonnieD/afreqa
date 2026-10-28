# ====================================================================
# Afreqa Website — Project Automation Makefile
# ====================================================================

.PHONY: help dev dev-up dev-down build migrate seed test lint typecheck backup restore clean

help:
	@echo "Afreqa Website Management Commands:"
	@echo "  make dev         - Start complete local stack via Docker Compose (web, worker, db, mailpit)"
	@echo "  make dev-down    - Stop and remove local dev containers"
	@echo "  make build       - Build all workspace packages and Docker images"
	@echo "  make migrate     - Run Prisma database migrations"
	@echo "  make seed        - Run database seed script with sample event and fictional DJs"
	@echo "  make test        - Run Vitest unit tests"
	@echo "  make lint        - Run ESLint across monorepo"
	@echo "  make typecheck   - Run TypeScript typecheck across monorepo"
	@echo "  make backup      - Create a compressed PostgreSQL database backup"
	@echo "  make restore     - Restore database from backup file (Usage: make restore FILE=...)"
	@echo "  make clean       - Stop containers and remove build artifacts"

dev:
	docker compose up --build

dev-down:
	docker compose down

build:
	pnpm run build

migrate:
	pnpm run db:migrate

seed:
	pnpm run db:seed

test:
	pnpm run test:unit

lint:
	pnpm run lint

typecheck:
	pnpm run typecheck

backup:
	bash docker/scripts/backup.sh

restore:
	@if [ -z "$(FILE)" ]; then echo "Error: Please specify FILE=<path_to_backup>"; exit 1; fi
	bash docker/scripts/restore.sh $(FILE)

clean:
	docker-compose down -v
	rm -rf node_modules apps/web/.next packages/core/dist worker/dist

