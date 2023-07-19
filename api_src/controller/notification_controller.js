const {Notification, User} = require("../model/model")
const notificationController = {
    create: async (req, res) => {
        try {
            const notification = await Notification.create(req.body)
            await User.findByIdAndUpdate(
                notification.user,
                { $push: { notifications: notification._id } },
                { new: true }
            )
            return res.status(200).json(notification);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Server error');
        }
    },
    getAll: async (req, res) => {
        try {
            const notifications = await Notification.find();
            return res.status(200).json(notifications);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Server error');
        }
    },
    markAsRead: async (req, res) => {
        try {
            const { id } = req.params;
            const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
            return res.status(200).json(notification);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Server error');
        }
    }
};
module.exports = notificationController;