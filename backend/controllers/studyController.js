const studyData = require('../data/studyData');

class StudyController {
    async getStudyMaterials(req, res) {
        try {
            const { category } = req.params;
            const materials = studyData.getMaterialsByCategory(category);
            res.json(materials);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAptitudeQuestions(req, res) {
        try {
            const { topic, difficulty } = req.query;
            const questions = studyData.getAptitudeQuestions(topic, difficulty);
            res.json(questions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getMockTests(req, res) {
        try {
            const tests = studyData.getMockTests();
            res.json(tests);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCompanyData(req, res) {
        try {
            const { company } = req.params;
            const data = studyData.getCompanyRecruitmentData(company);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new StudyController();