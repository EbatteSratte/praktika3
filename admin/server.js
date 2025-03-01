const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const productsFilePath = './data/products.json';

app.use(express.json());

let products = [];
fs.readFile(productsFilePath, (err, data) => {
    if (!err) {
        products = JSON.parse(data);
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/products', (req, res) => {
    fs.readFile(PRODUCTS_FILE, (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.post('/products', (req, res) => {
    const newProduct = req.body;
    newProduct.id = products.length + 1;
    products.push(newProduct);
    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(201).json(newProduct);
        }
    });
});

app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedProduct = req.body;
    fs.readFile(PRODUCTS_FILE, (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            let products = JSON.parse(data);
            const index = products.findIndex((p) => p.id === productId);
            if (index === -1) {
                res.status(404).send('Product not found');
            } else {
                products[index] = { ...products[index], ...updatedProduct };
                fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), (err) => {
                    if (err) {
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.json(products[index]);
                    }
                });
            }
        }
    });
});

app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    fs.readFile(PRODUCTS_FILE, (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            let products = JSON.parse(data);
            const index = products.findIndex((p) => p.id === productId);
            if (index === -1) {
                res.status(404).send('Product not found');
            } else {
                products.splice(index, 1);
                fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), (err) => {
                    if (err) {
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.status(204).send();
                    }
                });
            }
        }
    });
});


app.listen(PORT, () => {
    console.log(`Admin server is running on http://localhost:${PORT}`);
});