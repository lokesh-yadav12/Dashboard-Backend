const Payment = require('../models/Payment');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
exports.getPayments = async (req, res, next) => {
  try {
    const { search, status, sortBy = '-date' } = req.query;

    // Build query
    let query = { userId: req.user.id };

    // Search filter
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { projectName: { $regex: search, $options: 'i' } },
        { invoiceNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query).sort(sortBy).populate('clientId', 'clientName projectName');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('clientId', 'clientName projectName email contact');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.userId = req.user.id;

    const payment = await Payment.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private
exports.updatePayment = async (req, res, next) => {
  try {
    let payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private
exports.deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    await payment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record new installment
// @route   POST /api/payments/:id/installments
// @access  Private
exports.recordInstallment = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if already completed
    if (payment.currentInstallment >= payment.totalInstallments) {
      return res.status(400).json({
        success: false,
        message: 'All installments have been completed'
      });
    }

    // Increment installment
    payment.currentInstallment += 1;
    payment.status = 'paid';
    
    if (req.body.description) {
      payment.description = req.body.description;
    }

    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Installment recorded successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payments for a specific client
// @route   GET /api/payments/client/:clientId
// @access  Private
exports.getClientPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({
      clientId: req.params.clientId,
      userId: req.user.id
    }).sort('-date');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment analytics
// @route   GET /api/payments/analytics
// @access  Private
exports.getPaymentAnalytics = async (req, res, next) => {
  try {
    const { timeRange = 'monthly' } = req.query;

    const payments = await Payment.find({ userId: req.user.id });

    // Calculate totals
    const totalReceived = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    const averagePayment = payments.length > 0 
      ? payments.reduce((sum, p) => sum + p.amount, 0) / payments.length 
      : 0;

    const activeInstallments = payments.filter(
      p => p.currentInstallment < p.totalInstallments
    ).length;

    // Group by month or year
    const groupedData = {};
    
    payments.forEach(payment => {
      const date = new Date(payment.date);
      let key;
      
      if (timeRange === 'yearly') {
        key = date.getFullYear().toString();
      } else {
        key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      }
      
      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      groupedData[key] += payment.amount;
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalReceived,
          totalPending,
          averagePayment: Math.round(averagePayment),
          activeInstallments,
          totalPayments: payments.length
        },
        chartData: Object.entries(groupedData).map(([name, value]) => ({
          name,
          value
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};