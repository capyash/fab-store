#!/bin/bash

# Cogniclaim Setup Script
# Author: Vinod Kumar V (VKV)
# This script installs all prerequisites and sets up the development environment

set -e  # Exit on error

echo "🚀 Cogniclaim Development Environment Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
    PACKAGE_MANAGER="brew"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    if command_exists apt-get; then
        PACKAGE_MANAGER="apt"
    elif command_exists yum; then
        PACKAGE_MANAGER="yum"
    else
        print_error "Unsupported Linux distribution. Please install Git and Node.js manually."
        exit 1
    fi
else
    print_error "Unsupported operating system: $OSTYPE"
    exit 1
fi

echo "Detected OS: $OS"
echo ""

# Check and install Git
if command_exists git; then
    GIT_VERSION=$(git --version | awk '{print $3}')
    print_status "Git is already installed (version $GIT_VERSION)"
else
    print_warning "Git is not installed. Installing..."
    if [ "$OS" == "macos" ]; then
        if command_exists brew; then
            brew install git
        else
            print_error "Homebrew is not installed. Please install Homebrew first:"
            echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            exit 1
        fi
    elif [ "$PACKAGE_MANAGER" == "apt" ]; then
        sudo apt-get update
        sudo apt-get install -y git
    elif [ "$PACKAGE_MANAGER" == "yum" ]; then
        sudo yum install -y git
    fi
    print_status "Git installed successfully"
fi

# Check and install Node.js
if command_exists node; then
    NODE_VERSION=$(node --version | sed 's/v//')
    print_status "Node.js is already installed (version $NODE_VERSION)"
    
    # Check if version is 18 or higher
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d. -f1)
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        print_warning "Node.js version $NODE_VERSION is below recommended (18+). Consider upgrading."
    fi
else
    print_warning "Node.js is not installed. Installing..."
    if [ "$OS" == "macos" ]; then
        if command_exists brew; then
            brew install node@20
        else
            print_error "Homebrew is not installed. Please install Homebrew first."
            exit 1
        fi
    elif [ "$PACKAGE_MANAGER" == "apt" ]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [ "$PACKAGE_MANAGER" == "yum" ]; then
        curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
        sudo yum install -y nodejs
    fi
    print_status "Node.js installed successfully"
fi

# Verify npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_status "npm is available (version $NPM_VERSION)"
else
    print_error "npm is not available. Node.js installation may have failed."
    exit 1
fi

echo ""
echo "📦 Installing project dependencies..."
echo ""

# Install frontend dependencies
if [ -f "package.json" ]; then
    echo "Installing frontend dependencies..."
    npm install
    print_status "Frontend dependencies installed"
else
    print_error "package.json not found. Are you in the correct directory?"
    exit 1
fi

# Install backend dependencies
if [ -d "backend" ] && [ -f "backend/package.json" ]; then
    echo ""
    echo "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    print_status "Backend dependencies installed"
else
    print_warning "Backend directory not found. Skipping backend setup."
fi

# Setup backend .env if it doesn't exist
if [ -d "backend" ] && [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.example" ]; then
        echo ""
        echo "Creating backend .env file from .env.example..."
        cp backend/.env.example backend/.env
        print_status "Backend .env file created"
        print_warning "Please edit backend/.env and add your OPENAI_API_KEY"
    else
        print_warning "backend/.env.example not found. You may need to create backend/.env manually."
    fi
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Edit backend/.env and add your OPENAI_API_KEY"
echo "  2. Start backend:  cd backend && npm run dev"
echo "  3. Start frontend: npm run dev"
echo "  4. Open browser:   http://localhost:5173"
echo ""
echo "For ngrok setup (optional):"
echo "  - Install ngrok: brew install ngrok/ngrok/ngrok (macOS)"
echo "  - Or download from: https://ngrok.com/download"
echo ""

