# RankingFut

App React + Bootstrap para cargar y visualizar rankings de personas:

- Puntos de autismo (Top 3)
- Puntos de alcoholismo (Top 3)
- Faltas por tarjetas amarillas, rojas (4 amarillas) y negras (10 rojas)

## Requisitos

- Node.js 20+
- Oracle Database (opcional para persistencia real)
- Redis (opcional para cache/congestión)

## Uso local

```bash
npm install
cp .env.example .env
npm run server
npm run dev
```

## Documentación adicional

- [Conexión real con SQL Developer](docs/sql-developer-conexion.md)
- [Despliegue en línea con Docker + Redis](docs/deploy-docker-redis.md)
