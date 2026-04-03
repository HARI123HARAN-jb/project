const express = require('express');
const router = express.Router();
const { addOrderItems, downloadInvoice } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').post(protect, addOrderItems);
router.route('/:id/invoice').get(protect, downloadInvoice);

module.exports = router;
