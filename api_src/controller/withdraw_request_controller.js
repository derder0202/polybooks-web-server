const {User, WithdrawRequest} = require("../model/model");
 const withdrawRequestController = {
  createWithdrawRequest: async (req, res) => {
    try {
      const withdrawRequest = new WithdrawRequest(req.body);
      await User.findByIdAndUpdate(withdrawRequest.userId,{$push: {withdrawRequests: withdrawRequest._id}})
      const savedWithdrawRequest = await withdrawRequest.save();
      res.status(200).json(savedWithdrawRequest);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create withdraw request' });
    }
  },
  // Get all withdraw requests
  getAllWithdrawRequests: async (req, res) => {
    try {
      const withdrawRequests = await WithdrawRequest.find();
      res.status(200).json(withdrawRequests);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve withdraw requests' });
    }
  },
  // Get a specific withdraw request by ID
  getWithdrawRequestById: async (req, res) => {
    try {
      const withdrawRequestId = req.params.id;
      const withdrawRequest = await WithdrawRequest.findById(withdrawRequestId).populate('userId','name');
      if (!withdrawRequest) {
        return res.status(404).json({ error: 'Withdraw request not found' });
      }
      res.status(200).json(withdrawRequest);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve withdraw request' });
    }
  },
  updateWithdrawRequestStatus: async (req, res) => {
    try {
      const withdrawRequestId = req.params.id;
      const { status } = req.body;
      const updatedWithdrawRequest = await WithdrawRequest.findByIdAndUpdate(
        withdrawRequestId,
        { status },
        { new: true }
      );
      if (!updatedWithdrawRequest) {
        return res.status(404).json({ error: 'Withdraw request not found' });
      }
      res.status(200).json(updatedWithdrawRequest);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update withdraw request status' });
    }
  },
  deleteWithdrawRequest: async (req, res) => {
    try {
      const withdrawRequestId = req.params.id;
      const deletedWithdrawRequest = await WithdrawRequest.findByIdAndDelete(withdrawRequestId);
      if (!deletedWithdrawRequest) {
        return res.status(404).json({ error: 'Withdraw request not found' });
      }
      await User.findByIdAndUpdate(deletedWithdrawRequest.userId,{$pull: {withdrawRequests: deletedWithdrawRequest._id}})
      res.status(200).json({ message: 'Withdraw request deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete withdraw request' });
    }
  }
};
 module.exports = withdrawRequestController;