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

## Arquitectura por capas

El proyecto quedó separado por capas para reducir acoplamiento y clarificar responsabilidades.

### Frontend (`src`)

- `app/`: composición principal de la UI.
- `presentation/`: componentes visuales, hooks y estilos.
- `application/`: servicios de acceso a API.
- `domain/`: reglas y utilidades de negocio.

Flujo: **presentation -> application -> API** y **presentation -> domain**.

### Backend (`server`)

- `presentation/`: rutas y controladores HTTP.
- `application/`: casos de uso/servicios.
- `domain/`: validaciones y modelo del dominio.
- `infrastructure/`: repositorios (Oracle/local) y cache (Redis).
- `config/`: variables y configuración del entorno.

Flujo: **routes/controller -> service -> repository/cache -> DB/Redis**.

## Documentación adicional

- [Conexión real con SQL Developer](docs/sql-developer-conexion.md)
- [Despliegue en línea con Docker + Redis](docs/deploy-docker-redis.md)
