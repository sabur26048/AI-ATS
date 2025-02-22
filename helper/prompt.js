const prompt = (text, desc) => `
Analyze the following resume against the job description and provide **structured improvement suggestions**:

### **Resume Text:**
"""
${text}
"""

### **Job Description:**
"""
${desc}
"""

### **Expected JSON Output Format:**
{
  "missing_keywords": [give those key are missing],
  "experience_gaps": [
    {
      "suggestion": "Add more details about backend system design experience.",
      "reason": "Job description requires knowledge in distributed systems."
    }
  ],
  "technical_skills_suggestions": {
    "missing_skills": ["GraphQL", "Terraform"],
    "enhancements": [
      {
        "skill": "CI/CD",
        "suggestion": "Include experience with Jenkins or GitHub Actions."
      }
    ]
  },
  "projects_recommendations": [
    {
      "suggestion": "Add a project demonstrating microservices architecture.",
      "reason": "The job requires experience in designing scalable systems."
    }
  ],
  "achievements_suggestions": [
    {
      "suggestion": "Include open-source contributions or certifications.",
      "reason": "Helps demonstrate expertise beyond work experience."
    }
  ]
}

### **Guidelines:**
1. Identify **missing skills, keywords, and experience gaps** based on the job description.
2. Suggest **specific improvements** (skills, projects, achievements) **with reasons**.
3. Return **only JSON output**, without explanations or additional text.
`;
const promptScore = (resumeText,jobDescription) => `
Analyze the following resume and job description and return a JSON object.

Resume:
"""${resumeText}"""

Job Description:
"""${jobDescription}"""

Return a JSON response in the following format:
\`\`\`json
{
  "ATS_score": 70,
  "missing_keywords": [give those key are missing],
  "experience_gaps": [
    {
      "suggestion": "Add more details about backend system design experience.",
      "reason": "Job description requires knowledge in distributed systems."
    }
  ],
  "technical_skills_suggestions": {
    "missing_skills": ["GraphQL", "Terraform"],
    "enhancements": [
      {
        "skill": "CI/CD",
        "suggestion": "Include experience with Jenkins or GitHub Actions."
      }
    ]
  },
  "projects_recommendations": [
    {
      "suggestion": "Add a project demonstrating microservices architecture.",
      "reason": "The job requires experience in designing scalable systems."
    }
  ],
  "achievements_suggestions": [
    {
      "suggestion": "Include open-source contributions or certifications.",
      "reason": "Helps demonstrate expertise beyond work experience."
    }
  ]
}
\`\`\`
Only return valid JSON, no extra text.
`;

module.exports = { prompt, promptScore };
