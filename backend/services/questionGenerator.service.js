import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate interview questions using Gemini AI
 * @param {Object} params - Interview parameters
 * @param {string} params.interviewType - Type of interview (Frontend, Backend, etc.)
 * @param {string} params.complexity - Difficulty level (beginner, intermediate, pro)
 * @param {Array} params.skills - Candidate's skills
 * @param {Array} params.experience - Candidate's experience
 * @param {string} params.candidateName - Candidate's name
 * @returns {Promise<Array>} - Array of generated questions
 */
export const generateInterviewQuestions = async ({
   interviewType,
   complexity,
   skills,
   experience,
   candidateName,
}) => {
   try {
      // Fixed common questions for all interviews (questions 1, 2, 10, 11)
      const commonQuestions = [
         {
            questionNumber: 1,
            question: 'Tell me about yourself.',
            category: 'common',
            expectedAnswer:
               'Candidate should provide a brief professional summary including their background, current role, and key achievements.',
         },
         {
            questionNumber: 2,
            question: `How many years of experience do you have with ${interviewType}?`,
            category: 'common',
            expectedAnswer: `Candidate should specify their years of experience in ${interviewType} and mention key projects or technologies they've worked with.`,
         },
      ];

      // Get latest experience for question 3
      const latestExperience = experience && experience.length > 0 ? experience[0] : null;
      const latestCompany = latestExperience?.company || 'your previous company';

      // Build dynamic prompt for AI-generated questions (3-9)
      const prompt = `Generate 7 real-world ${interviewType} interview questions for ${complexity} level candidate.

Profile: ${candidateName}, Skills: ${skills.slice(0, 5).join(', ')}, Company: ${latestCompany}

Q3: Experience - "What challenges did you face at ${latestCompany}?"
Q4: Technical - Direct question like "What is [tool/concept]?" based on ${interviewType}
Q5: Core concept - "What is [specific technology]?" from their skills
Q6: Problem-solving - Practical scenario using ${skills[0] || 'their skills'}
Q7: Architecture - Design question for ${complexity} level
Q8: Best practices - "What are [specific] best practices?"
Q9: Trends - Recent technology in ${interviewType}

Rules:
- Ask direct "What is X?" or "Explain X" questions
- Use actual tool names (axios, webpack, redis, docker, etc.)
- Reference ${latestCompany} in Q3
- Match ${complexity} difficulty
- Be specific, not generic

JSON array only, no markdown:
[{"questionNumber":3,"question":"...","category":"experience-based","expectedAnswer":"..."},...]`;

      // Call Gemini API
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text();

      // Parse AI response
      let aiQuestions = [];
      try {
         // Clean the response - remove markdown code blocks if present
         const cleanedText = generatedText
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

         aiQuestions = JSON.parse(cleanedText);

         // Validate the response
         if (!Array.isArray(aiQuestions) || aiQuestions.length !== 7) {
            throw new Error('Invalid number of questions generated');
         }
      } catch (parseError) {
         console.error('Failed to parse AI response:', parseError);
         console.error('AI Response:', generatedText);

         // Fallback questions if AI parsing fails
         aiQuestions = generateFallbackQuestions(
            interviewType,
            complexity,
            skills,
            latestCompany
         );
      }

      // Fixed closing questions (questions 10, 11)
      const closingQuestions = [
         {
            questionNumber: 10,
            question: 'Tell me about your passion. What drives you in your career?',
            category: 'behavioral',
            expectedAnswer:
               'Candidate should express genuine interest in technology and personal motivations.',
         },
         {
            questionNumber: 11,
            question: 'How much salary would you expect for this role?',
            category: 'common',
            expectedAnswer:
               'Candidate should provide a reasonable salary expectation based on their experience and market rates.',
         },
      ];

      // Combine all questions
      const allQuestions = [...commonQuestions, ...aiQuestions, ...closingQuestions];

      return allQuestions;
   } catch (error) {
      console.error('Error generating questions:', error);
      // Return fallback questions if AI fails
      return generateFallbackQuestions(interviewType, complexity, skills, 'your previous company');
   }
};

/**
 * Generate fallback questions when AI fails
 */
const generateFallbackQuestions = (interviewType, complexity, skills, company) => {
   return [
      {
         questionNumber: 1,
         question: 'Tell me about yourself.',
         category: 'common',
         expectedAnswer: 'Brief professional summary.',
      },
      {
         questionNumber: 2,
         question: `How many years of experience do you have with ${interviewType}?`,
         category: 'common',
         expectedAnswer: 'Years of experience in the field.',
      },
      {
         questionNumber: 3,
         question: `What challenges did you face while working at ${company}?`,
         category: 'experience-based',
         expectedAnswer: 'Specific technical or team challenges and solutions.',
      },
      {
         questionNumber: 4,
         question: `Explain a core concept in ${interviewType} at ${complexity} level.`,
         category: 'technical',
         expectedAnswer: 'Technical explanation appropriate to difficulty level.',
      },
      {
         questionNumber: 5,
         question: `What are best practices you follow in ${interviewType}?`,
         category: 'technical',
         expectedAnswer: 'Industry best practices and standards.',
      },
      {
         questionNumber: 6,
         question: `Describe a complex problem you solved using ${skills[0] || 'your skills'}.`,
         category: 'experience-based',
         expectedAnswer: 'Problem-solving approach and solution.',
      },
      {
         questionNumber: 7,
         question: `How do you handle performance optimization in ${interviewType}?`,
         category: 'technical',
         expectedAnswer: 'Performance strategies and tools.',
      },
      {
         questionNumber: 8,
         question: `What's your approach to testing in ${interviewType}?`,
         category: 'technical',
         expectedAnswer: 'Testing methodologies and practices.',
      },
      {
         questionNumber: 9,
         question: `What recent trends or technologies are you following in ${interviewType}?`,
         category: 'technical',
         expectedAnswer: 'Current industry trends and technologies.',
      },
      {
         questionNumber: 10,
         question: 'Tell me about your passion. What drives you in your career?',
         category: 'behavioral',
         expectedAnswer: 'Personal motivation and career goals.',
      },
      {
         questionNumber: 11,
         question: 'How much salary would you expect for this role?',
         category: 'common',
         expectedAnswer: 'Salary expectation based on experience.',
      },
   ];
};

export default { generateInterviewQuestions };
