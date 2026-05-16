const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const CodingLab = require('../models/CodingLab');
const axios = require('axios');

// Judge0 API configuration (Free tier via RapidAPI or public instance)
// Using public CE instance for development
const JUDGE0_URL = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_KEY = process.env.JUDGE0_KEY;

// @desc    Get coding labs for a module
// @route   GET /api/modules/:moduleId/labs
// @access  Public (Enrolled checked at route level)
const getLabs = asyncHandler(async (req, res) => {
  // We exclude solutionCode and hidden test cases for students
  const labs = await CodingLab.find({ module: req.params.moduleId });
  
  const sanitizedLabs = labs.map(lab => {
    const labObj = lab.toObject();
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'instructor')) {
      delete labObj.solutionCode;
      labObj.testCases = labObj.testCases.filter(tc => !tc.isHidden);
    }
    return labObj;
  });

  return res.status(200).json(new ApiResponse(200, 'Labs fetched successfully', sanitizedLabs));
});

// @desc    Create a coding lab
// @route   POST /api/modules/:moduleId/labs
// @access  Admin/Instructor
const createLab = asyncHandler(async (req, res) => {
  const lab = await CodingLab.create({
    ...req.body,
    module: req.params.moduleId
  });
  return res.status(201).json(new ApiResponse(201, 'Lab created', lab));
});

// @desc    Execute code against lab test cases
// @route   POST /api/labs/:id/execute
// @access  Enrolled Student
const executeCode = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) throw new ApiError(400, 'Code is required');

  const lab = await CodingLab.findById(req.params.id);
  if (!lab) throw new ApiError(404, 'Lab not found');

  if (!JUDGE0_KEY) {
    // Development fallback if no API key is provided
    return res.status(200).json(new ApiResponse(200, 'Execution simulated (No Judge0 Key)', {
      passed: true,
      results: lab.testCases.map(tc => ({
        input: tc.input,
        expected: tc.expectedOutput,
        actual: tc.expectedOutput, // simulated success
        passed: true
      }))
    }));
  }

  const results = [];
  let allPassed = true;

  // Run each test case through Judge0
  for (const tc of lab.testCases) {
    try {
      const response = await axios.post(`${JUDGE0_URL}/submissions`, {
        source_code: code,
        language_id: lab.languageId,
        stdin: tc.input,
        expected_output: tc.expectedOutput
      }, {
        headers: {
          'X-RapidAPI-Key': JUDGE0_KEY,
          'Content-Type': 'application/json'
        },
        params: { wait: 'true' } // Wait for execution to finish
      });

      const { stdout, status, compile_output, stderr } = response.data;
      
      const actualOutput = (stdout || '').trim();
      const expectedOut = tc.expectedOutput.trim();
      const passed = status.id === 3; // 3 means "Accepted"

      if (!passed) allPassed = false;

      results.push({
        input: tc.input,
        expected: expectedOut,
        actual: actualOutput,
        error: stderr || compile_output,
        passed,
        isHidden: tc.isHidden
      });
    } catch (error) {
      console.error('Judge0 Execution Error:', error.response?.data || error.message);
      throw new ApiError(500, 'Failed to execute code on remote server');
    }
  }

  return res.status(200).json(new ApiResponse(200, 'Execution complete', {
    passed: allPassed,
    results: results.map(r => r.isHidden ? { passed: r.passed, isHidden: true } : r)
  }));
});

module.exports = {
  getLabs,
  createLab,
  executeCode
};