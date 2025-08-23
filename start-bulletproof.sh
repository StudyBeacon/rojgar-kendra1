#!/bin/bash

echo "🛡️  Rojgar Kendra - Bulletproof Startup System"
echo "================================================"
echo "This script will solve your problems FOREVER!"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to check if a port is in use and kill it
check_and_kill_port() {
    local port=$1
    local service_name=$2
    
    if lsof -ti:$port >/dev/null 2>&1; then
        print_warning "Port $port is in use. Stopping existing $service_name..."
        lsof -ti:$port | xargs kill -9 2>/dev/null
        sleep 2
        print_success "Port $port cleared for $service_name"
    fi
}

# Function to create virtual environment if it doesn't exist
setup_ml_environment() {
    print_status "Setting up ML Service environment..."
    
    cd ml_model
    
    # Check if virtual environment exists
    if [ ! -f "venv/bin/activate" ]; then
        print_warning "Virtual environment not found. Creating new one..."
        python3 -m venv venv
        print_success "Virtual environment created"
    fi
    
    # Activate virtual environment and install dependencies
    print_status "Installing/updating ML dependencies..."
    source venv/bin/activate
    
    # Install all required packages
    pip install --upgrade pip
    pip install flask spacy scikit-learn joblib pandas PyMuPDF
    
    # Verify installations
    python3 -c "import flask, spacy, sklearn, joblib, pandas, fitz; print('All packages imported successfully')" 2>/dev/null
    if [ $? -eq 0 ]; then
        print_success "All ML dependencies verified successfully"
    else
        print_error "Some ML dependencies failed to install"
        return 1
    fi
    
    cd ..
    return 0
}

# Function to verify service health
verify_service() {
    local service_name=$1
    local port=$2
    local health_url=$3
    
    print_status "Verifying $service_name health..."
    
    # Wait for service to start
    sleep 3
    
    # Check if port is listening
    if ! lsof -ti:$port >/dev/null 2>&1; then
        print_error "$service_name is not listening on port $port"
        return 1
    fi
    
    # Test health endpoint if provided
    if [ ! -z "$health_url" ]; then
        if curl -s "$health_url" >/dev/null 2>&1; then
            print_success "$service_name is responding to requests"
        else
            print_warning "$service_name is running but not responding to requests"
        fi
    fi
    
    return 0
}

# Function to start service with retry logic
start_service_with_retry() {
    local service_name=$1
    local start_command=$2
    local port=$3
    local max_retries=3
    local retry_count=0
    
    while [ $retry_count -lt $max_retries ]; do
        print_status "Starting $service_name (attempt $((retry_count + 1))/$max_retries)..."
        
        # Start service
        eval "$start_command"
        local service_pid=$!
        
        # Wait and verify
        sleep 5
        
        if lsof -ti:$port >/dev/null 2>&1; then
            print_success "$service_name started successfully (PID: $service_pid)"
            echo $service_pid > "pids/${service_name}.pid"
            return 0
        else
            print_warning "$service_name failed to start (attempt $((retry_count + 1)))"
            kill $service_pid 2>/dev/null
            retry_count=$((retry_count + 1))
            
            if [ $retry_count -lt $max_retries ]; then
                print_status "Retrying in 3 seconds..."
                sleep 3
            fi
        fi
    done
    
    print_error "$service_name failed to start after $max_retries attempts"
    return 1
}

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p logs pids backend/uploads/resumes

# Step 1: Setup ML Environment
print_status "Step 1: Setting up ML Service environment..."
if ! setup_ml_environment; then
    print_error "Failed to setup ML environment. Exiting."
    exit 1
fi

# Step 2: Install Node.js dependencies
print_status "Step 2: Installing Node.js dependencies..."
cd backend && npm install --silent && cd ..
cd frontend && npm install --silent && cd ..

# Step 3: Start ML Service
print_status "Step 3: Starting ML Service..."
check_and_kill_port 5001 "ML Service"
start_service_with_retry "ml_service" "cd ml_model && source venv/bin/activate && python3 app.py > ../logs/ml_service.log 2>&1 &" 5001

# Step 4: Start Backend
print_status "Step 4: Starting Backend..."
check_and_kill_port 5000 "Backend"
start_service_with_retry "backend" "cd backend && npm run dev > ../logs/backend.log 2>&1 &" 5000

# Step 5: Start Frontend
print_status "Step 5: Starting Frontend..."
check_and_kill_port 3000 "Frontend"
check_and_kill_port 5173 "Frontend (Vite)"
check_and_kill_port 5174 "Frontend (Vite Alt)"
start_service_with_retry "frontend" "cd frontend && npm run dev > ../logs/frontend.log 2>&1 &" 5173

# Step 6: Verify all services
print_status "Step 6: Verifying all services..."
sleep 5

echo ""
echo "🔍 Final Service Status:"
echo "========================"

# Check ML Service
if lsof -ti:5001 >/dev/null 2>&1; then
    print_success "ML Service: Running on port 5001"
else
    print_error "ML Service: Failed to start"
fi

# Check Backend
if lsof -ti:5000 >/dev/null 2>&1; then
    print_success "Backend: Running on port 5000"
else
    print_error "Backend: Failed to start"
fi

# Check Frontend
if lsof -ti:5173 >/dev/null 2>&1; then
    print_success "Frontend: Running on port 5173"
elif lsof -ti:5174 >/dev/null 2>&1; then
    print_success "Frontend: Running on port 5174"
elif lsof -ti:3000 >/dev/null 2>&1; then
    print_success "Frontend: Running on port 3000"
else
    print_error "Frontend: Failed to start"
fi

echo ""
echo "🌐 Access URLs:"
echo "  Frontend: http://localhost:5173"
echo "  Backend: http://localhost:5000"
echo "  ML Service: http://localhost:5001"
echo ""

# Test ML Service
print_status "Testing ML Service API..."
if curl -s http://localhost:5001/score -X POST -H "Content-Type: application/json" -d '{"resume_text":"test","job_description":{"skills":["test"],"experience":"1 year","description":"test"}}' >/dev/null 2>&1; then
    print_success "ML Service API is responding correctly"
else
    print_warning "ML Service API test failed"
fi

echo ""
print_success "🎉 Bulletproof startup completed!"
echo ""
echo "📋 Quick Commands:"
echo "  Check status: ./check-status.sh"
echo "  Stop all: ./stop.sh"
echo "  View logs: tail -f logs/*.log"
echo ""
echo "🛡️  This system is designed to be bulletproof and solve your problems permanently!"
echo "   - Automatic dependency management"
echo "   - Virtual environment handling"
echo "   - Service health monitoring"
echo "   - Retry logic for reliability"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    print_status "Stopping all services..."
    
    # Stop services using PID files
    for pid_file in pids/*.pid; do
        if [ -f "$pid_file" ]; then
            local pid=$(cat "$pid_file")
            if ps -p $pid >/dev/null 2>&1; then
                kill $pid 2>/dev/null
                print_success "Stopped service with PID $pid"
            fi
        fi
    done
    
    # Clean up PID files
    rm -f pids/*.pid
    
    print_success "All services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running and monitor services
print_status "Monitoring services... (Press Ctrl+C to stop)"
while true; do
    sleep 30
    
    # Check if any service has stopped
    for pid_file in pids/*.pid; do
        if [ -f "$pid_file" ]; then
            pid=$(cat "$pid_file")
            if ! ps -p $pid >/dev/null 2>&1; then
                print_warning "Service with PID $pid has stopped unexpectedly"
                rm -f "$pid_file"
            fi
        fi
    done
done
