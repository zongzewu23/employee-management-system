# Employee Management System Startup Script
# Usage: .\start.ps1 [dev|prod|test|clean|help]

param(
    [string]$Mode = "prod"
)

function Write-Header {
    param([string]$Message)
    Write-Host "================================" -ForegroundColor Green
    Write-Host $Message -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
}

function Start-Development {
    Write-Header "Starting Development Environment"
    Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
    Write-Host "Backend: http://localhost:8080" -ForegroundColor Yellow
    Write-Host "Database: localhost:5432" -ForegroundColor Yellow
    Write-Host "Swagger: http://localhost:8080/swagger-ui.html" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Note: Backend may take 1-2 minutes to start..." -ForegroundColor Cyan
    Write-Host ""
    docker-compose -f docker-compose.dev.yml up --build
}

function Start-Production {
    Write-Header "Starting Production Environment"
    Write-Host "Application: http://localhost" -ForegroundColor Yellow
    Write-Host "API: http://localhost/api/*" -ForegroundColor Yellow
    Write-Host ""
    docker-compose up --build
}

function Test-Setup {
    Write-Header "Testing Setup"
    
    Write-Host "Waiting for containers to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    Write-Host "1. Testing frontend..." -ForegroundColor Cyan
    try {
        $frontend = Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing
        Write-Host "✅ Frontend accessible (Status: $($frontend.StatusCode))" -ForegroundColor Green
    } catch {
        Write-Host "❌ Frontend test failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "2. Testing API..." -ForegroundColor Cyan
    try {
        $api = Invoke-WebRequest -Uri "http://localhost/api/departments" -UseBasicParsing
        Write-Host "✅ API working (Status: $($api.StatusCode))" -ForegroundColor Green
    } catch {
        Write-Host "❌ API test failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Container Status:" -ForegroundColor Cyan
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

function Clean-Environment {
    Write-Header "Cleaning Environment"
    
    Write-Host "Stopping all containers..." -ForegroundColor Yellow
    docker-compose down -v --remove-orphans 2>$null
    docker-compose -f docker-compose.dev.yml down -v --remove-orphans 2>$null
    
    Write-Host "Removing unused images..." -ForegroundColor Yellow
    docker system prune -f
    
    Write-Host "✅ Environment cleaned" -ForegroundColor Green
}

function Show-Help {
    Write-Header "Employee Management System"
    Write-Host "Usage: .\start.ps1 [MODE]" -ForegroundColor White
    Write-Host ""
    Write-Host "Modes:" -ForegroundColor Cyan
    Write-Host "  dev     - Start development environment (port 3000)" -ForegroundColor White
    Write-Host "  prod    - Start production environment (port 80)" -ForegroundColor White
    Write-Host "  test    - Test the setup" -ForegroundColor White
    Write-Host "  clean   - Clean all containers and images" -ForegroundColor White
    Write-Host "  help    - Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Cyan
    Write-Host "  .\start.ps1 dev     # Start development mode" -ForegroundColor Gray
    Write-Host "  .\start.ps1 prod    # Start production mode" -ForegroundColor Gray
    Write-Host "  .\start.ps1 clean   # Clean environment" -ForegroundColor Gray
}

# Main execution
switch ($Mode.ToLower()) {
    "dev" { 
        Start-Development 
    }
    "prod" { 
        Start-Production 
    }
    "test" { 
        Test-Setup 
    }
    "clean" { 
        Clean-Environment 
    }
    "help" { 
        Show-Help 
    }
    default { 
        Write-Host "Unknown mode: $Mode" -ForegroundColor Red
        Write-Host "Use '.\start.ps1 help' for usage information" -ForegroundColor Yellow
    }
}