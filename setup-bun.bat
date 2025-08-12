@echo off
echo Configurando ambiente Bun para o projeto...

REM Definir variáveis de ambiente do Bun
set BUN_INSTALL=%USERPROFILE%\.bun
set PATH=%BUN_INSTALL%\bin;%PATH%

echo Ambiente configurado!
echo.
echo Comandos disponíveis:
echo   bun install     - Instalar dependências
echo   bun run dev     - Executar servidor de desenvolvimento
echo   bun run build   - Gerar build de produção
echo   bun run preview - Visualizar build de produção
echo   bun run lint    - Executar linter
echo.
