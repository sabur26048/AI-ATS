const pdfParse = require('pdf-parse');
const natural = require('natural');
const prompt = require("./prompt").prompt;
const promptScore = require("./prompt").promptScore;
const dotenv = require("dotenv");
dotenv.config();
require("dotenv").config();
const axios = require("axios");
const { json } = require('express');
var model = null;
function makeTwoDecimal(number) {
    if (number < 100) return number;
    let integerPart = Math.floor(number);
    let decimalPart = number - integerPart;
    let firstTwoDigits = Math.floor(integerPart / 10);
    let result = firstTwoDigits + decimalPart;
    return result;
}
async function computeATSScore(fileBuffer, jobDescription) {
    const data = await pdfParse(fileBuffer);
    const [sug1, sug2, sug3] = await Promise.all([calculateATSScore(data.text, jobDescription),
    computeSimilarity(data.text, jobDescription), semanticMatching(data.text, jobDescription)])
    let score = ((makeTwoDecimal(sug1) * 27) + (makeTwoDecimal(sug2) * 31) + (makeTwoDecimal(sug3) * 30)) / 100;
    score = Math.round(score * 100) / 100;
    return score;
}
function calculateATSScore(resumeText, jobDescription) {
    const resumeTokens = processText(resumeText);
    const jobTokens = processText(jobDescription);
    let matchCount = 0;
    jobTokens.forEach(keyword => {
        if (resumeTokens.includes(keyword)) {
            matchCount++;
        }
    });
    const score = (matchCount / jobTokens.length) * 100;
    return score;
}
function processText(text) {
    const tokenizer = new natural.WordTokenizer();
    const stemmer = natural.PorterStemmer;
    const tokens = tokenizer.tokenize(text.toLowerCase());
    const stemmedTokens = tokens.map(token => stemmer.stem(token));

    return stemmedTokens;
}
async function computeSimilarity(resumeText, jobDescription) {
    const tfidf = new natural.TfIdf();
    tfidf.addDocument(resumeText);
    tfidf.addDocument(jobDescription);
    let score = 0;
    tfidf.listTerms(0).forEach(term => {
        if (tfidf.idf(term.term) >= 1) {
            score += tfidf.idf(term.term);
        }
    });
    return parseInt(score.toString().slice(0, 2));
}
async function semanticMatching(resumeText, jobDescription) {
    if (!model) {
        const { pipeline } = await import("@xenova/transformers");
        model = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }
    let resumeEmbedding = await model(resumeText);
    let jdEmbedding = await model(jobDescription);
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    for (let i = 0; i < resumeEmbedding.data.length; i++) {
        resumeValue = Number(resumeEmbedding.data[i]);
        jdValue = Number(jdEmbedding.data[i]);
        if (isNaN(resumeValue) || isNaN(jdValue))
            continue;
        if (resumeValue === 0 || jdValue === 0)
            continue;
        dotProduct += resumeValue * jdValue;
        normA += resumeValue * resumeValue;
        normB += jdValue * jdValue;
    }
    let similarityScore = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    const atsPercentage = ((similarityScore + 1) / 2) * 100
    return atsPercentage;
}
async function generateSuggestions(fileBuffer, jobDescription, score) {
    try {
        const data = await pdfParse(fileBuffer);
        const API_KEY = process.env.API_KEY;
        const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        const requestData = {
            contents: [{ parts: [{ text: `${prompt(data.text, jobDescription)}` }] }]
        };
        const requestScore = {
            contents: [{ parts: [{ text: `${promptScore(data.text, jobDescription)}` }] }]
        };
        const headers = {
            "Content-Type": "application/json"
        };
        const response = await Promise.all([axios.post(URL, requestData, { headers }), axios.post(URL, requestScore, { headers })]);
        return { a: response[0].data.candidates[0].content.parts[0].text, b: response[1].data.candidates[0].content.parts[0].text };
    } catch (error) {
        console.error("❌ Error:", error.response ? error.response.data : error.message);
    }
}
function mergeATSFeedback(objA, objB) {
    const mergedObject = {
        missing_keywords: [...objA.missing_keywords, ...objB.missing_keywords],
        experience_gaps: [...objA.experience_gaps, ...objB.experience_gaps],
        technical_skills_suggestions: {
            missing_skills: [...objA.technical_skills_suggestions?.missing_skills, ...objB.technical_skills_suggestions?.missing_skills],
            enhancements: [...objA.technical_skills_suggestions?.enhancements, ...objB.technical_skills_suggestions?.enhancements, "skill"],
        },
        projects_recommendations: [...objA.projects_recommendations, ...objB.projects_recommendations],
        achievements_suggestions: [...objA.achievements_suggestions, ...objB.achievements_suggestions],
    };
    return mergedObject;
}

module.exports = { computeATSScore, generateSuggestions, processText, calculateATSScore, makeTwoDecimal, mergeATSFeedback };
