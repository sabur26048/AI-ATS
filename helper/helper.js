const pdfParse = require('pdf-parse');
const natural = require('natural');
const React = require("react");
const TfIdf = natural.TfIdf;


async function extractResumeText(file) {
    let filee = file;
    let p = file;
    if (file.mimetype === 'application/pdf') {
        const data = await pdfParse(file.buffer);
        return data.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const { value } = await mammoth.extractRawText({ buffer: file.buffer });
        return value;
    }
    return '';
}

function computeATSScore(resumeText, jobDescription) {
    const tfidf = new TfIdf();
    tfidf.addDocument(resumeText);
    tfidf.addDocument(jobDescription);

    let score = 0;
    tfidf.listTerms(1).forEach(term => {
        score += term.tfidf;
    });

    return Math.min(Math.round(score * 10), 100);
}

function generateSuggestions(resumeText, jobDescription) {
    let suggestions = [];
    const tokenizer = new natural.WordTokenizer();
    const resumeWords = new Set(tokenizer.tokenize(resumeText.toLowerCase()));
    const jobWords = new Set(tokenizer.tokenize(jobDescription.toLowerCase()));
    let missingKeywords = [...jobWords].filter(word => !resumeWords.has(word));
    if (missingKeywords.length > 0) {
        suggestions.push(`Consider including these job-related keywords: ${missingKeywords.slice(0, 5).join(', ')}.`);
    }
    if (!resumeText.includes("Experience") || !resumeText.includes("Skills")) {
        suggestions.push("Ensure your resume has clear sections: Experience, Skills, Education.");
    }
    const actionWords = ["developed", "managed", "led", "designed", "implemented"];
    let hasActionWords = actionWords.some(word => resumeWords.has(word));
    if (!hasActionWords) {
        suggestions.push("Use strong action verbs like 'developed', 'managed', 'implemented' to describe your experience.");
    }
    return suggestions.length > 0 ? suggestions : ["Your resume is well-optimized!"];
}

module.exports = { extractResumeText, computeATSScore, generateSuggestions };
