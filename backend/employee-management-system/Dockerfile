FROM openjdk:17-jdk-slim

WORKDIR /app

# Install Maven and curl for health checks
RUN apt-get update && apt-get install -y maven curl && rm -rf /var/lib/apt/lists/*

# Copy all files
COPY . .

# Make mvnw executable
RUN chmod +x ./mvnw

# Build the application
RUN ./mvnw clean package -DskipTests -B

# Verify JAR was created
RUN ls -la target/ && echo "JAR files created:" && ls -la target/*.jar

EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/employee-management-system-0.0.1-SNAPSHOT.jar"]