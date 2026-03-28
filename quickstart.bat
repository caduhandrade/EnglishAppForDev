@echo off
REM Quick Start Script para English Tech App (Windows)

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   English Tech App - Quick Start
echo ========================================
echo.

REM Verificar Docker
echo [*] Verificando Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Docker nao encontrado!
    echo [!] Instale em: https://www.docker.com
    pause
    exit /b 1
)
echo [OK] Docker encontrado

REM Verificar Docker Compose
echo [*] Verificando Docker Compose...
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Docker Compose nao encontrado
    pause
    exit /b 1
)
echo [OK] Docker Compose encontrado

echo.
echo Opcoes disponiveis:
echo.
echo 1 - Iniciar com Docker Compose ^(recomendado^)
echo 2 - Build manual + Docker run
echo 3 - Desenvolvimento ^(npm run dev^)
echo 4 - Limpar tudo e reconstruir
echo.
set /p option="Digite o numero (1-4): "

if "%option%"=="1" (
    echo.
    echo [*] Iniciando com Docker Compose...
    docker-compose up -d
    if %errorlevel% equ 0 (
        echo [OK] Aplicacao iniciada!
        echo.
        echo =====================================
        echo   Acesse em: http://localhost:3000
        echo   API: http://localhost:3000/api
        echo =====================================
        echo.
        echo [*] Aguardando container ficar pronto...
        timeout /t 3 /nobreak
        docker-compose logs
    ) else (
        echo [!] Erro ao iniciar docker-compose
        pause
    )
) else if "%option%"=="2" (
    echo.
    echo [*] Fazendo build da imagem...
    docker build -t english-tech-app:latest .
    if %errorlevel% equ 0 (
        echo [OK] Build concluido!
        echo [*] Iniciando container...
        docker run -d -p 3000:3000 --name english-tech english-tech-app:latest
        echo [OK] Container iniciado!
        echo.
        echo =====================================
        echo   Acesse em: http://localhost:3000
        echo =====================================
    ) else (
        echo [!] Erro no build
        pause
    )
) else if "%option%"=="3" (
    echo.
    echo [*] Iniciando desenvolvimento local...
    echo [!] Certifique-se de executar: npm install
    echo.
    npm run dev
) else if "%option%"=="4" (
    echo.
    echo [!] Limpando tudo...
    docker-compose down -v
    docker system prune -af
    echo [*] Reconstruindo...
    docker-compose up -d --build
    echo [OK] Pronto!
    echo.
    echo Acesse em: http://localhost:3000
) else (
    echo [!] Opcao invalida
    pause
    exit /b 1
)

echo.
echo Dicas:
echo   . Logs: docker-compose logs -f
echo   . Stop: docker-compose down
echo   . DevTools: F12 -^> Application -^> IndexedDB
echo.
pause
