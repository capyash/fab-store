# Cogniclaim Setup Script for Windows
# Author: Vinod Kumar V (VKV)
# This script installs all prerequisites and sets up the development environment

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "🚀 Cogniclaim Development Environment Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Function to print status messages
function Print-Status {
    param($Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Print-Error {
    param($Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Print-Warning {
    param($Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

# Detect OS
Write-Host "Detected OS: Windows" -ForegroundColor Cyan
Write-Host ""

# Check Git installation
if (Test-Command git) {
    $gitVersion = git --version
    $versionNumber = ($gitVersion -split ' ')[2]
    Print-Status "Git is already installed (version $versionNumber)"
}
else {
    Print-Warning "Git is not installed."
    Write-Host ""
    Write-Host "Please install Git from one of these options:" -ForegroundColor Yellow
    Write-Host "  1. Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "  2. Install via winget: winget install --id Git.Git -e --source winget" -ForegroundColor Yellow
    Write-Host "  3. Install via Chocolatey: choco install git" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Do you want to continue setup without Git? (y/n)"
    if ($continue -ne 'y') {
        exit 1
    }
}

# Check Node.js installation
if (Test-Command node) {
    $nodeVersion = node --version
    $versionNumber = $nodeVersion.TrimStart('v')
    Print-Status "Node.js is already installed (version $versionNumber)"

    # Check if version is 18 or higher
    $majorVersion = [int]($versionNumber -split '\.')[0]
    if ($majorVersion -lt 18) {
        Print-Warning "Node.js version $versionNumber is below recommended (18+). Consider upgrading."
    }
}
else {
    Print-Warning "Node.js is not installed."
    Write-Host ""
    Write-Host "Please install Node.js from one of these options:" -ForegroundColor Yellow
    Write-Host "  1. Download from: https://nodejs.org/en/download/" -ForegroundColor Yellow
    Write-Host "  2. Install via winget: winget install OpenJS.NodeJS.LTS" -ForegroundColor Yellow
    Write-Host "  3. Install via Chocolatey: choco install nodejs-lts" -ForegroundColor Yellow
    Write-Host ""
    Print-Error "Node.js is required to continue. Please install it and run this script again."
    exit 1
}

# Verify npm
if (Test-Command npm) {
    $npmVersion = npm --version
    Print-Status "npm is available (version $npmVersion)"
}
else {
    Print-Error "npm is not available. Node.js installation may have failed."
    exit 1
}

Write-Host ""
Write-Host "📦 Installing project dependencies..." -ForegroundColor Cyan
Write-Host ""

# Install frontend dependencies
if (Test-Path "package.json") {
    Write-Host "Installing frontend dependencies..."
    try {
        npm install
        Print-Status "Frontend dependencies installed"
    }
    catch {
        Print-Error "Failed to install frontend dependencies: $_"
        exit 1
    }
}
else {
    Print-Error "package.json not found. Are you in the correct directory?"
    exit 1
}

# Install backend dependencies
if ((Test-Path "backend") -and (Test-Path "backend\package.json")) {
    Write-Host ""
    Write-Host "Installing backend dependencies..."
    try {
        Push-Location backend
        npm install
        Pop-Location
        Print-Status "Backend dependencies installed"
    }
    catch {
        Pop-Location
        Print-Error "Failed to install backend dependencies: $_"
        exit 1
    }
}
else {
    Print-Warning "Backend directory not found. Skipping backend setup."
}

# Setup backend .env if it doesn't exist
if ((Test-Path "backend") -and -not (Test-Path "backend\.env")) {
    if (Test-Path "backend\.env.example") {
        Write-Host ""
        Write-Host "Creating backend .env file from .env.example..."
        try {
            Copy-Item "backend\.env.example" "backend\.env"
            Print-Status "Backend .env file created"
            Print-Warning "Please edit backend\.env and add your OPENAI_API_KEY"
        }
        catch {
            Print-Warning "Failed to create backend\.env file: $_"
        }
    }
    else {
        Print-Warning "backend\.env.example not found. You may need to create backend\.env manually."
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✓ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Edit backend\.env and add your OPENAI_API_KEY"
Write-Host "  2. Start backend:  cd backend; npm run dev"
Write-Host "  3. Start frontend: npm run dev"
Write-Host "  4. Open browser:   http://localhost:5173"
Write-Host ""
Write-Host "Or use the quick launcher:"
Write-Host "  - Double-click 'Start Demo.bat' for easy startup"
Write-Host ""
Write-Host "For ngrok setup (optional):"
Write-Host "  - Download from: https://ngrok.com/download"
Write-Host "  - Install via winget: winget install ngrok"
Write-Host "  - Install via Chocolatey: choco install ngrok"
Write-Host ""
