# Publicar en línea con Docker + Redis (congestión/cache)

Este flujo publica frontend + API con Nginx como balanceador y Redis para cache de rankings.

## 1) Archivos incluidos

- `Dockerfile` (frontend React build + Nginx)
- `Dockerfile.api` (API Node + Oracle/Redis client)
- `docker-compose.yml`
- `infra/nginx/default.conf` (balanceo entre dos instancias web)

## 2) Variables de entorno

Crear `.env` con:

- `ORACLE_USER`
- `ORACLE_PASSWORD`
- `ORACLE_CONNECTION_STRING`
- `REDIS_URL=redis://redis:6379`

## 3) Despliegue

```bash
docker compose up -d --build
```

Servicios:

- `gateway`: entrypoint público (puerto 80)
- `web_a` + `web_b`: frontend balanceado
- `api`: backend express
- `redis`: cache para absorber picos de lectura

## 4) Operación

- Health API: `http://TU_DOMINIO/api/health`
- Front: `http://TU_DOMINIO/`

Para producción real, colocar un DNS al host y TLS con un reverse proxy (por ejemplo, Traefik o Nginx con certbot).
