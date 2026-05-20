# --- 1. AŞAMA: İNŞA (BUILD) ---
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Proje dosyalarını kopyala
COPY ["UniSphere.API/UniSphere.API.csproj", "UniSphere.API/"]
COPY ["UniSphere.Core/UniSphere.Core.csproj", "UniSphere.Core/"]
COPY ["UniSphere.Infrastructure/UniSphere.Infrastructure.csproj", "UniSphere.Infrastructure/"]

# Bağımlılıkları indir
RUN dotnet restore "UniSphere.API/UniSphere.API.csproj"

# Tüm kodları kopyala ve derle
COPY . .
WORKDIR "/src/UniSphere.API"
RUN dotnet publish "UniSphere.API.csproj" -c Release -o /app/publish

# --- 2. AŞAMA: ÇALIŞTIRMA (RUNTIME) ---
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "UniSphere.API.dll"]
