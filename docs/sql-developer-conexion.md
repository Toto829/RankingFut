# Conexión real con Oracle SQL Developer

Este proyecto guarda personas en Oracle usando `oracledb`.

## 1) Preparar base en Oracle

1. Crear usuario en Oracle (ejemplo):

```sql
CREATE USER ranking_user IDENTIFIED BY ranking_password;
GRANT CONNECT, RESOURCE TO ranking_user;
GRANT CREATE TABLE TO ranking_user;
```

2. Conectarse con SQL Developer y ejecutar `server/schema.sql` si preferís crear la tabla manualmente.

## 2) Configurar la app

1. Copiar variables:

```bash
cp .env.example .env
```

2. Completar:

- `ORACLE_USER`
- `ORACLE_PASSWORD`
- `ORACLE_CONNECTION_STRING` (ej: `localhost:1521/FREEPDB1`)

## 3) Probar conexión

1. Levantar API:

```bash
npm run server
```

2. Validar:

```bash
curl http://localhost:3001/api/people
```

Si responde JSON, la app ya está vinculada con Oracle/SQL Developer.
