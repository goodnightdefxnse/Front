const { request } = require('express');
const express = require('express');
const categories = require('./routes/categories');
const sale = require('./routes/sale');
const order = require('./routes/order');
const products = require('./routes/products');
const sequelize = require('./database/database');
const cors = require('cors')
const Category = require('./database/models/category');
const Product = require('./database/models/product');

Category.hasMany(Product);
Product.belongsTo(Category); // Добавил для полной связи

const app = express();
const PORT = process.env.PORT || 3333;

// Middleware (в правильном порядке)
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Сервируем статику фронтенда (из build)
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(frontendBuildPath));

// API роуты (ДО catch-all!)
app.use('/categories', categories);
app.use('/products', products);
app.use('/sale', sale);
app.use('/order', order);

// Catch-all для React Router (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});
const start = async () =>{
    try{
        await sequelize.sync().then(
            result => {/*console.log(result) */},
            err => console.log(err)
        );
        
        app.listen(PORT, () => {
             console.log(`Server started on http://localhost:${PORT} port...`)
      })
    }catch(err){
        console.log(err);
    }
}
start();

// app.listen('3333');
