const Setting = require('../models/Setting');

// @desc    Get website settings (Public)
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    // If no settings exist yet, create a default one
    if (!settings) {
      settings = await Setting.create({});
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update website settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    const { offerTitle, offerDescription, offerCode, offerEndDate, isActive } = req.body;

    let settings = await Setting.findOne();

    if (!settings) {
      settings = new Setting();
    }

    if (offerTitle !== undefined) settings.offerTitle = offerTitle;
    if (offerDescription !== undefined) settings.offerDescription = offerDescription;
    if (offerCode !== undefined) settings.offerCode = offerCode;
    if (offerEndDate !== undefined) settings.offerEndDate = offerEndDate;
    if (isActive !== undefined) settings.isActive = isActive;

    const updatedSettings = await settings.save();
    
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
