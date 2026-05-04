const db = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
exports.upload = multer({ storage: storage }).single('image');

exports.getAllProducts = async (req, res) => {
    try{
        const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
        res.render('index', { products: rows });
    } catch (err){
        console.log(err);
        res.status(500).send('Database Error');
    }
};

exports.getAddForm = (req, res) => {
    res.render('add');
};

exports.addProduct = async (req, res) => {
    const { name, category, price, stock } = req.body;
    let image = req.file ? req.file.filename : 'default.png';

    try {
        await db.query('INSERT INTO products (name, category, price, stock, image) VALUES (?, ?, ?, ?, ?)', 
        [name, category, price, stock, image]);
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Database Error');
    }
};

exports.getEditForm = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
            res.render('edit', { product: rows[0] });
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Database Error');
    }
};

exports.updateProduct = async (req, res) => {
    const { name, category, price, stock, old_image } = req.body;
    let image = old_image;

    if (req.file) {
        image = req.file.filename;
    if (old_image !== 'default.png' && fs.existsSync('./uploads/' + old_image)) {
            fs.unlinkSync('./uploads/' + old_image);
        }
    }
    try {
        await db.query('UPDATE products SET name=?, category=?, price=?, stock=?, image=? WHERE id=?', 
        [name, category, price, stock, image, req.params.id]);
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Database Error');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT image FROM products WHERE id = ?', [req.params.id]);
        
        if (rows.length > 0) {
            const image = rows[0].image;
            if (image !== 'default.png' && fs.existsSync('./uploads/' + image)) {
                fs.unlinkSync('./uploads/' + image);
            }
            await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        }
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Database Error');
    }
};