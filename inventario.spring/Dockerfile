# Fase de compilación
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copiamos los archivos apuntando a la carpeta de tu proyecto
COPY inventario.spring/pom.xml .
COPY inventario.spring/src ./src

# Instalamos Maven para compilar dentro del contenedor
RUN apt-get update && apt-get install -y maven

# Compilamos el proyecto omitiendo pruebas
RUN mvn clean package -DskipTests

# Fase de ejecución
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]