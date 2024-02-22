const path = require('path');
const express = require("express");
const morgan = require('morgan');
const app = express()
require("dotenv").config()
const port = process.env.PORT;

app.use(morgan('tiny'));
app.use(express.static("public"));
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));


const indexRouter = require("./routes/index.js");
const categoriesRouter = require("./routes/categories.js");
const productsRouter = require("./routes/products.js");
const tagsRouter = require("./routes/tags.js");

app.use("/", indexRouter);
app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);
app.use("/tags", tagsRouter);

app.use( (req, res, next) => {
    res.status(404).send('Page not found!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    console.log(process.env.NODE_ENV)
});
