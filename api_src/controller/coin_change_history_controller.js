const {CoinChangeHistory, User} = require("../model/model");

const coinChangeHistoryController = {
    createCoinChangeHistory : async (req, res) => {
        try {
            const { userId, money, status, description } = req.body;

            const coinChangeHistory = new CoinChangeHistory(req.body);
            await User.findByIdAndUpdate(coinChangeHistory.userId,{})
            const savedCoinChangeHistory = await coinChangeHistory.save();

            res.status(201).json(savedCoinChangeHistory);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating the coinChangeHistory' });
        }
    },
    removeCoinChangeHistory : async (req, res) => {
        try {
            const { coinChangeHistoryId } = req.params;

            const removedCoinChangeHistory = await CoinChangeHistory.findByIdAndRemove(coinChangeHistoryId);

            if (!removedCoinChangeHistory) {
                return res.status(404).json({ error: 'CoinChangeHistory not found' });
            }

            res.status(200).json({ message: 'CoinChangeHistory removed successfully' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while removing the coinChangeHistory' });
        }
    }

}
module.exports = coinChangeHistoryController