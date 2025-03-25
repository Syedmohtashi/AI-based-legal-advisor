const Case = require('../models/case');

// Get All Cases
exports.getAllCases = async (req, res) => {
    try {
        const cases = await Case.find();
        res.json(cases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a New Case
exports.createCase = async (req, res) => {
    try {
        const newCase = new Case({
            title: req.body.title,
            description: req.body.description
        });
        await newCase.save();
        res.status(201).json(newCase);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get a Case by ID
exports.getCaseById = async (req, res) => {
    try {
        const caseData = await Case.findById(req.params.id);
        if (!caseData) return res.status(404).json({ message: "Case not found" });
        res.json(caseData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a Case
exports.updateCase = async (req, res) => {
    try {
        const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCase) return res.status(404).json({ message: "Case not found" });
        res.json(updatedCase);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a Case
exports.deleteCase = async (req, res) => {
    try {
        const deletedCase = await Case.findByIdAndDelete(req.params.id);
        if (!deletedCase) return res.status(404).json({ message: "Case not found" });
        res.json({ message: "Case deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
