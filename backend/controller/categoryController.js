const Book = require("../models/Books");
const Category = require("../models/Category");
const { handleUpload, deleteImage } = require("../utils/cloudinary");

module.exports = {
    async addCategory(req, res) {
        try {
            const categoryName = req.body.name
            const isCategoryExist = await Category.findOne({
                name: { $regex: new RegExp(`^${categoryName}$`, "i") }
            })

            if (isCategoryExist) {
                return res.status(400).json({ message: "Category already exists." });
            }

            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cldRes = await handleUpload(dataURI)

            const newCategory = new Category({
                name: categoryName,
                image: {
                    secure_url: cldRes.secure_url,
                    public_id: cldRes.public_id
                }
            })
            await newCategory.save();
            res.status(200).json({ success: true })
        } catch (err) {
            res.status(400).json({ success: false, message: "Error while Creating category" });
        }
    },
    async getAllCategories(req, res) {
        try {
            const { name } = req.query;
            const query = {};

            if (name) {
                query.name = { $regex: new RegExp(name, "i") };
            }
            let categories = await Category.find(query)
            categories = categories.map(category => {
                return {
                    ...category._doc,
                    createdAt: new Date(category.createdAt).toUTCString().slice(5, 16),
                    updatedAt: new Date(category.updatedAt).toUTCString().slice(5, 16)
                }
            })
            res.status(200).json({ categories: categories })
        } catch (err) {
            res.status(400).json({ messsage: err })
        }
    },
    async getListedCategories(req, res) {
        try {
            const categories = await Category.find({ listed: true })
            res.status(200).json({ categories: categories })
        } catch (err) {
            res.status(400).json({ messsage: err })
        }
    },
    async getCategoryData(req, res) {
        try {
            const categoryData = await Category.findOne({ _id: req.params.categoryId })
            res.status(200).json({ categoryData: categoryData })
        } catch (err) {
            res.status(400).json({ messsage: err })
        }
    },
    async updateCategory(req, res) {
        try {
            const { categoryId } = req.params
            let updatedData = { ...req.body }
            const updatedCategory = await Category.findByIdAndUpdate(
                categoryId,
                { $set: updatedData },
                { new: true }
            )
            deleteImage(updatedCategory.image.public_id)

            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cldRes = await handleUpload(dataURI)
            updatedCategory.image = {
                secure_url: cldRes.secure_url,
                public_id: cldRes.public_id
            }
            updatedCategory.save()
            res.status(200).json({ success: true, updatedCategory });
        } catch (err) {
            res.status(400).json({ success: false, message: "Error while updating category" })
        }
    },
    async listOrUnlistCategory(req, res) {
        try {
            const { categoryId } = req.params
            const category = await Category.findOne({ _id: categoryId })
            if (!category) {
                return res.status(404).json({ message: "No such Category Found" })
            }
            category.listed = !category.listed
            await Book.updateMany({ category: categoryId }, {
                $set: {
                    isDeleted: !category.listed
                }
            })
            await category.save()
            res.status(200).json({ success: true })
        } catch (err) {
            res.status(500).json({ message: "Someething Went Wrong" })
        }
    }
}