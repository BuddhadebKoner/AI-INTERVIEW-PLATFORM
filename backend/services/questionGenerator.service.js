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
    const latestExperience =
      experience && experience.length > 0 ? experience[0] : null;
    const latestCompany = latestExperience?.company || 'your previous company';

    // Build dynamic prompt for AI-generated questions (3-9)
    const skillsList =
      skills && skills.length > 0
        ? skills.slice(0, 8).join(', ')
        : 'general technologies';
    const experienceSummary =
      experience && experience.length > 0
        ? experience
            .map(exp => `${exp.title} at ${exp.company}`)
            .slice(0, 3)
            .join('; ')
        : 'general experience';

    const prompt = `You are an expert technical interviewer. Generate 7 diverse, specific, and relevant ${interviewType} interview questions for a ${complexity} level candidate.

CANDIDATE PROFILE:
- Name: ${candidateName}
- Skills: ${skillsList}
- Recent Role: ${latestCompany}
- Experience: ${experienceSummary}
- Interview Type: ${interviewType}
- Complexity: ${complexity}

QUESTION REQUIREMENTS:
Q3 (Experience-based): Ask about a SPECIFIC challenge or project at ${latestCompany}. Make it relevant to ${interviewType}.

Q4 (Technical Deep-dive): Ask about ONE specific technology from their skills (${skills[0]}, ${skills[1]}, or ${skills[2]}). Use format: "Explain how [technology] works" or "What is [specific concept] in [technology]?"

Q5 (Practical Implementation): Ask how they would implement a real-world feature using their skills. Be specific (e.g., "How would you implement authentication using JWT?" or "How would you optimize database queries?")

Q6 (Problem-solving): Present a specific technical scenario or bug they might encounter with ${skills[0] || interviewType}. Ask how they would debug or solve it.

Q7 (System Design/Architecture): For ${complexity} level, ask about designing or architecting a system component relevant to ${interviewType} (e.g., API design, database schema, microservices, caching strategy)

Q8 (Best Practices): Ask about specific best practices for ONE technology they know (${skills[1] || interviewType}). Not generic - ask about security, performance, or scalability.

Q9 (Modern Trends): Ask about a CURRENT trend, tool, or framework in ${interviewType} (released/popular in 2023-2025). Reference something they might have used or should know.

STRICT RULES:
- Use ACTUAL technology names from their skills: ${skillsList}
- ${complexity === 'beginner' ? 'Keep questions fundamental and straightforward' : ''}
- ${complexity === 'intermediate' ? 'Ask mid-level implementation and design questions' : ''}
- ${complexity === 'pro' ? 'Ask advanced architecture, optimization, and scaling questions' : ''}
- Make questions SPECIFIC, not generic templates
- Each question should be unique and relevant to ${interviewType}
- Reference their actual company ${latestCompany} in Q3
- Expected answers should be detailed and specific to the question

OUTPUT FORMAT (JSON array only, NO markdown, NO code blocks):
[{"questionNumber":3,"question":"Detailed specific question here","category":"experience-based","expectedAnswer":"Specific expected answer with key points"},...]`;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
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
        latestCompany,
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
    const allQuestions = [
      ...commonQuestions,
      ...aiQuestions,
      ...closingQuestions,
    ];

    return allQuestions;
  } catch (error) {
    console.error('Error generating questions:', error);
    // Return fallback questions if AI fails
    return generateFallbackQuestions(
      interviewType,
      complexity,
      skills,
      'your previous company',
    );
  }
};

/**
 * Generate fallback questions when AI fails
 */
const generateFallbackQuestions = (
  interviewType,
  complexity,
  skills,
  company,
) => {
  const skill1 = skills && skills[0] ? skills[0] : 'your primary technology';
  const skill2 = skills && skills[1] ? skills[1] : 'supporting technologies';

  const difficultyMap = {
    beginner: {
      q4: `What is ${skill1} and why is it used in ${interviewType} development?`,
      q5: `Explain the basic concepts and features of ${skill1}.`,
      q6: `How would you approach learning a new technology like ${skill2}?`,
      q7: `What is the difference between common ${interviewType} architectures?`,
      q8: `What are the fundamental best practices in ${interviewType} development?`,
    },
    intermediate: {
      q4: `How does ${skill1} handle state management and data flow in ${interviewType} applications?`,
      q5: `Explain how you would implement authentication and authorization using ${skill2}.`,
      q6: `Describe a scenario where you optimized application performance using ${skill1}.`,
      q7: `How would you design a scalable ${interviewType} architecture for a growing application?`,
      q8: `What security best practices do you implement when working with ${skill1}?`,
    },
    pro: {
      q4: `Explain the internal architecture and advanced patterns in ${skill1} for enterprise-scale applications.`,
      q5: `How would you design a microservices architecture using ${skill1} and ${skill2}?`,
      q6: `Describe your approach to debugging and resolving complex production issues with ${skill1}.`,
      q7: `How do you architect for high availability, fault tolerance, and disaster recovery in ${interviewType}?`,
      q8: `What advanced optimization techniques do you use for ${skill1} in production environments?`,
    },
  };

  const levelQuestions =
    difficultyMap[complexity] || difficultyMap.intermediate;

  return [
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
    {
      questionNumber: 3,
      question: `What was the most challenging technical problem you solved at ${company}?`,
      category: 'experience-based',
      expectedAnswer:
        'Candidate should describe a specific technical challenge, their approach to solving it, technologies used, and the outcome.',
    },
    {
      questionNumber: 4,
      question: levelQuestions.q4,
      category: 'technical',
      expectedAnswer: `Candidate should demonstrate deep understanding of ${skill1} relevant to ${complexity} level, including practical examples.`,
    },
    {
      questionNumber: 5,
      question: levelQuestions.q5,
      category: 'technical',
      expectedAnswer: `Candidate should explain implementation details, security considerations, and best practices for ${complexity} level.`,
    },
    {
      questionNumber: 6,
      question: levelQuestions.q6,
      category: 'experience-based',
      expectedAnswer:
        'Candidate should provide specific examples, metrics, and tools used to solve the problem or achieve optimization.',
    },
    {
      questionNumber: 7,
      question: levelQuestions.q7,
      category: 'technical',
      expectedAnswer: `Candidate should discuss architecture patterns, trade-offs, scalability considerations appropriate for ${complexity} level.`,
    },
    {
      questionNumber: 8,
      question: levelQuestions.q8,
      category: 'technical',
      expectedAnswer:
        'Candidate should mention industry standards, security practices, performance optimization, and monitoring approaches.',
    },
    {
      questionNumber: 9,
      question: `What recent ${interviewType} technologies or trends have you explored or implemented in the last year?`,
      category: 'technical',
      expectedAnswer:
        "Candidate should discuss current industry trends, new tools they've learned, and how they stay updated with technology.",
    },
    {
      questionNumber: 10,
      question: 'Tell me about your passion. What drives you in your career?',
      category: 'behavioral',
      expectedAnswer:
        'Candidate should express genuine interest in technology, continuous learning, and personal motivations in software development.',
    },
    {
      questionNumber: 11,
      question: 'How much salary would you expect for this role?',
      category: 'common',
      expectedAnswer:
        'Candidate should provide a reasonable salary expectation based on their experience, skills, and market rates.',
    },
  ];
};

export default { generateInterviewQuestions };
