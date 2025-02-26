var express = require('express');
var router = express.Router();
var path = require('path');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { computeATSScore, generateSuggestions, makeTwoDecimal, mergeATSFeedback } = require('../../helper/helper');

router.get('/', function (req, res, next) {
  const buildPath = path.join(__dirname, "../..", "helper", "build", "index.html");
  res.sendFile(buildPath);
});
router.post('/getAtsScore', upload.single('resume'), async (req, res) => {
  if (!req.resume || !req.body.jobDescription)
    return res.status(400).json({ error: 'Resume file and job description are required.' });
  try {
    if (req.file.mimetype !== 'application/pdf')
      return res.status(400).json({ error: 'Resume should be in pdf' });
    const jobDescription = req.body.jobDescription;
    const score = await computeATSScore(req.file.buffer, jobDescription)
    let scoreRound = Math.round(score);
    const data = {
      title: "ATS Resume Score",
      score: `${scoreRound}/100`
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing resume' });
  }
});
router.post('/suggestion/:score', upload.single('resume'), async (req, res) => {
  if (!req.resume || !req.body.jobDescription)
    return res.status(400).json({ error: 'Resume file and job description are required.' });
  try {
    if (req.file.mimetype !== 'application/pdf')
      return res.status(400).json({ error: 'Resume should be in pdf' });
    const jobDescription = req.body.jobDescription;
    let score = req.params.score;
    let suggestions = await generateSuggestions(req.file.buffer, jobDescription, score);
    let jsonStringA = suggestions.a.replace(/^#+\s*/gm, '')
      .replace(/```json\n|\n```/g, '')
      .trim();;
    let jsonStringB = suggestions.b.replace(/^#+\s*/gm, '')
      .replace(/```json\n|\n```/g, '')
      .trim();
    jsonStringA = JSON.parse(jsonStringA);
    jsonStringB = JSON.parse(jsonStringB);
    let Gscore = Number(jsonStringB.ATS_score);
    Gscore = (makeTwoDecimal(Gscore) * 0.25) + (score * 0.75);
    Gscore = Math.round(score);
    let sug = mergeATSFeedback(jsonStringA, jsonStringB);
    const data = {
      title: "ATS Resume Score",
      score: `${Gscore}/100`,
      improvementSuggestions: sug
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing resume' });
  }
});


module.exports = router;
