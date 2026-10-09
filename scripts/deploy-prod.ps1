# =============================================================================
# KEEPER ERP — Automated Production Deployment Script (PowerShell)
# =============================================================================

Write-Host "=====================================================================" -ForegroundColor Blue
Write-Host "🚀 INICIANDO DEPLOY DE PRODUÇÃO — KEEPER ERP" -ForegroundColor Cyan
Write-Host "   Frontend Oficial: https://keeper-tng6.vercel.app/" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Blue

# 1. Check Docker
Write-Host "`n[1/6] Verificando Docker e Docker Compose..." -ForegroundColor Yellow
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Docker não encontrado no PATH."
    exit 1
}
Write-Host "✓ Docker detectado." -ForegroundColor Green

# 2. Check Environment Variables
Write-Host "`n[2/6] Validando arquivo de configuração (.env.production)..." -ForegroundColor Yellow
$envFile = ".env.production"
if (-not (Test-Path ".env.production")) {
    if (Test-Path ".env") {
        Write-Host "⚠️ Utilizando .env existente." -ForegroundColor Yellow
        $envFile = ".env"
    } elseif (Test-Path ".env.production.example") {
        Write-Host "⚠️ Criando .env.production a partir do template..." -ForegroundColor Yellow
        Copy-Item ".env.production.example" ".env.production"
    }
}
Write-Host "✓ Arquivo de ambiente ativo: $envFile" -ForegroundColor Green

# 3. Build Containers
Write-Host "`n[3/6] Compilando imagens Docker otimizadas..." -ForegroundColor Yellow
docker compose --env-file $envFile -f docker/docker-compose.prod.yml build

# 4. Start Infrastructure
Write-Host "`n[4/6] Inicializando Postgres, Redis e RabbitMQ..." -ForegroundColor Yellow
docker compose --env-file $envFile -f docker/docker-compose.prod.yml up -d postgres redis rabbitmq
Start-Sleep -Seconds 6

# 5. Start API & Worker
Write-Host "`n[5/6] Subindo Keeper REST API e Background Worker..." -ForegroundColor Yellow
docker compose --env-file $envFile -f docker/docker-compose.prod.yml up -d api worker
Start-Sleep -Seconds 4

# 6. Status
Write-Host "`n[6/6] Verificando containers em execução..." -ForegroundColor Yellow
docker compose --env-file $envFile -f docker/docker-compose.prod.yml ps

Write-Host "`n=====================================================================" -ForegroundColor Green
Write-Host "🎉 DEPLOY CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host "🔗 Frontend Oficial: https://keeper-tng6.vercel.app/" -ForegroundColor Cyan
Write-Host "🔗 API REST:         http://localhost:4000/api/v1" -ForegroundColor Cyan
Write-Host "📚 Swagger UI:       http://localhost:4000/api/docs" -ForegroundColor Cyan
Write-Host "❤️ Healthcheck:      http://localhost:4000/api/v1/health" -ForegroundColor Cyan
Write-Host "=====================================================================`n" -ForegroundColor Green
