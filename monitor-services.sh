#!/bin/bash

echo "🔍 Rojgar Kendra - Service Monitor & Auto-Recovery"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[MONITOR]${NC} $1"
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

# Configuration
CHECK_INTERVAL=30  # Check every 30 seconds
MAX_RESTART_ATTEMPTS=3
LOG_FILE="logs/monitor.log"

# Create log directory if it doesn't exist
mkdir -p logs

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Function to check service health
check_service_health() {
    local service_name=$1
    local port=$2
    local health_url=$3
    
    if lsof -ti:$port >/dev/null 2>&1; then
        # Service is running, check if it's responding
        if [ ! -z "$health_url" ]; then
            if curl -s "$health_url" >/dev/null 2>&1; then
                return 0  # Healthy
            else
                return 1  # Running but not responding
            fi
        else
            return 0  # Running (no health check)
        fi
    else
        return 2  # Not running
    fi
}

# Function to restart service
restart_service() {
    local service_name=$1
    local port=$2
    local start_command=$3
    
    print_warning "Restarting $service_name..."
    log_message "Restarting $service_name on port $port"
    
    # Kill existing process
    if lsof -ti:$port >/dev/null 2>&1; then
        lsof -ti:$port | xargs kill -9 2>/dev/null
        sleep 2
    fi
    
    # Start service
    eval "$start_command" &
    local service_pid=$!
    
    # Wait for service to start
    sleep 5
    
    # Check if restart was successful
    if lsof -ti:$port >/dev/null 2>&1; then
        print_success "$service_name restarted successfully (PID: $service_pid)"
        log_message "$service_name restarted successfully (PID: $service_pid)"
        echo $service_pid > "pids/${service_name}.pid"
        return 0
    else
        print_error "$service_name failed to restart"
        log_message "$service_name failed to restart"
        return 1
    fi
}

# Function to monitor all services
monitor_services() {
    local ml_restart_count=0
    local backend_restart_count=0
    local frontend_restart_count=0
    
    print_status "Starting service monitoring... (Press Ctrl+C to stop)"
    log_message "Service monitoring started"
    
    while true; do
        echo ""
        print_status "Checking services... ($(date '+%H:%M:%S'))"
        
        # Check ML Service
        if check_service_health "ML Service" 5001 "http://localhost:5001/score"; then
            print_success "ML Service: Healthy"
            ml_restart_count=0  # Reset restart count on success
        else
            print_warning "ML Service: Unhealthy or not responding"
            if [ $ml_restart_count -lt $MAX_RESTART_ATTEMPTS ]; then
                ml_restart_count=$((ml_restart_count + 1))
                print_warning "ML Service restart attempt $ml_restart_count/$MAX_RESTART_ATTEMPTS"
                if restart_service "ml_service" 5001 "cd ml_model && source venv/bin/activate && python3 app.py > ../logs/ml_service.log 2>&1 &"; then
                    print_success "ML Service auto-recovered"
                else
                    print_error "ML Service auto-recovery failed"
                fi
            else
                print_error "ML Service exceeded max restart attempts. Manual intervention required."
                log_message "ML Service exceeded max restart attempts"
            fi
        fi
        
        # Check Backend
        if check_service_health "Backend" 5000 "http://localhost:5000"; then
            print_success "Backend: Healthy"
            backend_restart_count=0
        else
            print_warning "Backend: Unhealthy or not responding"
            if [ $backend_restart_count -lt $MAX_RESTART_ATTEMPTS ]; then
                backend_restart_count=$((backend_restart_count + 1))
                print_warning "Backend restart attempt $backend_restart_count/$MAX_RESTART_ATTEMPTS"
                if restart_service "backend" 5000 "cd backend && npm run dev > ../logs/backend.log 2>&1 &"; then
                    print_success "Backend auto-recovered"
                else
                    print_error "Backend auto-recovery failed"
                fi
            else
                print_error "Backend exceeded max restart attempts. Manual intervention required."
                log_message "Backend exceeded max restart attempts"
            fi
        fi
        
        # Check Frontend
        if check_service_health "Frontend" 5173 "http://localhost:5173" || check_service_health "Frontend" 5174 "http://localhost:5174"; then
            print_success "Frontend: Healthy"
            frontend_restart_count=0
        else
            print_warning "Frontend: Unhealthy or not responding"
            if [ $frontend_restart_count -lt $MAX_RESTART_ATTEMPTS ]; then
                frontend_restart_count=$((frontend_restart_count + 1))
                print_warning "Frontend restart attempt $frontend_restart_count/$MAX_RESTART_ATTEMPTS"
                if restart_service "frontend" 3000 "cd frontend && npm run dev > ../logs/frontend.log 2>&1 &"; then
                    print_success "Frontend auto-recovered"
                else
                    print_error "Frontend auto-recovery failed"
                fi
            else
                print_error "Frontend exceeded max restart attempts. Manual intervention required."
                log_message "Frontend exceeded max restart attempts"
            fi
        fi
        
        # Display restart counts
        echo ""
        print_status "Restart Attempts: ML($ml_restart_count) Backend($backend_restart_count) Frontend($frontend_restart_count)"
        
        # Wait before next check
        print_status "Next check in $CHECK_INTERVAL seconds... (Press Ctrl+C to stop)"
        sleep $CHECK_INTERVAL
    done
}

# Function to cleanup on exit
cleanup() {
    echo ""
    print_status "Stopping service monitor..."
    log_message "Service monitor stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start monitoring
monitor_services
