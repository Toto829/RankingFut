import dotenv from 'dotenv'

dotenv.config()

export const serverConfig = {
  port: Number(process.env.PORT ?? 3001),
  redisUrl: process.env.REDIS_URL,
  oracle: {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectionString: process.env.ORACLE_CONNECTION_STRING,
  },
}

export const hasOracleConfig = () =>
  Boolean(serverConfig.oracle.user && serverConfig.oracle.password && serverConfig.oracle.connectionString)
