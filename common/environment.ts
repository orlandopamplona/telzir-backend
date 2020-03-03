/**
 * @description System parameters that are captured from environment variables or at
 * their default value. Define information such as URL to access the database, access port, etc.
*/
export const environment = {
    server: { port: process.env.SERVER_PORT || 3001 },
    db: { url: process.env.DB_URL || 'mongodb://localhost/telzir-api' },
    dbTest: { url: process.env.DB_URL_TEST || 'mongodb://localhost/telzir-api-test' },
    serverTest: { port: process.env.SERVER_PORT_TEST || 3003 },
}