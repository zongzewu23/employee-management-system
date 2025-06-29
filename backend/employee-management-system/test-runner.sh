#!/bin/bash
# test-runner.sh - Spring Boot Test Runner Script

echo "🚀 Spring Boot Employee Management System - Test Runner"
echo "=================================================="

# Check if the local Maven wrapper exists and is executable
if [ ! -x "./mvnw" ]; then
    echo "❌ Local Maven Wrapper executable './mvnw' not found or is not executable."
    echo "Please ensure the 'mvnw' script exists and has execute permissions in the project root."
    echo "If you want to use a global 'mvn' command, please use the original script."
    exit 1
fi

echo "📋 Available Test Options:"
echo "1. Run all tests"
echo "2. Run unit tests only"
echo "3. Run integration tests only"
echo "4. Run Employee Controller tests"
echo "5. Run Department Controller tests"
echo "6. Generate test coverage report"
echo "7. Clean and re-run all tests"

read -p "Please select an option (1-7): " choice

case $choice in
    1)
        echo "🔄 Running all tests..."
        ./mvnw test
        ;;
    2)
        echo "🔄 Running unit tests..."
        ./mvnw test -Dtest="!**/*IntegrationTest"
        ;;
    3)
        echo "🔄 Running integration tests..."
        ./mvnw test -Dtest="**/*IntegrationTest"
        ;;
    4)
        echo "🔄 Running Employee Controller tests..."
        ./mvnw test -Dtest="EmployeeControllerTest"
        ;;
    5)
        echo "🔄 Running Department Controller tests..."
        ./mvnw test -Dtest="DepartmentControllerTest"
        ;;
    6)
        echo "🔄 Generating test coverage report..."
        ./mvnw clean test jacoco:report
        echo "📊 Report generation complete, view at: target/site/jacoco/index.html"
        ;;
    7)
        echo "🔄 Cleaning and re-running all tests..."
        ./mvnw clean test
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✅ Tests complete!"
echo "📊 For detailed results, please check the console output"