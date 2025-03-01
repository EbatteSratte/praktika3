const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;
const productsFilePath = './data/products.json';

app.use(express.json());
app.use(express.static(path.join(__dirname)));

let products = [];
fs.readFile(productsFilePath, (err, data) => {
    if (!err) {
        try {
            products = JSON.parse(data);
        } catch (e) {
            console.error('Error parsing JSON:', e);
            products = [];
        }
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'user.html'));
});

app.get('/products', (req, res) => {
    const category = req.query.category;
    if (category) {
        const filteredProducts = products.filter((product) =>
            product.category.includes(category)
        );
        res.json(filteredProducts);
    } else {
        res.json(products);
    }
});

app.listen(PORT, () => {
    console.log(`User server is running on http://localhost:${PORT}`);
});