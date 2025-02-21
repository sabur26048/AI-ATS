var express = require('express');
var router = express.Router();
const React = require("react");
var path = require('path');
const ReactDOMServer = require("react-dom/server");
const multer = require('multer');
const mammoth = require('mammoth');
const { OpenAI } = require('openai');
const upload = multer({ storage: multer.memoryStorage() });
const { extractResumeText, computeATSScore, generateSuggestions } = require('../../helper/helper');

router.get('/', function (req, res, next) {
  const dirname = path.join(__dirname, "..");
  res.sendFile(path.join("build", "index.html"));
});
router.post('/upload', upload.single('resume'), async (req, res) => {
  if (!req.resume || !req.body.jobDescription)
    return res.status(400).json({ error: 'Resume file and job description are required.' });
  try {
    const resumeText = await extractResumeText(req.file);
    const jobDescription = req.body.jobDescription;
    const score = computeATSScore(resumeText, jobDescription);
    const suggestions = generateSuggestions(resumeText, jobDescription);
    const data = {
      title: "ATS Resume Score",
      score: `${score}/100`,
      improvementSuggestions: suggestions || []
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing resume' });
  }
});


module.exports = router;
