# Use an official OpenJDK runtime as a parent image
FROM openjdk:21-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml
COPY .mvn/ .mvn
COPY mvnw .
COPY pom.xml .

# Download dependencies (caching layer)
RUN ./mvnw dependency:go-offline -B

# Copy the rest of the source code
COPY src ./src

# Build the application (skip tests for faster build)
RUN ./mvnw package -DskipTests

# The jar file name typically matches <artifactId>-<version>.jar
# or check your target folder to confirm the exact jar name
# If you see a jar named "demo-0.0.1-SNAPSHOT.jar", use that:
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/demo-0.0.1-SNAPSHOT.jar"]
