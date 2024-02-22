const express = require('express');
const router = express.Router();

const tags = require("../model/Tag.js")
const categories = require("../model/Category.js")
const products = require("../model/Product.js")
const {param, body, validationResult} = require('express-validator');


router.get('/new', (req, res) => {
    res.render('tagForm', { title: "Créer un tag"});
});

router.post(
    '/new',
    body('name').isLength({min: 3}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(errors.isEmpty()){
            tags.insert(req.body).then(() => res.redirect(`/tags/`));
        }else{
            res.send(errors);
        }
    });

router.get('/', async (req, res) => {
    res.render('tags', {title: "Tags", tags: await tags.getAll()});
});

router.get('/:tagId', (req, res) => {
    tags.getById(req.params.tagId).then(async (tag) => {
        res.render('tag', {
            title: `Tag ${tag.name}`,
            products: await products.getByTag(req.params.tagId),
            tagId: tag._id
        });
    }).catch(() => {
        res.status(404).send('Page not found!');
    });
});

router.get('/:tagId/update', (req, res) => {
    tags.getById(req.params.tagId).then(async (tag) => {
        res.render('tagForm', {
            title: `Modifier ${tag.name}`,
            item: tag
        });
    }).catch(() => {
        res.status(404).send('Page not found!');
    });
});

router.post(
    '/:tagId/update',
    body('name').isLength({min: 3}).escape(),
    (req, res, next) => {
        tags.getById(req.params.tagId).then(async (tag) => {
            const errors = validationResult(req);
            if(errors.isEmpty()){
                tags.update(tag._id, req.body).then(() => res.redirect(`/tags/${tag._id}`));
            }else{
                res.send(errors);
            }
        }).catch(() => {
            res.status(404).send('Page not found!');
        });
    });

router.get('/:tagId/delete', (req, res) => {
    tags.getById(req.params.tagId).then((tag) => {
        res.render('deleteConfirm', {
            title: "Confirmation de suppression",
            itemType: "tag",
            itemName: tag.name,
            itemId: tag._id
        });
    }).catch(() => {
        res.status(404).send('Page not found!');
    });
});

router.post('/:tagId/delete', (req, res) => {
    tags.getById(req.params.tagId).then((tag) => {
        tags.delete(tag._id).then((r) => res.redirect('/tags'))
    }).catch(() => {
        res.status(404).send('Page not found!');
    })
});

module.exports = router;