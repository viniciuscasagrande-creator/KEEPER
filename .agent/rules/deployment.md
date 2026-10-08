---
name: deployment-vercel-rule
description: Regra fixa de exibição e atualização do link oficial de produção Vercel após qualquer commit ou deploy
trigger: always_on
---

# Regra Fixa de Deploy e Produção

Sempre que realizar operações de Git (commit, push) ou deploy neste repositório:
1. Deve-se **obrigatoriamente informar e destacar o link de acesso principal**:
   👉 **URL Oficial:** https://keeper-tng6.vercel.app/
2. Confirmar que a versão mais recente com os novos módulos e código está acessível através desse link.
