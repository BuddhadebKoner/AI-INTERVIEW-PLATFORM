// Test script for question generation service
// Run with: node backend/services/testQuestionGenerator.js

import dotenv from 'dotenv';
dotenv.config();

import { generateInterviewQuestions } from './questionGenerator.service.js';

const testQuestionGeneration = async () => {
   console.log('🚀 Testing Interview Question Generation...\n');

   const testCases = [
      {
         name: 'Frontend Developer - Beginner',
         params: {
            interviewType: 'Frontend',
            complexity: 'beginner',
            skills: ['HTML', 'CSS', 'JavaScript', 'React'],
            experience: [
               {
                  company: 'DevsIndia',
                  position: 'Junior Frontend Developer',
                  duration: '1 year',
                  responsibilities: ['Building UI components', 'Bug fixing'],
               },
            ],
            candidateName: 'John Doe',
         },
      },
      {
         name: 'Full Stack Developer - Intermediate',
         params: {
            interviewType: 'Full Stack',
            complexity: 'intermediate',
            skills: ['React', 'Node.js', 'MongoDB', 'Express', 'REST APIs'],
            experience: [
               {
                  company: 'TechCorp',
                  position: 'Full Stack Developer',
                  duration: '3 years',
                  responsibilities: [
                     'Developing full-stack applications',
                     'Database design',
                     'API development',
                  ],
               },
            ],
            candidateName: 'Jane Smith',
         },
      },
      {
         name: 'Backend Developer - Pro',
         params: {
            interviewType: 'Backend',
            complexity: 'pro',
            skills: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
            experience: [
               {
                  company: 'Enterprise Solutions',
                  position: 'Senior Backend Engineer',
                  duration: '5 years',
                  responsibilities: [
                     'Microservices architecture',
                     'Performance optimization',
                     'Team leadership',
                  ],
               },
            ],
            candidateName: 'Alex Johnson',
         },
      },
   ];

   for (const testCase of testCases) {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`📋 Test Case: ${testCase.name}`);
      console.log(`${'='.repeat(80)}\n`);

      try {
         const questions = await generateInterviewQuestions(testCase.params);

         console.log(`✅ Generated ${questions.length} questions:\n`);

         questions.forEach((q, index) => {
            console.log(`${q.questionNumber}. [${q.category.toUpperCase()}]`);
            console.log(`   Q: ${q.question}`);
            console.log(`   Expected: ${q.expectedAnswer.substring(0, 100)}...`);
            console.log('');
         });

         // Validate structure
         const hasAllQuestions = questions.length === 11;
         const hasCommonQuestions =
            questions[0].questionNumber === 1 &&
            questions[1].questionNumber === 2 &&
            questions[9].questionNumber === 10 &&
            questions[10].questionNumber === 11;
         const hasCategories = questions.every((q) => q.category);

         console.log('✓ Validation Results:');
         console.log(`  - Has 11 questions: ${hasAllQuestions ? '✅' : '❌'}`);
         console.log(`  - Common questions in place: ${hasCommonQuestions ? '✅' : '❌'}`);
         console.log(`  - All have categories: ${hasCategories ? '✅' : '❌'}`);
      } catch (error) {
         console.error(`❌ Test failed for ${testCase.name}:`, error.message);
      }
   }

   console.log(`\n${'='.repeat(80)}`);
   console.log('🎉 Testing Complete!');
   console.log(`${'='.repeat(80)}\n`);

   process.exit(0);
};

// Run test
testQuestionGeneration().catch((error) => {
   console.error('Fatal error:', error);
   process.exit(1);
});
