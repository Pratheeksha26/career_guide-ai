const careerDatabase = {
    streams: {
        science: {
            name: 'Science Stream',
            careers: ['Engineer', 'Doctor', 'Scientist', 'Researcher', 'Data Scientist', 'Biotechnologist'],
            topColleges: ['IITs', 'NITs', 'AIIMS', 'BITS Pilani', 'IISc'],
            exams: ['JEE Main', 'JEE Advanced', 'NEET', 'AIIMS', 'BITSAT'],
            skills: ['Analytical thinking', 'Problem-solving', 'Research skills', 'Mathematics', 'Scientific method']
        },
        commerce: {
            name: 'Commerce Stream',
            careers: ['CA', 'CS', 'Accountant', 'Banker', 'Financial Analyst', 'MBA'],
            topColleges: ['SRCC', 'Loyola', 'Christ University', 'NMIMS', 'Symbiosis'],
            exams: ['CA Foundation', 'CAT', 'MAT', 'XAT', 'CMA'],
            skills: ['Numerical ability', 'Accounting', 'Financial analysis', 'Business acumen', 'Communication']
        },
        arts: {
            name: 'Arts Stream',
            careers: ['Lawyer', 'Journalist', 'Psychologist', 'Teacher', 'Civil Services', 'Writer'],
            topColleges: ['Lady Shri Ram', 'St. Stephen\'s', 'JNU', 'DU Colleges', 'BHU'],
            exams: ['CLAT', 'UPSC', 'NET', 'SET', 'CUET'],
            skills: ['Communication', 'Critical thinking', 'Creativity', 'Research', 'Writing']
        }
    },
    
    companies: {
        tcs: {
            name: 'Tata Consultancy Services',
            process: ['Aptitude Test', 'Technical Interview', 'HR Interview', 'Managerial Round'],
            skills: ['Programming', 'Problem-solving', 'Communication', 'Teamwork'],
            salary: { fresher: '₹3.5-7 LPA', experienced: '₹8-20 LPA' },
            locations: ['Pan India', 'International'],
            eligibility: '60% throughout academics, no active backlogs'
        },
        google: {
            name: 'Google',
            process: ['Online Assessment', 'Phone Screen', 'Technical Interviews (4-5)', 'Googleyness', 'Hiring Committee'],
            skills: ['Algorithms', 'Data Structures', 'System Design', 'Leadership'],
            salary: { fresher: '₹15-30 LPA', experienced: '₹30-100+ LPA' },
            locations: ['Bangalore', 'Hyderabad', 'Gurgaon'],
            eligibility: 'Strong CS fundamentals, problem-solving ability'
        },
        infosys: {
            name: 'Infosys',
            process: ['Aptitude Test', 'Technical Interview', 'HR Discussion'],
            skills: ['Logical Reasoning', 'Basic Programming', 'Communication'],
            salary: { fresher: '₹3.5-5 LPA', experienced: '₹6-15 LPA' },
            locations: ['Pan India'],
            eligibility: '60% in 10th, 12th, and graduation'
        }
    },
    
    exams: {
        jee: {
            name: 'JEE Main & Advanced',
            pattern: 'Physics, Chemistry, Mathematics - Objective Type',
            preparation: '2 years systematic study, NCERT + advanced books',
            resources: ['HC Verma', 'RD Sharma', 'NCERT', 'Previous Papers'],
            colleges: ['All IITs', 'NITs', 'IIITs', 'GFTIs'],
            cutoff: 'Top 2-3% for IITs'
        },
        cat: {
            name: 'Common Admission Test',
            pattern: 'Quantitative Aptitude, Verbal Ability, Data Interpretation, Logical Reasoning',
            preparation: '6-12 months focused preparation',
            resources: ['Arun Sharma', 'TIME', 'IMS', 'Mock Tests'],
            colleges: ['All IIMs', 'FMS', 'SP Jain', 'MDI'],
            cutoff: '98+ percentile for top IIMs'
        },
        neet: {
            name: 'NEET UG',
            pattern: 'Physics, Chemistry, Biology - 180 questions',
            preparation: 'Strong NCERT foundation + practice',
            resources: ['NCERT', 'MTG', 'Arihant', 'Previous Papers'],
            colleges: ['All Medical Colleges in India'],
            cutoff: '600+ for top colleges'
        }
    },
    
    // NEW: Specific career paths
    careers: {
        'data scientist': {
            name: 'Data Scientist',
            stream: 'science',
            education: ['B.Tech/B.E in CS/IT', 'M.Tech/MS in Data Science', 'PhD (optional)'],
            skills: ['Python/R Programming', 'Statistics & Probability', 'Machine Learning', 'SQL', 'Data Visualization'],
            salary: { fresher: '₹6-12 LPA', experienced: '₹15-40 LPA', senior: '₹40-100+ LPA' },
            companies: ['Google', 'Amazon', 'Microsoft', 'Flipkart', 'Startups'],
            certifications: ['Google Data Analytics', 'AWS Certified Data Analytics', 'IBM Data Science']
        },
        'software engineer': {
            name: 'Software Engineer',
            stream: 'science',
            education: ['B.Tech/B.E in CS/IT', 'MCA', 'M.Tech'],
            skills: ['Programming (Java/Python)', 'Data Structures', 'Algorithms', 'System Design', 'Databases'],
            salary: { fresher: '₹4-10 LPA', experienced: '₹10-30 LPA', senior: '₹30-80+ LPA' },
            companies: ['All IT Companies', 'Product-based', 'Service-based', 'Startups']
        },
        'chartered accountant': {
            name: 'Chartered Accountant (CA)',
            stream: 'commerce',
            education: ['CA Foundation', 'CA Intermediate', 'CA Final'],
            skills: ['Accounting', 'Taxation', 'Auditing', 'Financial Management', 'Corporate Law'],
            salary: { fresher: '₹6-12 LPA', experienced: '₹15-40 LPA', senior: '₹40-100+ LPA' },
            companies: ['Big 4 (Deloitte, PwC, etc.)', 'Banks', 'Corporate Houses']
        }
    },
    
    // NEW: Skills database
    skills: {
        'data science': {
            technical: ['Python Programming', 'R Programming', 'SQL', 'Statistics', 'Machine Learning', 'Data Visualization'],
            tools: ['Jupyter Notebook', 'TensorFlow', 'PyTorch', 'Tableau', 'Power BI'],
            soft: ['Analytical Thinking', 'Problem Solving', 'Communication', 'Business Acumen'],
            learningPath: [
                'Learn Python basics',
                'Study Statistics & Probability',
                'Learn SQL for data querying',
                'Master data visualization tools',
                'Practice Machine Learning algorithms',
                'Build portfolio projects'
            ]
        },
        'web development': {
            technical: ['HTML/CSS', 'JavaScript', 'React/Angular/Vue', 'Node.js', 'Databases'],
            tools: ['VS Code', 'Git', 'Chrome DevTools', 'Postman'],
            soft: ['Attention to Detail', 'Creativity', 'Team Collaboration'],
            learningPath: [
                'Learn HTML/CSS fundamentals',
                'Master JavaScript',
                'Choose a framework (React recommended)',
                'Learn backend with Node.js',
                'Learn databases (SQL & NoSQL)',
                'Build full-stack projects'
            ]
        }
    }
};
class CareerDataService {
    getCareerData(query) {
        const lowerQuery = query.toLowerCase().trim();
        console.log('🔍 Query received:', lowerQuery);

        // check for stream
        for (const [key, data] of Object.entries(careerDatabase.streams)) {
            if (lowerQuery.includes(key) || (lowerQuery.includes('stream') && lowerQuery.includes(key))) {
                return {
                    response: `### 🎓 **${data.name} Analysis**\n\n${data.name} offers a wide range of opportunities in ${data.careers.slice(0, 3).join(', ')}, and more.\n\n**Key Career Paths:**\n${data.careers.map(c => `• **${c}**: requires strong foundation in ${data.skills.slice(0, 2).join(' and ')}`).join('\n')}\n\n**Strategic Preparation:**\n- **Entrance Exams:** ${data.exams.join(', ')}\n- **Top Institutes:** ${data.topColleges.join(', ')}\n\n**Essential Skillset:**\n${data.skills.map(s => `• ${s}`).join('\n')}\n\n**Pro-Tip:** Focus on building a strong conceptual foundation in the early years. Participating in Olympiads and workshops can give you a competitive edge.`,
                    sources: ['Academic Career Framework 2024'],
                    suggestions: [`Best colleges for ${data.name}`, `Preparation strategy for ${data.exams[0]}`]
                };
            }
        }

        // check for company
        for (const [key, data] of Object.entries(careerDatabase.companies)) {
            if (lowerQuery.includes(key)) {
                return {
                    response: `### 🏢 **${data.name} Recruitment Insights**\n\n${data.name} is a top employer looking for candidates with strong ${data.skills[0]} and ${data.skills[1]} skills.\n\n**Hiring Pipeline:**\n${data.process.map((p, i) => `${i + 1}. **${p}**: Focuses on evaluating your ${i === 0 ? 'logic' : 'core competency'}`).join('\n')}\n\n**Expectations:**\n- **Freshers:** ${data.salary.fresher}\n- **Experienced:** ${data.salary.experienced}\n- **Requirement:** ${data.eligibility}\n\n**Key Skills Needed:** ${data.skills.join(', ')}\n\n**Office Locations:** ${data.locations.join(', ')}\n\n**Preparation Tip:** Research the company's recent projects and values. For technical rounds, focus heavily on ${data.skills[0]}.`,
                    sources: ['Industry Recruitment Trends 2024'],
                    suggestions: [`Interview questions for ${data.name}`, `Technical preparation roadmaps`]
                };
            }
        }

        // check for exam
        for (const [key, data] of Object.entries(careerDatabase.exams)) {
            if (lowerQuery.includes(key)) {
                return {
                    response: `### 📚 **Exhaustive Guide: ${data.name}**\n\n**Exam Blueprint:** ${data.pattern}\n\n**Preparation Strategy:**\n${data.preparation}. A consistent 10-12 hour study schedule is often recommended for top percentiles.\n\n**High-Impact Resources:**\n${data.resources.map(r => `• **${r}**: Essential for deep conceptual clarity`).join('\n')}\n\n**Top Target Colleges:** ${data.colleges.join(', ')}\n\n**Success Criteria:** ${data.cutoff}\n\n**Expert Advice:** Don't just solve problems; understand the 'why' behind each concept. Regular mock tests are non-negotiable for speed and accuracy.`,
                    sources: ['National Examination Standards'],
                    suggestions: [`Study plan for ${data.name}`, `Previous year toppers' tips`]
                };
            }
        }

        // check for specific career
        for (const [key, data] of Object.entries(careerDatabase.careers)) {
            if (lowerQuery.includes(key)) {
                return {
                    response: `### 🎯 **Career Deep Dive: ${data.name}**\n\nBecoming a ${data.name} is an excellent choice for those interested in ${data.skills[0]}.\n\n**Academic Roadmap:**\n${data.education.map(e => `• ${e}`).join('\n')}\n\n**Skill Matrix:**\n- **Technical:** ${data.skills.slice(0, 3).join(', ')}\n- **Soft Skills:** Problem-solving, communication, and adaptability.\n\n**Financial Outlook:**\n- **Starting:** ${data.salary.fresher}\n- **Mid-Level:** ${data.salary.experienced}\n- **Senior:** ${data.salary.senior}\n\n**Prominent Employers:** ${data.companies.join(', ')}\n\n**Recommended Certifications:**\n${data.certifications.map(c => `• ${c}`).join('\n')}\n\n**Growth Tip:** The field of ${data.name} is evolving rapidly. Continuous learning through platforms like Coursera/edX is vital.`,
                    sources: ['Global Career Trends Report'],
                    suggestions: [`How to start as a ${data.name}`, `Best courses for ${key}`]
                };
            }
        }

        return null;
    }
}

module.exports = new CareerDataService();