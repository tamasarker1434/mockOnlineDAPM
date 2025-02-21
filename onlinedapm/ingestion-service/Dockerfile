FROM openjdk:21-jdk-slim
WORKDIR /app
COPY . .
RUN chmod +x mvnw
RUN ./mvnw package -DskipTests
ENTRYPOINT ["java", "-jar", "target/ingestion-service-0.0.1-SNAPSHOT.jar"]