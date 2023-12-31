 // GET all discounts
const {Discount, Shop, Post} = require("../model/model");
 const mongoose = require("mongoose");
 const discountController = {
    getAllDiscounts : async (req, res) => {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 20;
        try {
            const discounts = await Discount.find({isActive:true})
                .skip(startIndex)
                .limit(limit);
            res.status(200).json(discounts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // GET discount by ID
    getDiscountById : async (req, res) => {
        try {
            const discount = await Discount.findById(req.params.id).populate('categoryId')
            if (!discount) {
                return res.status(404).json({ message: 'Discount not found' })
            }
            res.status(200).json(discount)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    // CREATE new discount
    createDiscount : async (req, res) => {
        const discount = new Discount(req.body)
        try {
            const shop = await Shop.findById(discount.shopId)
            if(req.body.forAll){
                for (let post of shop.posts){
                   const postTemp = await Post.findById(post).populate('allDiscounts').select("allDiscounts")
                       // console.log(postTemp)
                    if(postTemp){
                        if(!postTemp.allDiscounts){
                            postTemp.allDiscounts = [discount._id]
                            //console.log("vao day ")
                        } else {
                            postTemp.allDiscounts.push(discount._id)
                            //console.log("khong vao")
                        }
                        await postTemp.save()
                    }
                  // await Post.findByIdAndUpdate(post,{$push:{allDiscounts: }})
                }
            } else {
                if(req.body.postId){
                    for(let post of req.body.postId){
                        const postTemp = await Post.findById(post)
                        if(postTemp){
                            if(postTemp.allDiscounts){
                                postTemp.allDiscounts.push(discount._id)
                                await postTemp.save()
                            } else {
                                postTemp.allDiscounts = [discount._id]
                            }
                        }
                    }
                } else {
                    if(req.body.categoryId){
                        await Post.updateMany({category:req.body.categoryId,shopId:req.body.shopId},{$push:{allDiscounts: discount._id}})
                    }
                }
            }
            await Shop.findByIdAndUpdate(req.body.shopId,{$push:{allDiscounts: discount._id}})
            const savedDiscount = await discount.save()
            res.status(200).json(savedDiscount)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    // UPDATE discount by ID
    updateDiscountById : async (req, res) => {
        try {
            const discount = await Discount.findByIdAndUpdate(req.params.id, {isActive: req.body.isActive}, { new: true })
            if (!discount) {
                return res.status(404).json({ message: 'Discount not found' })
            }
            const shop = await Shop.findById(discount.shopId)
            if(discount.forAll){
                for (let post of shop.posts){
                    const postTemp = await Post.findById(post)
                    //postTemp.allDiscounts.push(discount._id)
                    await postTemp.save()
                    // await Post.findByIdAndUpdate(post,{$push:{allDiscounts: }})
                }
            } else {
                if(discount.postId.length !== 0){
                    for (let post of discount.postId){
                        const postTemp = await Post.findById(post)
                        //postTemp.allDiscounts.push(discount._id)
                        await postTemp.save()
                        // await Post.findByIdAndUpdate(post,{$push:{allDiscounts: }})
                    }
                } else {
                    if(discount.categoryId){
                        for (let post of shop.posts){
                            const postTemp = await Post.findOne({category:discount.categoryId,_id:post})
                            await postTemp.save()
                        }
                    }
                }
            }

            res.status(200).json(discount)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    // DELETE discount by ID
    deleteDiscountById : async (req, res) => {
        try {
            const discount = await Discount.findByIdAndDelete(req.params.id)
            if (!discount) {
                return res.status(404).json({ message: 'Discount not found' })
            }

            const shop = await Shop.findById(discount.shopId)
            if(discount.forAll){
                for (let post of shop.posts){
                    const postTemp = await Post.findById(post)
                    postTemp.allDiscounts.pull(discount._id)
                    await  postTemp.save()
                }
            } else {
                if(discount.postId.length !== 0){
                    for (let post of discount.postId){
                        const postTemp = await Post.findById(post)
                        postTemp.allDiscounts.pull(discount._id)
                        await  postTemp.save()
                    }
                } else {
                    if(discount.categoryId){
                        for (let post of shop.posts){
                            const postTemp = await Post.findOne({category:discount.categoryId,_id:post})
                            await postTemp.save()
                        }
                    }
                }
            }
            shop.allDiscounts.pull(discount._id)
            await shop.save()
            res.status(200).json({ message: 'Discount deleted successfully' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
}
 module.exports = discountController