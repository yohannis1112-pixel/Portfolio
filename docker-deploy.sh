#!/bin/bash

# Portfolio Docker Deployment Scripts

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐳 Portfolio Docker Deployment${NC}"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi
}

# Function to build the image
build() {
    echo -e "${YELLOW}📦 Building Docker image...${NC}"
    docker build -t portfolio:latest .
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build completed successfully${NC}"
    else
        echo -e "${RED}❌ Build failed${NC}"
        exit 1
    fi
}

# Function to run development environment
dev() {
    echo -e "${YELLOW}🚀 Starting development environment...${NC}"
    docker-compose up --build
}

# Function to run production environment
prod() {
    echo -e "${YELLOW}🚀 Starting production environment...${NC}"
    docker-compose -f docker-compose.prod.yml up --build -d
}

# Function to stop all containers
stop() {
    echo -e "${YELLOW}🛑 Stopping all containers...${NC}"
    docker-compose down
    docker-compose -f docker-compose.prod.yml down
}

# Function to view logs
logs() {
    echo -e "${YELLOW}📋 Viewing logs...${NC}"
    docker-compose logs -f portfolio
}

# Function to setup database
setup_db() {
    echo -e "${YELLOW}🗄️ Setting up database...${NC}"
    docker-compose exec portfolio npx prisma db push
    docker-compose exec portfolio npm run prisma:seed
}

# Function to clean up
clean() {
    echo -e "${YELLOW}🧹 Cleaning up Docker resources...${NC}"
    docker-compose down -v
    docker system prune -f
    docker volume prune -f
}

# Main script logic
case "$1" in
    build)
        check_docker
        build
        ;;
    dev)
        check_docker
        dev
        ;;
    prod)
        check_docker
        prod
        ;;
    stop)
        check_docker
        stop
        ;;
    logs)
        check_docker
        logs
        ;;
    setup-db)
        check_docker
        setup_db
        ;;
    clean)
        check_docker
        clean
        ;;
    *)
        echo "Usage: $0 {build|dev|prod|stop|logs|setup-db|clean}"
        echo ""
        echo "Commands:"
        echo "  build     - Build the Docker image"
        echo "  dev       - Start development environment"
        echo "  prod      - Start production environment"
        echo "  stop      - Stop all containers"
        echo "  logs      - View application logs"
        echo "  setup-db  - Setup database schema and seed data"
        echo "  clean     - Clean up Docker resources"
        exit 1
        ;;
esac