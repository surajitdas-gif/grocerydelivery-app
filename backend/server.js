const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/villageDelivery')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('backend running');
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on port 5000');
});