FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the maven config file
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Download dependency, use the Docker cache
RUN ./mvnw dependency:go-offline

COPY src ./src

# Build the app
RUN ./mvnw clean package -DskipTests

# Verify the JAR file was created
RUN ls -la target/

# Run the app with correct JAR name
EXPOSE 8080
CMD ["java", "-jar", "target/employee-management-system-0.0.1-SNAPSHOT.jar"]