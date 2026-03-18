const groqService = require('../services/groqService');
const MockInterview = require('../models/MockInterview');

class InterviewController {
    // Generate interview questions based on job role
    async getQuestions(req, res) {
        try {
            const { jobRole } = req.query;
            if (!jobRole) {
                return res.status(400).json({ success: false, error: 'Job role is required' });
            }

            const prompt = `Generate 5 professional interview questions for the role of "${jobRole}". 
            Include a mix of behavioral (STAR method) and technical/situational questions.
            Return ONLY a valid JSON array of strings. 
            Format: ["Question 1", "Question 2", ...]`;

            const response = await groqService.getResponse(prompt);
            
            // Clean the response to ensure it's valid JSON
            const jsonMatch = response.match(/\[.*\]/s);
            const questions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

            res.json({ success: true, questions });
        } catch (error) {
            console.error('Error generating questions:', error);
            res.status(500).json({ success: false, error: 'Failed to generate questions' });
        }
    }

    // Submit interview for AI analysis
    async submitInterview(req, res) {
        try {
            const { jobRole, questions, answers, metadata } = req.body;
            // metadata includes simulated vision data like { posture: 'good', dress: 'formal', confidence: 0.8 }

            if (!questions || !answers || questions.length !== answers.length) {
                return res.status(400).json({ success: false, error: 'Invalid interview data' });
            }

            const interviewData = questions.map((q, i) => `Q: ${q}\nA: ${answers[i]}`).join('\n\n');
            const visionData = `Posture: ${metadata.posture}\nDress/Attire: ${metadata.dress}\nConfidence Level: ${metadata.confidence}`;

            const prompt = `You are a high-speed AI Interview Coach. Analyze accurately but be concise. Role: "${jobRole}".
            
            TRANSCRIPT:
            ${interviewData}

            OBSERVATIONS:
            ${visionData}

            JSON Format (Return ONLY the JSON, NO prose/introductions):
            {
              "overallScores": {
                "answerQuality": 0-100,
                "confidence": 0-100,
                "posture": 0-100,
                "attire": 0-100,
                "overall": 0-100
              },
              "questionFeedback": [
                {"question": "...", "feedback": "Concise feedback on STAR method and content", "score": 0-100},
                ...
              ],
              "generalFeedback": "Brief summary. Mention filler words if confidence < 70. 3 short Pro-tips."
            }`;

            const analysisResponse = await groqService.getResponse(prompt);
            const jsonMatch = analysisResponse.match(/\{.*\}/s);
            if (!jsonMatch) throw new Error('Failed to parse AI analysis');

            const analysis = JSON.parse(jsonMatch[0]);

            // Save to database
            const newInterview = new MockInterview({
                userId: req.userId,
                jobRole,
                questions: analysis.questionFeedback.map((f, i) => ({
                    question: f.question,
                    userAnswer: answers[i],
                    feedback: f.feedback,
                    score: f.score
                })),
                overallScores: analysis.overallScores,
                generalFeedback: analysis.generalFeedback
            });

            await newInterview.save();

            res.json({ success: true, data: newInterview });
        } catch (error) {
            console.error('Error submitting interview:', error);
            res.status(500).json({ success: false, error: 'Failed to analyze interview' });
        }
    }

    // Get user interview history
    async getHistory(req, res) {
        try {
            const history = await MockInterview.find({ userId: req.userId }).sort({ createdAt: -1 });
            res.json({ success: true, history });
        } catch (error) {
            console.error('Error fetching history:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch history' });
        }
    }
}

module.exports = new InterviewController();
