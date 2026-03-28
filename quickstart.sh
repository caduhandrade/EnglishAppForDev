#!/bin/bash

# Quick Start Script para English Tech App
# Este script prepara e executa a aplicação com Docker

set -e

echo "🚀 English Tech App - Quick Start"
echo "=================================="
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir com cor
print_step() {
    echo -e "${BLUE}→ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Verificar Docker
print_step "Verificando Docker..."
if ! command -v docker &> /dev/null; then
    print_warning "Docker não encontrado. Instale em: https://www.docker.com"
    exit 1
fi
print_success "Docker encontrado"

# Verificar Docker Compose
print_step "Verificando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    print_warning "Docker Compose não encontrado"
    exit 1
fi
print_success "Docker Compose encontrado"

# Menu
echo ""
echo "Escolha uma opção:"
echo "1) Iniciar com Docker Compose (recomendado)"
echo "2) Build manual + Docker run"
echo "3) Desenvolvimento (npm run dev)"
echo "4) Limpar tudo e reconstruir"
echo ""
read -p "Digite o número (1-4): " option

case $option in
    1)
        print_step "Iniciando com Docker Compose..."
        docker-compose up -d
        print_success "Aplicação iniciada!"
        echo ""
        echo "═══════════════════════════════════"
        echo "🌐 Acesse em: http://localhost:3000"
        echo "📦 API: http://localhost:3000/api"
        echo "═══════════════════════════════════"
        echo ""
        print_step "Aguardando container ficar pronto..."
        sleep 3
        docker-compose logs
        ;;
    2)
        print_step "Fazendo build da imagem..."
        docker build -t english-tech-app:latest .
        print_success "Build concluído!"
        print_step "Iniciando container..."
        docker run -d -p 3000:3000 --name english-tech english-tech-app:latest
        print_success "Container iniciado!"
        echo ""
        echo "═══════════════════════════════════"
        echo "🌐 Acesse em: http://localhost:3000"
        echo "═══════════════════════════════════"
        ;;
    3)
        print_step "Iniciando desenvolvimento local..."
        print_warning "Certifique-se de executar: npm install"
        npm run dev
        ;;
    4)
        print_warning "Limpando tudo..."
        docker-compose down -v
        docker system prune -af
        print_step "Reconstruindo..."
        docker-compose up -d --build
        print_success "Pronto!"
        echo ""
        echo "🌐 Acesse em: http://localhost:3000"
        ;;
    *)
        print_warning "Opção inválida"
        exit 1
        ;;
esac

echo ""
echo "ℹ️  Dicas:"
echo "   • Logs: docker-compose logs -f"
echo "   • Stop: docker-compose down"
echo "   • DevTools: F12 → Application → IndexedDB"
echo ""
