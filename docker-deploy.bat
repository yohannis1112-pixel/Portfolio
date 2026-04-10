@echo off
setlocal enabledelayedexpansion

echo 🐳 Portfolio Docker Deployment

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    exit /b 1
)

if "%1"=="build" goto build
if "%1"=="dev" goto dev
if "%1"=="prod" goto prod
if "%1"=="stop" goto stop
if "%1"=="logs" goto logs
if "%1"=="setup-db" goto setup_db
if "%1"=="clean" goto clean
goto usage

:build
echo 📦 Building Docker image...
docker build -t portfolio:latest .
if errorlevel 1 (
    echo ❌ Build failed
    exit /b 1
)
echo ✅ Build completed successfully
goto end

:dev
echo 🚀 Starting development environment...
docker-compose up --build
goto end

:prod
echo 🚀 Starting production environment...
docker-compose -f docker-compose.prod.yml up --build -d
goto end

:stop
echo 🛑 Stopping all containers...
docker-compose down
docker-compose -f docker-compose.prod.yml down
goto end

:logs
echo 📋 Viewing logs...
docker-compose logs -f portfolio
goto end

:setup_db
echo 🗄️ Setting up database...
docker-compose exec portfolio npx prisma db push
docker-compose exec portfolio npm run prisma:seed
goto end

:clean
echo 🧹 Cleaning up Docker resources...
docker-compose down -v
docker system prune -f
docker volume prune -f
goto end

:usage
echo Usage: %0 {build^|dev^|prod^|stop^|logs^|setup-db^|clean}
echo.
echo Commands:
echo   build     - Build the Docker image
echo   dev       - Start development environment
echo   prod      - Start production environment
echo   stop      - Stop all containers
echo   logs      - View application logs
echo   setup-db  - Setup database schema and seed data
echo   clean     - Clean up Docker resources
exit /b 1

:end