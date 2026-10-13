# Diretório de Backups do Keeper ERP

Este diretório contém os backups e snapshots do repositório em formato comprimido (.zip).

## Arquivos:
- `keeper_backup_latest.zip`: Cópia fiel do snapshot mais recente da branch de produção.
- `keeper_backup_YYYYMMDD_HHMM.zip`: Snapshots históricos preservados para fins de auditoria e contingência.

## Geração de Novo Backup:
```bash
git archive -o keeper_backup_latest.zip HEAD
Copy-Item keeper_backup_latest.zip backups/
```
