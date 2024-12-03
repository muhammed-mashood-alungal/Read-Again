const Cart = require("../models/Cart")
const Book = require("../models/Books")
module.exports = {
  async addToCart(req, res) {
    try {
      const { itemInfo } = req.body
      const { userId } = req.params
      const cart = await Cart.findOne({ userId })
      const productData = await Book.findOne({ _id: itemInfo.productId, isDeleted: false })
      if(productData.formats.physical.stock == 0){
        return res.status(400).json({ success: false, message: "Product is Sold Out.Try later...!" })
      }
      if(productData.formats.physical.stock < itemInfo.quantity){
        return res.status(400).json({ success: false, message: "Not Much Stocks left for this Book.Try less..!" })
      }
      if (!productData) {
        return res.status(400).json({ success: false, message: "Product Not Found" })
      }
      if (!cart) {

        await Cart.create({
          userId: userId,
          items: itemInfo,
          totalQuantity: 1,
          totalAmount: productData.formats?.physical?.price
        })
        return res.status(200).json({ success: true })
      } else { 
        for (let i = 0; i < cart.items.length; i++) {
          if (cart.items[i].productId == itemInfo.productId) {
            itemInfo.quantity = parseInt(itemInfo.quantity)
            if (cart.items[i].quantity + itemInfo.quantity <= 3) {
              cart.items[i].quantity += itemInfo.quantity
              cart.totalQuantity += 1
              cart.totalAmount += productData.formats?.physical?.price
              cart.save()
              return res.status(200).json({ success: true })
            } else {
              return res.status(400).json({ success: false, message: "You can only add the same item up to 3 times." })
            }
          }
        }
        cart.totalQuantity += 1
        cart.totalAmount += productData.formats?.physical?.price
        cart.items.push(itemInfo)
        console.log(cart) 
        cart.save()
        return res.status(200).json({ success: true })
      }

    } catch (err) {
      console.log(err)
    }
  },
  async getCart(req, res) {
    try {
      const { userId } = req.params
      const cart = await Cart.findOne({ userId }).populate({ path: "items.productId" })
      
      console.log(cart)
      if (!cart) {
        return res.status(200).json({ success: true, cart: { items: [] } })
      }
 
      cart.items = cart.items.filter((item) => {
        if(item.productId != null && item.productId.isDeleted == false){
          return true
        }
        if(item.productId != null){
          cart.totalQuantity = cart.totalQuantity - item.quantity
          cart.totalAmount = cart.totalAmount - (item.quantity * item.productId.formats.physical.price)
          console.log(cart.totalQuantity,cart.totalAmount)
        }
      })
      console.log("filtered cart ++++++++++++++++++++++++")
      console.log(cart)
      console.log(JSON.stringify(cart, null, 2))
      res.status(200).json({ success: true, cart: cart })
    } catch (err) {
      console.log(err)
      res.status(400).json({ succees: false, message: "Something Went Wrong while fething Cart" })
    }
  },
  async changeQuantity(req, res) {
    try {

      const { userId } = req.params
      const { value, index , priceInc } = req.body
      if (value > 3) {
        return res.status(400).json({ success: false, message: "You can only add the same item up to 3 times." })
      }
      console.log(userId, value, index)
      const cart = await Cart.findOne({ userId })
      const book = await Book.findOne({_id : cart.items[index].productId})
      if(value > book.formats.physical.stock){
        return res.status(400).json({ success: false, message: "The quantity you selected exceeds the available stock" })
      }
      cart.totalQuantity += value - cart.items[index].quantity 
      console.log(value - cart.items[index].quantity )
      cart.items[index].quantity = value
      console.log(cart.totalAmount + priceInc)
      cart.totalAmount += priceInc
     
      console.log(cart.items[index])
      cart.save()
      res.status(200).json({success:true})
    } catch (err) {
      console.log(err)
    }
  },
  async removeItem(req, res) {
    try {
      const { userId } = req.params
      const { index , newAmount , newQuantity } = req.body
      const cart = await Cart.findOne({ userId })
      console.log(cart.items[index], index)
      cart.totalAmount = newAmount
      cart.totalQuantity = newQuantity
      cart.items = cart.items.filter((_, idx) => idx != index)
      console.log(cart.items)
      cart.save()
      res.status(200).json({ success: true })
    } catch (err) {
      console.log(err)
      res.status(400).json({ message: "Somthing Went Wrong while Removing Item..." })

    }
  }
} 