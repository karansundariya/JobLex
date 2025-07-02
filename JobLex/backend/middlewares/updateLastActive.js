const { User } = require('../models/user.model.js');

const updateLastActive = async (req, res, next) => {
  if (req.id) {
    try {
      await User.findByIdAndUpdate(req.id, { lastActive: new Date() });
    } catch (e) {
      // Ignore errors, don't block request
    }
  }
  next();
};

module.exports = updateLastActive; 