const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Please provide employee ID'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Please provide name'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Please provide role'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Please provide department'],
    enum: ['Development', 'Design', 'Management', 'Quality Assurance', 'Marketing', 'Sales'],
    default: 'Development'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  joinDate: {
    type: Date,
    required: [true, 'Please provide join date'],
    default: Date.now
  },
  address: {
    type: String,
    trim: true
  },
  salary: {
    type: Number,
    min: [0, 'Salary cannot be negative']
  },
  projects: {
    type: Number,
    default: 0,
    min: [0, 'Projects cannot be negative']
  },
  skills: [{
    type: String,
    trim: true
  }],
  avatar: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  highestQualification: {
    type: String,
    trim: true
  },
  qualificationDocument: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
teamMemberSchema.index({ name: 'text', email: 'text', role: 'text', employeeId: 'text' });
teamMemberSchema.index({ userId: 1, joinDate: -1 });
teamMemberSchema.index({ employeeId: 1 });

// Generate avatar from name if not provided
teamMemberSchema.pre('save', function(next) {
  if (!this.avatar && this.name) {
    const nameParts = this.name.split(' ');
    this.avatar = nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : this.name.substring(0, 2).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);