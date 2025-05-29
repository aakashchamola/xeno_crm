const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');
const mysql = require('mysql2/promise');
dotenv.config();
async function initDb() {
  const db = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || 'xeno_crm',
  });
  return db;
}


initDb().then(db => {
  const app = express();
  app.locals.db = db;
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// Swagger UI setup
const openapiPath = path.join(__dirname, '..', 'openapi.yaml');
if (fs.existsSync(openapiPath)) {
  const swaggerDocument = require('yamljs').load(openapiPath);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}


app.use('/customers', require('./routes/customers'));
app.use('/orders', require('./routes/orders'));
app.use('/campaigns', require('./routes/campaigns'));
app.use('/deliveryReceipts', require('./routes/deliveryReceipts'));
app.use('/preview', require('./routes/previews'));
// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));
  const PORT = process.env.PORT || 8002;
  app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
  });

}).catch(err => {
  console.error('Failed to connect to MySQL:', err);
  process.exit(1);
});
