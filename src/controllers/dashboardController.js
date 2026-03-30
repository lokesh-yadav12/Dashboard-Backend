const Client = require('../models/Client');
const Payment = require('../models/Payment');
const TeamMember = require('../models/TeamMember');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res, next) => {
  try {
    const { timeFilter = 'monthly' } = req.query;

    // Get counts
    const totalClients = await Client.countDocuments({ userId: req.user.id });
    const activeProjects = await Client.countDocuments({
      userId: req.user.id,
      status: { $in: ['live', 'development'] }
    });
    const teamMembers = await TeamMember.countDocuments({ userId: req.user.id });

    // Calculate revenue
    const payments = await Payment.find({ userId: req.user.id, status: 'paid' });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // Calculate growth percentages (mock data for now)
    const stats = {
      totalClients: {
        value: totalClients,
        change: '+12%'
      },
      activeProjects: {
        value: activeProjects,
        change: '+8%'
      },
      revenue: {
        value: totalRevenue,
        formatted: `$${(totalRevenue / 1000).toFixed(1)}K`,
        change: '+15%'
      },
      teamMembers: {
        value: teamMembers,
        change: timeFilter === 'yearly' ? '+15%' : '+2%'
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get client acquisition data
// @route   GET /api/dashboard/clients
// @access  Private
exports.getClientData = async (req, res, next) => {
  try {
    const { timeFilter = 'monthly' } = req.query;

    const clients = await Client.find({ userId: req.user.id });

    // Group by month or year
    const groupedData = {};
    
    clients.forEach(client => {
      const date = new Date(client.startDate);
      let key;
      
      if (timeFilter === 'yearly') {
        key = date.getFullYear().toString();
      } else {
        key = date.toLocaleString('default', { month: 'short' });
      }
      
      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      groupedData[key]++;
    });

    const chartData = Object.entries(groupedData).map(([name, clients]) => ({
      name,
      clients
    }));

    res.status(200).json({
      success: true,
      data: chartData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project completion data
// @route   GET /api/dashboard/projects
// @access  Private
exports.getProjectData = async (req, res, next) => {
  try {
    const { timeFilter = 'monthly' } = req.query;

    const completedProjects = await Client.find({
      userId: req.user.id,
      status: 'completed'
    });

    // Group by month or year
    const groupedData = {};
    
    completedProjects.forEach(project => {
      const date = new Date(project.updatedAt);
      let key;
      
      if (timeFilter === 'yearly') {
        key = date.getFullYear().toString();
      } else {
        key = date.toLocaleString('default', { month: 'short' });
      }
      
      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      groupedData[key]++;
    });

    const chartData = Object.entries(groupedData).map(([name, completed]) => ({
      name,
      completed
    }));

    res.status(200).json({
      success: true,
      data: chartData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project status distribution
// @route   GET /api/dashboard/project-status
// @access  Private
exports.getProjectStatus = async (req, res, next) => {
  try {
    const clients = await Client.find({ userId: req.user.id });

    const statusCounts = {
      live: 0,
      development: 0,
      completed: 0
    };

    clients.forEach(client => {
      if (statusCounts.hasOwnProperty(client.status)) {
        statusCounts[client.status]++;
      }
    });

    const chartData = [
      { name: 'Live Projects', value: statusCounts.live, color: '#10B981' },
      { name: 'In Development', value: statusCounts.development, color: '#3B82F6' },
      { name: 'Completed', value: statusCounts.completed, color: '#6B7280' }
    ];

    res.status(200).json({
      success: true,
      data: chartData
    });
  } catch (error) {
    next(error);
  }
};