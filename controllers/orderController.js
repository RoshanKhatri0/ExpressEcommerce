const OrderItem=require('../models/order-itemModel')
const Order=require('../models/orderModel')

//post order
exports.postOrder=async(req,res)=>{
    const orderItemsIds=Promise.all(req.body.orderItems.map(async orderItem=>{
        let newOrderItem = new OrderItem({
            quantity:orderItem.quantity,
            product:orderItem.product
        })
        newOrderItem= await newOrderItem.save()
        return newOrderItem._id
    }))
    const orderItemIdsResolved = await orderItemsIds
    //calculating total price
    const totalAmount= await Promise.all(orderItemIdsResolved.map(async orderId=>{
        const itemOrder= await OrderItem.findById(orderId).populate('product','product_price')
        const total=itemOrder.quantity*itemOrder.product.product_price
        return total
    }))
    const TotalPrice=totalAmount.reduce((a,b)=>a+b,0)

    let order= new Order({
        orderItems:orderItemIdsResolved,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        country:req.body.country,
        zip:req.body.zip,
        phone:req.body.phone,
        totalPrice:TotalPrice,
        user:req.body.user
    })
    order= await order.save()
    if(!order){
        return res.status(400).json({error:'something went wrong with order'})
    }
    res.send(order)
}