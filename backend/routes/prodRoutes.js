const { Router } = require("express");
const { authentication } = require("../middlewares/authentication");
const { ProdModel } = require("../models/Prod.model");

const prodRouter = Router();

prodRouter.get("/", authentication, async (req, res) => {
    const { filterBy, sortBy, q, page } = req.body;
    const limit = 4;

    try {
        let products = await ProdModel.find();

        if (filterBy) {
            products = await ProdModel.find({ category: filteBy })
        }
        if (sortBy) {
            let order = 1;
            if (sortBy === 'asc') order = 1;
            else order = -1;

            products = await ProdModel.find().sort({ date: order })
        }
        if (q) {
            products = await ProdModel.find({ name: { $regex: q, $options: "i" } })
        }
        if (page) {
            products = await ProdModel.find().skip((page - 1) * limit).limit(limit);
        }
        res.send({ products: products })
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching products");
    }
})

prodRouter.post("/create", authentication, async (req, res) => {
    const { name, description, category, image, location, date, price } = req.body;

    const user_id = req.user_id;

    const new_prod = new ProdModel({
        name,
        description,
        category,
        image,
        location,
        date,
        price,
        user_id: user_id
    })
    try {
        await new_prod.save();
        res.status(200).send({ msg: "Product added successfully" })
    } catch (error) {
        console.log(err)
        res.status(500).send("Error adding product")
    }
})

prodRouter.post("/delete/:prodID", authentication, async (req, res) => {
    const id = req.params.prodID;
    const user_id = req.user_id;

    const product = await ProdModel.findOne({ _id: id });
    const product_user_id = product.user_id;

    if (user_id !== product_user_id) {
        res.send({ msg: "Unauthorized" })
    } else {
        try {
            await ProdModel.findByIdAndDelete({ _id: id });
            res.status(200).send({ msg: "Product deleted successfully" })
        } catch (error) {
            console.log(error);
            res.status(500).send({ msg: "Error deleting product" })
        }
    }

})


module.exports = { prodRouter };