const {CoinChangeHistory, User} = require("../model/model");

const coinChangeHistoryController = {
    createCoinChangeHistory : async (req, res) => {
        try {
            const coinChangeHistory = new CoinChangeHistory(req.body);
            await User.findByIdAndUpdate(coinChangeHistory.userId,{$push: {coinChangeHistories: coinChangeHistory._id}})
            const savedCoinChangeHistory = await coinChangeHistory.save();
            res.status(200).json(savedCoinChangeHistory);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating the coinChangeHistory' });
        }
    },
    removeCoinChangeHistory : async (req, res) => {
        try {
            const { coinChangeHistoryId } = req.params;
            const removedCoinChangeHistory = await CoinChangeHistory.findByIdAndRemove(coinChangeHistoryId,{new:true});
            if (!removedCoinChangeHistory) {
                return res.status(404).json({ error: 'CoinChangeHistory not found' });
            }

            await User.findByIdAndUpdate(removedCoinChangeHistory.userId,{$pull: {coinChangeHistories: removedCoinChangeHistory._id}})

            res.status(200).json({ message: 'CoinChangeHistory removed successfully' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while removing the coinChangeHistory' });
        }

    },
    getCoinChangeHistoryById: async (req, res) => {
        try {
            const { coinChangeHistoryId } = req.params;

            const coinChangeHistory = await CoinChangeHistory.findById(coinChangeHistoryId);

            if (!coinChangeHistory) {
                return res.status(404).json({ error: 'CoinChangeHistory not found' });
            }

            res.status(200).json(coinChangeHistory);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving the coinChangeHistory' });
        }
    }

}
module.exports = coinChangeHistoryController