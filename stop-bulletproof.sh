#!/bin/bash

echo "🛑 Rojgar Kendra - Bulletproof Stop System"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to stop service by port
stop_service_by_port() {
    local port=$1
    local service_name=$2
    
    if lsof -ti:$port >/dev/null 2>&1; then
        print_status "Stopping $service_name on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null
        sleep 2
        
        if ! lsof -ti:$port >/dev/null 2>&1; then
            print_success "$service_name stopped successfully"
        else
            print_warning "$service_name may still be running"
        fi
    else
        print_status "$service_name is not running on port $port"
    fi
}

# Function to stop service by PID file
stop_service_by_pid() {
    local service_name=$1
    local pid_file="pids/${service_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid >/dev/null 2>&1; then
            print_status "Stopping $service_name (PID: $pid)..."
            kill $pid 2>/dev/null
            sleep 2
            
            if ! ps -p $pid >/dev/null 2>&1; then
                print_success "$service_name stopped successfully"
            else
                print_warning "$service_name still running, force killing..."
                kill -9 $pid 2>/dev/null
            fi
        else
            print_status "$service_name (PID: $pid) is not running"
        fi
        rm -f "$pid_file"
    else
        print_status "No PID file found for $service_name"
    fi
}

# Function to clean up all processes
cleanup_all_processes() {
    print_status "Cleaning up all related processes..."
    
    # Kill any remaining processes by name
    pkill -f "python3 app.py" 2>/dev/null
    pkill -f "npm run dev" 2>/dev/null
    pkill -f "node.*vite" 2>/dev/null
    
    # Kill any remaining processes by port
    for port in 5000 5001 3000 5173 5174; do
        if lsof -ti:$port >/dev/null 2>&1; then
            print_warning "Force killing process on port $port"
            lsof -ti:$port | xargs kill -9 2>/dev/null
        fi
    done
    
    print_success "All processes cleaned up"
}

echo "🛑 Stopping all services..."

# Stop services by PID files first (graceful shutdown)
print_status "Step 1: Graceful shutdown using PID files..."
stop_service_by_pid "ml_service"
stop_service_by_pid "backend"
stop_service_by_pid "frontend"

# Stop services by port (force shutdown)
print_status "Step 2: Force shutdown by port..."
stop_service_by_port 5001 "ML Service"
stop_service_by_port 5000 "Backend"
stop_service_by_port 3000 "Frontend"
stop_service_by_port 5173 "Frontend (Vite)"
stop_service_by_port 5174 "Frontend (Vite Alt)"

# Clean up any remaining processes
print_status "Step 3: Final cleanup..."
cleanup_all_processes

# Clean up PID files
print_status "Cleaning up PID files..."
rm -f pids/*.pid

# Verify all services are stopped
echo ""
echo "🔍 Final Status Check:"
echo "======================"

if ! lsof -ti:5001 >/dev/null 2>&1; then
    print_success "ML Service: Stopped"
else
    print_error "ML Service: Still running on port 5001"
fi

if ! lsof -ti:5000 >/dev/null 2>&1; then
    print_success "Backend: Stopped"
else
    print_error "Backend: Still running on port 5000"
fi

if ! lsof -ti:5173 >/dev/null 2>&1 && ! lsof -ti:5174 >/dev/null 2>&1 && ! lsof -ti:3000 >/dev/null 2>&1; then
    print_success "Frontend: Stopped"
else
    print_error "Frontend: Still running"
fi

echo ""
print_success "🎉 All services stopped successfully!"
echo ""
echo "📋 Quick Commands:"
echo "  Start all: ./start-bulletproof.sh"
echo "  Check status: ./check-status.sh"
echo "  View logs: tail -f logs/*.log"
echo ""
echo "🛡️  Your system is now clean and ready for a fresh start!"
