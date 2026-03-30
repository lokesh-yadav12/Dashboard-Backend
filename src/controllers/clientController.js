const Client = require('../models/Client');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
exports.getClients = async (req, res, next) => {
  try {
    const { search, status, sortBy = '-createdAt' } = req.query;

    // Build query
    let query = { userId: req.user.id };

    // Search filter
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { projectName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    const clients = await Client.find(query).sort(sortBy);

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
exports.getClient = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
exports.createClient = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.userId = req.user.id;

    const client = await Client.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
exports.updateClient = async (req, res, next) => {
  try {
    let client = await Client.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: client
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
exports.deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    await client.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get clients by date range
// @route   GET /api/clients/filter
// @access  Private
exports.getClientsByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let query = { userId: req.user.id };

    if (startDate && endDate) {
      query.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const clients = await Client.find(query).sort('-startDate');

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    next(error);
  }
};