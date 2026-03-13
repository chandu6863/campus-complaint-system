const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  getStats
} = require('../controllers/complaintController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.get('/stats', getStats);
router.get('/', getComplaints);
router.post('/', upload.single('image'), createComplaint);
router.get('/:id', getComplaintById);
router.put('/:id/status', adminOnly, updateComplaintStatus);
router.delete('/:id', deleteComplaint);

module.exports = router;