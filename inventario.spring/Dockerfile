# Fase de compilación
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copiamos primero los archivos de dependencias
COPY pom.xml .
COPY src ./src

# Compilamos el proyecto
RUN mvn clean package -DskipTests

# Fase de ejecución
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
