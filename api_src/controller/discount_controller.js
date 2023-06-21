 // GET all discounts
const {Discount} = require("../model/model");
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
            const discount = await Discount.findById(req.params.id)
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
            const discountTemp = await Discount.findOne({shopId:req.body.shopId,discountCode:req.body.discountCode})
            if(discountTemp){

                return res.status(400).json({message: "Mã giảm giá đã tồn tại"})
            }
            await discount.save()

            res.status(200).json(discount)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    // UPDATE discount by ID
    updateDiscountById : async (req, res) => {
        try {
            const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true })
            if (!discount) {
                return res.status(404).json({ message: 'Discount not found' })
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
            res.status(200).json({ message: 'Discount deleted successfully' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
}
 module.exports = discountController