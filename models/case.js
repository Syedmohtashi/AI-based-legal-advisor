const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Closed', 'Pending'], default: 'Open' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Case', caseSchema);
