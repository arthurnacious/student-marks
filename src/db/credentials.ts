export const dbCredentials = {
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  database: process.env.DB_NAME as string,
  password: process.env.DB_PASS as string,
  pool: process.env.DB_PORT as string,
};
