const express = require('express');
const categories = require("../model/Category");
const products = require("../model/Product");
const tags = require("../model/Tag");
const {body, validationResult} = require("express-validator");
const router = express.Router();

router.get('/new', async (req, res) => {
    res.render('productForm', {title: "Créer un produit", categories: await categories.getAll(), tags: await tags.getAll()});
});

router.post(
    '/new',
    body('name').isLength({min: 3}).escape(),
    body('description').isLength({min: 10}).escape(),
    body('price').isFloat({min:0}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(errors.isEmpty()){
            products.insert(req.body).then((r) => res.redirect(`/products/${r}`));
        }else{
            res.send(errors);
        }
    });

router.get('/:productId', (req, res) => {
    products.getById(req.params.productId).then(async (product) => {
        res.render('product', {
            title: `${product.name}`,
            product: product,
            productTags: await tags.getByProduct(product)
        });
    }).catch(() => {
        res.status(404).send('Page not found!');
    });
});

router.get('/:productId/update', (req, res) => {
    products.getById(req.params.productId).then(async (product) => {
        res.render('productForm', {
            title: `Modifier ${product.name}`,
            product: product,
            categories: await categories.getAll(),
            tags: await tags.getAll()
        });
    }).catch(() => {
        res.status(404).send('Page not found!');
    });
});

router.post(
    '/:productId/update',
    body('name').isLength({min: 3}).escape(),
    body('description').isLength({min: 10}).escape(),
    body('price').isFloat({min:0}).escape(),
    (req, res, next) => {
        products.getById(req.params.productId).then(async (product) => {
            const errors = validationResult(req);
            if(errors.isEmpty()){
                products.update(product._id, req.body).then(() => res.redirect(`/products/${product._id}`));
            }else{
                res.send(errors);
            }
        }).catch(() => {
            res.status(404).send('Page not found!');
        });
    });

router.get('/:productId/delete', (req, res) => {
    products.getById(req.params.productId).then(async (product) => {
        res.render('deleteConfirm', {
            title: "Confirmation de suppression",
            itemType: "produit",
            itemName: product.name,
            itemId: product._id
        });
    }).catch(() => {
        res.status(404).send('Page not found!');
    })
});

router.post('/:productId/delete', (req, res) => {
    products.getById(req.params.productId).then(async (product) => {
        products.delete(product._id).then((r) => res.redirect('/'))

    }).catch(() => {
        res.status(404).send('Page not found!');
    })
});

module.exports = router;