const Complaint = require('../models/Complaint');

const createComplaint = async (req, res) => {
  try {
    const { title, description, location, category, priority } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ message: 'Title, description, and location are required' });
    }

    const complaintData = {
      title, description, location,
      category: category || 'other',
      priority: priority || 'medium',
      createdBy: req.user._id,
      statusHistory: [{
        status: 'pending',
        changedBy: req.user._id,
        note: 'Complaint submitted'
      }]
    };

    if (req.file) {
      complaintData.image = `/uploads/${req.file.filename}`;
    }

    const complaint = await Complaint.create(complaintData);
    await complaint.populate('createdBy', 'name email role');

    res.status(201).json({ message: 'Complaint submitted successfully', complaint });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Failed to create complaint', error: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (req.user.role === 'student') {
      filter.createdBy = req.user._id;
    }

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate('createdBy', 'name email studentId department')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Complaint.countDocuments(filter)
    ]);

    res.json({
      complaints,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: error.message });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('createdBy', 'name email studentId department')
      .populate('assignedTo', 'name email')
      .populate('statusHistory.changedBy', 'name role');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (req.user.role === 'student' && complaint.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ complaint });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaint', error: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminNote, assignedTo } = req.body;

    const validStatuses = ['pending', 'in-progress', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    if (adminNote) complaint.adminNote = adminNote;
    if (assignedTo) complaint.assignedTo = assignedTo;
    if (status === 'resolved') complaint.resolvedAt = new Date();

    complaint.statusHistory.push({
      status,
      changedBy: req.user._id,
      note: adminNote || `Status changed to ${status}`
    });

    await complaint.save();
    await complaint.populate('createdBy', 'name email studentId');
    await complaint.populate('assignedTo', 'name email');

    res.json({ message: 'Status updated successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (req.user.role === 'student') {
      if (complaint.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      if (complaint.status !== 'pending') {
        return res.status(400).json({ message: 'Cannot delete a complaint that is already in progress' });
      }
    }

    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete complaint', error: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    let matchFilter = {};
    if (req.user.role === 'student') {
      matchFilter.createdBy = req.user._id;
    }

    const stats = await Complaint.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const result = { pending: 0, 'in-progress': 0, resolved: 0, rejected: 0, total: 0 };
    stats.forEach(s => {
      result[s._id] = s.count;
      result.total += s.count;
    });

    res.json({ stats: result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  getStats
};