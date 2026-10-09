#!/usr/bin/env bash
# =============================================================================
# KEEPER ERP — Automated Production Cloud Deployment Script
# Supports: AWS EC2, DigitalOcean Droplets, Hetzner Cloud, Ubuntu 22.04 / 24.04
# =============================================================================

set -e

# Terminal colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================================================${NC}"
echo -e "${CYAN}🚀 INICIANDO DEPLOY DE PRODUÇÃO — KEEPER ERP${NC}"
echo -e "${CYAN}   Frontend Oficial: https://keeper-tng6.vercel.app/${NC}"
echo -e "${BLUE}=====================================================================${NC}"

# 1. Check Docker and Docker Compose
echo -e "\n${YELLOW}[1/6] Verificando dependências de infraestrutura...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado. Instale o Docker antes de continuar.${NC}"
    exit 1
fi

if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    echo -e "${RED}❌ Docker Compose não encontrado.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker e Docker Compose disponíveis.${NC}"

# 2. Check Environment Variables
echo -e "\n${YELLOW}[2/6] Validando arquivo de configuração (.env.production)...${NC}"
if [ ! -f ".env.production" ]; then
    if [ -f ".env" ]; then
        echo -e "${YELLOW}⚠️ Arquivo .env.production não encontrado, utilizando .env existente.${NC}"
        ENV_FILE=".env"
    elif [ -f ".env.production.example" ]; then
        echo -e "${YELLOW}⚠️ Criando .env.production a partir do template .env.production.example...${NC}"
        cp .env.production.example .env.production
        ENV_FILE=".env.production"
    else
        echo -e "${RED}❌ Arquivo de ambiente não encontrado.${NC}"
        exit 1
    fi
else
    ENV_FILE=".env.production"
fi
echo -e "${GREEN}✓ Arquivo de ambiente carregado: ${ENV_FILE}${NC}"

# 3. Pull Base Images and Build Containers
echo -e "\n${YELLOW}[3/6] Compilando imagens Docker otimizadas (Multi-stage)...${NC}"
$DOCKER_COMPOSE --env-file "$ENV_FILE" -f docker/docker-compose.prod.yml build --parallel

# 4. Start Infrastructure (Postgres, Redis, RabbitMQ)
echo -e "\n${YELLOW}[4/6] Inicializando banco de dados e message brokers...${NC}"
$DOCKER_COMPOSE --env-file "$ENV_FILE" -f docker/docker-compose.prod.yml up -d postgres redis rabbitmq

echo -e "Aguardando inicialização dos serviços base (healthchecks)..."
sleep 8

# 5. Start API & Worker
echo -e "\n${YELLOW}[5/6] Subindo Keeper REST API e Background Worker...${NC}"
$DOCKER_COMPOSE --env-file "$ENV_FILE" -f docker/docker-compose.prod.yml up -d api worker

# 6. Verify Health Status
echo -e "\n${YELLOW}[6/6] Verificando integridade e saúde dos containers...${NC}"
sleep 5
$DOCKER_COMPOSE --env-file "$ENV_FILE" -f docker/docker-compose.prod.yml ps

echo -e "\n${GREEN}=====================================================================${NC}"
echo -e "${GREEN}🎉 DEPLOY CONCLUÍDO COM SUCESSO!${NC}"
echo -e "${GREEN}=====================================================================${NC}"
echo -e "🔗 Frontend de Produção: ${CYAN}https://keeper-tng6.vercel.app/${NC}"
echo -e "🔗 API REST Local/VPS:  ${CYAN}http://localhost:4000/api/v1${NC}"
echo -e "📚 Swagger UI:          ${CYAN}http://localhost:4000/api/docs${NC}"
echo -e "🐇 RabbitMQ Management: ${CYAN}http://localhost:15672${NC}"
echo -e "❤️ Healthcheck Probe:   ${CYAN}http://localhost:4000/api/v1/health${NC}"
echo -e "${GREEN}=====================================================================${NC}\n"
