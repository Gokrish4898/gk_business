# Stage 1: The Build Environment
# We use the heavy SDK image to get all the tools needed to compile the code
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /gkb_service

# Copy just the project file first and restore dependencies (Optimizes Docker caching)
COPY ["gkb_service.csproj", "./"]
RUN dotnet restore "gkb_service.csproj"

# Copy the rest of the code and build the release version
COPY . .
RUN dotnet publish "gkb_service.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: The Production Environment
# We use the tiny ASP.NET runtime image for the actual live server
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080

# Copy the compiled files from the Build stage into this tiny container
COPY --from=build /app/publish .

# Tell Docker how to start your app
ENTRYPOINT ["dotnet","/gkb_service/bin/Release/net8.0/gkb_service.dll"]