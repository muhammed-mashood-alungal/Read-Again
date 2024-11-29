const Cart = require("../models/Cart")

module.exports = {
  async addToCart(req, res) {
    try {
      console.log(req.body)
      const { itemInfo } = req.body
      console.log(itemInfo)
      const { userId } = req.params
      console.log(userId)
      const cart = await Cart.findOne({ userId })
      if (!cart) {
        await Cart.create({
          userId: userId,
          items: itemInfo
        })
      } else {
        for (let i = 0; i < cart.items.length; i++) {
          if (cart.items[i].productId == itemInfo.productId) {
            if (cart.items[i].quantity + itemInfo.quantity <= 3) {
              cart.items[i].quantity += itemInfo.quantity
              cart.save()
              return res.status(200).json({ success: true })
            } else {
              return res.status(400).json({ success: false, message: "You can only add the same item up to 3 times." })
            }
          }
        }
        cart.items.push(itemInfo)
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
      const { value, index } = req.body
      if(value > 3){
       return res.status(400).json({success:false , message:"You can only add the same item up to 3 times."})
      }
      console.log(userId, value, index)
      const cart = await Cart.findOne({userId})
      cart.items[index].quantity = value
      console.log(cart.items[index])
      cart.save()
    } catch (err) {
      console.log(err)
    }
  },
  async removeItem(req,res){
    try{
      const {userId} = req.params
      const  {index} = req.body
      const cart = await Cart.findOne({userId}) 
      console.log(cart.items[index],index)
      
      cart.items= cart.items.filter((_,idx)=> idx != index)
      console.log(cart.items)
      cart.save()
      res.status(200).json({success:true})
    }catch(err){
      console.log(err)
      res.status(400).json({message:"Somthing Went Wrong while Removing Item..."})

    }
  }
} 