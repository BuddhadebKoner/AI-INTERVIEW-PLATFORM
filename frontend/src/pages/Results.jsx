import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Trophy,
  TrendingUp,
  Clock,
  MessageSquare,
  Award,
  Download,
  RefreshCw,
  Home,
  BarChart3,
} from 'lucide-react';

const Results = () => {
  const navigate = useNavigate();
  const [interviewData, setInterviewData] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Load interview data and generate mock results
    const storedData = localStorage.getItem('interviewData');
    const storedAnswers = localStorage.getItem('interviewAnswers');

    if (!storedData) {
      navigate('/form');
      return;
    }

    const data = JSON.parse(storedData);
    const answers = storedAnswers ? JSON.parse(storedAnswers) : [];

    setInterviewData(data);

    // Generate mock AI analysis results
    const mockResults = {
      overallScore: 78,
      performance: {
        communication: 85,
        technical: 72,
        behavioral: 80,
        confidence: 75,
      },
      strengths: [
        'Excellent communication skills and clear articulation',
        'Strong technical background with relevant experience',
        'Good problem-solving approach and methodology',
      ],
      improvements: [
        'Provide more specific examples in behavioral questions',
        'Practice technical explanations for complex concepts',
        'Work on time management for longer responses',
      ],
      questionAnalysis: [
        {
          question: 'Tell me about yourself and your background',
          score: 85,
          feedback:
            'Great introduction with clear career progression. Consider adding more specific achievements.',
          category: 'General',
        },
        {
          question: 'What programming languages are you comfortable with?',
          score: 72,
          feedback:
            'Good technical knowledge. Provide more real-world application examples.',
          category: 'Technical',
        },
        {
          question: 'Describe a challenging project',
          score: 80,
          feedback:
            'Well-structured response. Include more details about the impact and results.',
          category: 'Behavioral',
        },
      ],
      recommendations: [
        'Practice the STAR method for behavioral questions',
        'Prepare 3-5 detailed project examples',
        'Research common technical questions for your role',
        'Work on confident body language and eye contact',
      ],
    };

    setResults(mockResults);
  }, [navigate]);

  const getScoreColor = score => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = score => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (!results) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-slate-600'>
            Analyzing your interview performance...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-50 py-12'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <div className='mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600'>
            <Trophy className='h-10 w-10 text-white' />
          </div>
          <h1 className='mb-4 text-3xl font-bold text-slate-900 lg:text-4xl'>
            Interview Results
          </h1>
          <p className='mx-auto max-w-2xl text-xl text-slate-600'>
            Here's your detailed performance analysis and personalized feedback
          </p>
        </div>

        {/* Overall Score Card */}
        <div className='mb-8 rounded-2xl bg-white p-8 shadow-xl'>
          <div className='grid items-center gap-8 md:grid-cols-2'>
            <div className='text-center'>
              <div className='relative inline-block'>
                <svg
                  className='h-32 w-32 -rotate-90 transform'
                  viewBox='0 0 100 100'
                >
                  <circle
                    cx='50'
                    cy='50'
                    r='40'
                    stroke='currentColor'
                    strokeWidth='8'
                    fill='transparent'
                    className='text-slate-200'
                  />
                  <circle
                    cx='50'
                    cy='50'
                    r='40'
                    stroke='currentColor'
                    strokeWidth='8'
                    fill='transparent'
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - results.overallScore / 100)}`}
                    className='text-blue-600 transition-all duration-1000'
                  />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-3xl font-bold text-slate-900'>
                    {results.overallScore}%
                  </span>
                </div>
              </div>
              <h3 className='mt-4 text-xl font-semibold text-slate-900'>
                Overall Score
              </h3>
              <p className='text-slate-600'>Above Average Performance</p>
            </div>

            <div className='space-y-4'>
              {Object.entries(results.performance).map(([skill, score]) => (
                <div key={skill} className='flex items-center justify-between'>
                  <span className='font-medium capitalize text-slate-700'>
                    {skill}
                  </span>
                  <div className='flex items-center gap-3'>
                    <div className='h-2 w-32 rounded-full bg-slate-200'>
                      <div
                        className='h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-1000'
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <span className={`font-semibold ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='mb-8 grid gap-8 lg:grid-cols-2'>
          {/* Strengths */}
          <div className='rounded-2xl bg-white p-6 shadow-lg'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-green-100'>
                <TrendingUp className='h-5 w-5 text-green-600' />
              </div>
              <h3 className='text-xl font-semibold text-slate-900'>
                Strengths
              </h3>
            </div>
            <div className='space-y-3'>
              {results.strengths.map((strength, index) => (
                <div key={index} className='flex items-start gap-3'>
                  <div className='mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500'></div>
                  <p className='text-slate-700'>{strength}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className='rounded-2xl bg-white p-6 shadow-lg'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100'>
                <BarChart3 className='h-5 w-5 text-yellow-600' />
              </div>
              <h3 className='text-xl font-semibold text-slate-900'>
                Areas for Improvement
              </h3>
            </div>
            <div className='space-y-3'>
              {results.improvements.map((improvement, index) => (
                <div key={index} className='flex items-start gap-3'>
                  <div className='mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-500'></div>
                  <p className='text-slate-700'>{improvement}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Question Analysis */}
        <div className='mb-8 rounded-2xl bg-white p-6 shadow-lg'>
          <div className='mb-6 flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100'>
              <MessageSquare className='h-5 w-5 text-blue-600' />
            </div>
            <h3 className='text-xl font-semibold text-slate-900'>
              Question-by-Question Analysis
            </h3>
          </div>

          <div className='space-y-4'>
            {results.questionAnalysis.map((analysis, index) => (
              <div
                key={index}
                className='rounded-lg border border-slate-200 p-4'
              >
                <div className='mb-3 flex items-start justify-between'>
                  <div className='flex-1'>
                    <h4 className='mb-1 font-semibold text-slate-900'>
                      Question {index + 1}: {analysis.question}
                    </h4>
                    <span className='rounded bg-slate-100 px-2 py-1 text-sm text-slate-600'>
                      {analysis.category}
                    </span>
                  </div>
                  <div
                    className={`ml-4 rounded-full px-3 py-1 font-semibold ${getScoreBg(analysis.score)} ${getScoreColor(analysis.score)}`}
                  >
                    {analysis.score}%
                  </div>
                </div>
                <p className='text-slate-700'>{analysis.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className='mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg'>
          <div className='mb-6 flex items-center gap-3'>
            <Award className='h-6 w-6' />
            <h3 className='text-xl font-semibold'>
              Personalized Recommendations
            </h3>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            {results.recommendations.map((recommendation, index) => (
              <div
                key={index}
                className='rounded-lg bg-white/10 p-4 backdrop-blur-sm'
              >
                <div className='flex items-start gap-3'>
                  <div className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/20'>
                    <span className='text-sm font-bold'>{index + 1}</span>
                  </div>
                  <p>{recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <button className='flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700'>
            <Download className='h-5 w-5' />
            Download Report
          </button>

          <Link
            to='/form'
            className='flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50'
          >
            <RefreshCw className='h-5 w-5' />
            Retake Interview
          </Link>

          <Link
            to='/'
            className='flex items-center justify-center gap-2 rounded-xl bg-slate-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-slate-700'
          >
            <Home className='h-5 w-5' />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;
