# Diretório de Backups do Keeper ERP

Este diretório contém os backups e snapshots do repositório em formato comprimido (.zip).

## Arquivos Principais:
- `keeper_backup_latest.zip`: Cópia fiel do snapshot mais recente da branch principal de produção.
- `keeper_backup_global_20261013_1056.zip`: **Backup Global Completo** contendo todos os módulos (`apps/api`, `apps/web`, `apps/worker`), pacotes compartilhados (`@erp/*`), banco de dados Prisma e documentação pós-auditoria de segurança.
- `keeper_backup_YYYYMMDD_HHMM.zip`: Snapshots históricos preservados para fins de auditoria, conformidade e contingência.

## Geração de Novo Backup Global:
```powershell
git archive -o keeper_backup_latest.zip HEAD
Copy-Item keeper_backup_latest.zip backups/keeper_backup_latest.zip -Force
Copy-Item keeper_backup_latest.zip "backups/keeper_backup_global_$(Get-Date -Format 'yyyyMMdd_HHmm').zip" -Force
```
