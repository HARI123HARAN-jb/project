const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    offerTitle: {
      type: String,
      default: 'Diwali Sale'
    },
    offerDescription: {
      type: String,
      default: 'Up to 30% Off Industrial Machinery'
    },
    offerCode: {
      type: String,
      default: 'DIWALI20'
    },
    offerEndDate: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // Default 24 hrs from now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

// We ideally only want ONE settings document. 
// We will retrieve the first one or create it if not found.
const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;
