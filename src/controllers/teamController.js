const TeamMember = require('../models/TeamMember');

// @desc    Get all team members
// @route   GET /api/team
// @access  Private
exports.getTeamMembers = async (req, res, next) => {
  try {
    const { search, status, department, sortBy = '-createdAt' } = req.query;

    // Build query
    let query = { userId: req.user.id };

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Department filter
    if (department) {
      query.department = department;
    }

    const teamMembers = await TeamMember.find(query).sort(sortBy);

    res.status(200).json({
      success: true,
      count: teamMembers.length,
      data: teamMembers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Private
exports.getTeamMember = async (req, res, next) => {
  try {
    const teamMember = await TeamMember.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new team member
// @route   POST /api/team
// @access  Private
exports.createTeamMember = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.userId = req.user.id;

    const teamMember = await TeamMember.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Team member added successfully',
      data: teamMember
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private
exports.updateTeamMember = async (req, res, next) => {
  try {
    let teamMember = await TeamMember.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    teamMember = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: teamMember
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private
exports.deleteTeamMember = async (req, res, next) => {
  try {
    const teamMember = await TeamMember.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    await teamMember.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};