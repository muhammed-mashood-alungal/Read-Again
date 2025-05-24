const Cart = require("../models/Cart")
const Book = require("../models/Books")
const Offer = require("../models/Offer")
module.exports = {
  async addToCart(req, res) {
    try {
      const { itemInfo } = req.body
      const { userId } = req.params
      if (itemInfo.quantity > 3) {
        return res.status(400).json({ success: false, message: "You can only add the same item up to 3 times." })
      }
      const cart = await Cart.findOne({ userId })
      const productData = await Book.findOne({ _id: itemInfo.productId, isDeleted: false }).populate("appliedOffer")
      if (productData.appliedOffer?.isActive) {
        const originalPrice = productData?.formats?.physical?.price
        productData.price = originalPrice - (originalPrice * (productData.appliedOffer.discountValue / 100))
      } else {
        productData.price = productData.formats?.physical?.price
      }
      if (productData.formats.physical.stock == 0) {
        return res.status(400).json({ success: false, message: "Product is Sold Out.Try later...!" })
      }
      if (productData.formats.physical.stock < itemInfo.quantity) {
        return res.status(400).json({ success: false, message: "Not Much Stocks left for this Book.Try less..!" })
      }
      if (!productData) {
        return res.status(400).json({ success: false, message: "Product Not Found" })
      }
      if (!cart) {
        await Cart.create({
          userId: userId,
          items: itemInfo,
          totalQuantity: itemInfo.quantity,
          totalAmount: productData.price * parseInt(itemInfo.quantity)
        })
        return res.status(200).json({ success: true })
      } else {
        for (let i = 0; i < cart.items.length; i++) {
          if (cart.items[i].productId == itemInfo.productId) {
            if (cart.items[i].quantity + itemInfo.quantity > productData.formats.physical.stock) {
              return res.status(400).json({ success: false, message: "Not Much Quantity Availble" })
            }
            if (cart.items[i].quantity + itemInfo.quantity <= 3) {
              cart.items[i].quantity += itemInfo.quantity
              cart.totalQuantity += itemInfo.quantity
              cart.totalAmount += productData.price

              await cart.save()
              return res.status(200).json({ success: true })
            } else {
              return res.status(400).json({ success: false, message: "You can only add the same item up to 3 times." })
            }
          }
        }
        cart.totalQuantity += parseInt(itemInfo.quantity)
        cart.totalAmount += productData.price * parseInt(itemInfo.quantity)
        cart.items.push(itemInfo)
        cart.save()
        return res.status(200).json({ success: true })
      }
    } catch (err) {
      return res.status(400).json({ success: false, message: "Something Went Wrong.Please Try Later" })
    }
  },
  async getCart(req, res) {
    try {
      const { userId } = req.params;
      const cart = await Cart.findOne({ userId }).populate({ path: "items.productId" });

      if (!cart) {
        return res.status(200).json({ success: true, cart: { items: [] } });
      }
      let totalAmount = 0
      const updatedItems = await Promise.all(
        cart.items.map(async (item) => {
          const offer = await Offer.findOne({ _id: item?.productId?.appliedOffer });
          if (offer && offer.isActive) {
            item.productId.appliedOffer = offer;
            const originalPrice = item?.productId?.formats?.physical?.price
            const productPrice = originalPrice - (originalPrice * (item?.productId?.appliedOffer?.discountValue / 100))
            totalAmount += productPrice * item.quantity
          } else {
            totalAmount += item.productId.formats.physical.price * item.quantity
          }
          if (!item?.productId?.isDeleted && item?.productId?.formats?.physical?.stock != 0) {
            return item;
          }
          cart.totalQuantity -= item.quantity;
          return null;
        })
      );
      cart.items = updatedItems.filter((item) => item !== null);
      cart.totalAmount = totalAmount
      await cart.save()

      res.status(200).json({ success: true, cart });
    } catch (err) {
      console.log(err)
      res.status(400).json({ success: false, message: "Something Went Wrong while fetching Cart" });
    }
  },
  async changeQuantity(req, res) {
    try {

      const { userId } = req.params
      const { value, index, priceInc } = req.body
      if (value > 3) {
        return res.status(400).json({ success: false, message: "You can only add the same item up to 3 times." })
      }
      const cart = await Cart.findOne({ userId })
      const book = await Book.findOne({ _id: cart.items[index].productId })
      if (value > book.formats.physical.stock) {
        return res.status(400).json({ success: false, message: "The quantity you selected exceeds the available stock" })
      }
      cart.totalQuantity += value - cart.items[index].quantity
      cart.items[index].quantity = value
      cart.totalAmount += priceInc

      await cart.save()
      res.status(200).json({ success: true })
    } catch (err) {
      return res.status(400).json({ success: false, message: "Something Went Wrong.Please Try Later" })
    }
  },
  async removeItem(req, res) {
    try {
      const { userId } = req.params
      const { index, newAmount, newQuantity } = req.body
      const cart = await Cart.findOne({ userId })
      cart.totalAmount = newAmount
      cart.totalQuantity = newQuantity
      cart.items = cart.items.filter((_, idx) => idx != index)
      cart.save()
      res.status(200).json({ success: true })
    } catch (err) {
      res.status(400).json({ message: "Somthing Went Wrong while Removing Item from Cart" })

    }
  },
  async getCartItemsCount(req, res) {
    try {
      const { userId } = req.params
      if (!userId) {
        return res.status(200).json({ succees: true, cartItemsCount: 0 })
      }
      const cart = await Cart.findOne({ userId: userId }, { items: 1 })
      const cartItemsCount = cart?.items?.reduce((count, item) => {
        return count + item.quantity
      }, 0)
      res.status(200).json({ succees: true, cartItemsCount })

    } catch (err) {
      res.status(400).json({ succees: false, message: "Something Went Wrong" })
    }
  }
} 