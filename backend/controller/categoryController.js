const Book = require("../models/Books");
const Category = require("../models/Category");

module.exports = {
    async addCategory(req, res) {
        try {
            console.log(req.body.name)
            const categoryName = req.body.name
            const isCategoryExist = await Category.findOne({
                name: { $regex: new RegExp(`^${categoryName}$`, "i") }
            });

            if (isCategoryExist) {
                return res.status(400).json({ message: "Category already exists." });
            }

            const newCategory = new Category({
                name: categoryName,
                image: req.file?.filename
            });
            await newCategory.save();
            res.status(200).json({ success: true })
        } catch (err) {
            console.log(err)
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
                    updatedAt: new Date(category.updatedAt).toUTCString().slice(5,16)
                };
            });
            console.log(categories)
            res.status(200).json({ categories: categories })
        } catch (err) {
            res.status(400).json({ messsage: err })
        }
    },
    async getListedCategories(req,res){
      try{
        const categories = await Category.find({listed:true})
        res.status(200).json({ categories: categories })
      }catch(err){
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
            console.log("Update Category")
            const { categoryId } = req.params
            console.log(req.file?.originalname,req.file?.filename)
            let updatedData = { ...req.body }
            if (req.file) {
                updatedData.image = req.file.filename
            }

            const updatedCategory = await Category.findByIdAndUpdate(
                categoryId,
                { $set: updatedData },
                { new: true }
            );

            res.status(200).json({ success: true, updatedCategory });
        } catch (err) {
            console.log(err)
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
          await Book.updateMany({category:categoryId},{
            $set:{
                isDeleted : !category.listed
            }
          })
          await category.save()
          res.status(200).json({ success: true })
        } catch (err) {
            console.log(err)
          res.status(500).json({ message: "Someething Went Wrong" })
        }
      }
}