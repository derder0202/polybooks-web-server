const {Shop} = require("../model/model");


const shopController = {
    getShops: async (req, res) => {
        try {
            const startIndex = parseInt(req.query.startIndex) || 0;
            const limit = parseInt(req.query.limit) || 20;
            const shops = await Shop.find({})
                .skip(startIndex)
                .limit(limit);
            res.status(200).json(shops);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error getting categories from database.' });
        }
    },

    createShop : async (req, res) => {
        try {
            const { user, address, phone, taxCode } = req.body;
            const shop = await Shop.create({ user, address, phone, taxCode });
            res.status(201).json({ shop });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getShopById : async (req, res) => {
        try {
            const id = req.params.id;
            const shop = await Shop.findById(id);
            if (!shop) {
                return res.status(404).json({ error: 'Shop not found' });
            }
            res.json({ shop });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateShop : async (req, res) => {
        try {
            const id = req.params.id;
            const { user, address, phone, taxCode } = req.body;
            const shop = await Shop.findByIdAndUpdate(
                id,
                { user, address, phone, taxCode },
                { new: true }
            );
            if (!shop) {
                return res.status(404).json({ error: 'Shop not found' });
            }
            res.status(200).json({ shop });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteShop : async (req, res) => {
        try {
            const id = req.params.id;
            const shop = await Shop.findByIdAndDelete(id);
            if (!shop) {
                return res.status(404).json({ error: 'Shop not found' });
            }
            res.status(200).json({
                message: 'Shop deleted successfully',
                shop: {
                    id: shop._id,
                    user: shop.user,
                    address: shop.address,
                    phone: shop.phone,
                    taxCode: shop.taxCode,
                },
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = shopController