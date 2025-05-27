const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');
dotenv.config();

const app = express();
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

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});