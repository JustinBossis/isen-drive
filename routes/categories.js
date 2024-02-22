const express = require('express');
const router = express.Router();

const categories = require("../model/Category.js")
const products = require("../model/Product.js")
const {param, body, validationResult} = require('express-validator');
const tags = require("../model/Tag");


router.get('/new', (req, res) => {
    res.render('categoryForm', { title: "Créer un rayon"});
});

router.post(
    '/new',
    body('name').isLength({min: 3}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(errors.isEmpty()){
            categories.insert(req.body).then(() => res.redirect(`/categories/`));
        }else{
            res.send(errors);
        }
});

router.get('/', async (req, res) => {
    res.render('categories', {title: "Rayons", categories: await categories.getAll()});
});

router.get('/:categoryId', async (req, res) => {
    categories.getById(req.params.categoryId).then(async (category) => {
        res.render('category', {
            title: `Produits du rayon ${category.name}`,
            products: await products.getByCategory(req.params.categoryId),
            categoryId: category._id
        });
    }).catch(() => {
        res.status(404).send('Page not found!');
    });

});

router.get('/:categoryId/update', (req, res) => {
    categories.getById(req.params.categoryId).then(async (category) => {
        res.render('categoryForm', {
            title: `Modifier ${category.name}`,
            item: category
        });
    }).catch(() => {
        res.status(404).send('Page not found!');
    });
});

router.post(
    '/:categoryId/update',
    body('name').isLength({min: 3}).escape(),
    (req, res, next) => {
        categories.getById(req.params.categoryId).then(async (category) => {
            const errors = validationResult(req);
            if(errors.isEmpty()){
                categories.update(category._id, req.body).then(() => res.redirect(`/categories/${category._id}`));
            }else{
                res.send(errors);
            }
        }).catch(() => {
            res.status(404).send('Page not found!');
        });

});

router.get('/:categoryId/delete', async (req, res) => {
    categories.getById(req.params.categoryId).then((category) => {
        res.render('deleteConfirm', {
            title: "Confirmation de suppression",
            itemType: "rayon",
            itemName: category.name,
            itemId: category._id
        });
    }).catch(() => {
        res.status(404).send('Page not found!');
    });
});

router.post('/:categoryId/delete', (req, res) => {
    categories.getById(req.params.categoryId).then((category) => {
        categories.delete(category._id).then((r) => res.redirect('/categories'))

    }).catch(() => {
        res.status(404).send('Page not found!');
    })
});

module.exports = router;