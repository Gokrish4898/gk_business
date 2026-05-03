# --- STAGE 1: Build the App ---
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy just the csproj first to cache the NuGet downloads
COPY ["gkb_service.csproj", "./"]
RUN dotnet restore "./gkb_service.csproj"

# Copy the rest of the code
COPY . .

# ⚠️ THIS IS THE LINE THAT FIXES YOUR ERROR! 
# It builds the app and forces the output into /app/publish
RUN dotnet publish "gkb_service.csproj" -c Release -o /app/publish


# --- STAGE 2: Run the App ---
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

# Now it can successfully find /app/publish from the build stage
COPY --from=build /app/publish .

# Start the application
ENTRYPOINT ["dotnet", "gkb_service.dll"]