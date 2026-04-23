# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# We use gkb_service.csproj exactly as it appears in your folder
COPY ["gkb_service.csproj", "./"]
RUN dotnet restore "gkb_service.csproj"

COPY . .
RUN dotnet publish "gkb_service.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Production
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080

COPY --from=build /app/publish .

# The output DLL will also be named gkb_service.dll
ENTRYPOINT ["dotnet", "gkb_service.dll"]