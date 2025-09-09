import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Brain,
  Video,
  FileText,
  CheckCircle,
  Star,
} from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';

const Home = () => {
  const features = [
    {
      icon: <Brain className='h-6 w-6' />,
      title: 'AI-Powered Questions',
      description: 'Smart questions tailored to your CV and experience level',
    },
    {
      icon: <Video className='h-6 w-6' />,
      title: 'Video Interview',
      description: 'Practice with realistic video interview scenarios',
    },
    {
      icon: <FileText className='h-6 w-6' />,
      title: 'Instant Feedback',
      description: 'Get detailed analysis and improvement suggestions',
    },
  ];

  const benefits = [
    'Personalized interview questions based on your CV',
    'Real-time AI feedback and scoring',
    'Practice at your own pace, anytime',
    'Comprehensive performance analysis',
  ];

  return (
    <div className='relative'>
      {/* Hero Section */}
      <section className='relative overflow-hidden py-20 lg:py-32'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10'></div>
        <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='mb-6 text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl'>
              Master Your Next
              <span className='block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Job Interview
              </span>
            </h1>
            <p className='mx-auto mb-8 max-w-3xl text-xl text-slate-600'>
              Practice with our AI interviewer that analyzes your CV and creates
              personalized questions. Get instant feedback and improve your
              interview skills.
            </p>
            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <SignedIn>
                <Link
                  to='/form'
                  className='flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg'
                >
                  Start Interview Now
                  <ArrowRight className='h-5 w-5' />
                </Link>
                <Link
                  to='/profile'
                  className='px-8 py-4 font-semibold text-slate-600 transition-colors hover:text-slate-800'
                >
                  View Profile
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode='modal'>
                  <button className='flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg'>
                    Start Free Interview
                    <ArrowRight className='h-5 w-5' />
                  </button>
                </SignInButton>
                <button className='px-8 py-4 font-semibold text-slate-600 transition-colors hover:text-slate-800'>
                  Watch Demo
                </button>
              </SignedOut>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='bg-white py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-slate-900 lg:text-4xl'>
              Why Choose InterviewAI?
            </h2>
            <p className='mx-auto max-w-2xl text-xl text-slate-600'>
              Our platform combines cutting-edge AI technology with proven
              interview techniques
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-3'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='rounded-2xl bg-slate-50 p-8 transition-colors hover:bg-slate-100'
              >
                <div className='mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
                  {feature.icon}
                </div>
                <h3 className='mb-3 text-xl font-semibold text-slate-900'>
                  {feature.title}
                </h3>
                <p className='text-slate-600'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className='bg-gradient-to-r from-blue-50 to-purple-50 py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            <div>
              <h2 className='mb-6 text-3xl font-bold text-slate-900 lg:text-4xl'>
                Everything You Need to
                <span className='block text-blue-600'>Succeed</span>
              </h2>
              <div className='space-y-4'>
                {benefits.map((benefit, index) => (
                  <div key={index} className='flex items-start gap-3'>
                    <CheckCircle className='mt-0.5 h-6 w-6 flex-shrink-0 text-green-500' />
                    <p className='text-slate-700'>{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='relative'>
              <div className='rounded-2xl bg-white p-8 shadow-xl'>
                <div className='mb-6 flex items-center gap-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600'>
                    <Star className='h-6 w-6 text-white' />
                  </div>
                  <div>
                    <h4 className='font-semibold text-slate-900'>
                      Premium Experience
                    </h4>
                    <p className='text-sm text-slate-600'>
                      Tailored for success
                    </p>
                  </div>
                </div>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-slate-600'>CV Analysis</span>
                    <span className='font-semibold text-green-600'>
                      ✓ Complete
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-slate-600'>Question Generation</span>
                    <span className='font-semibold text-blue-600'>
                      🤖 AI Powered
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-slate-600'>Performance Score</span>
                    <span className='font-semibold text-purple-600'>85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-slate-900 py-20'>
        <div className='mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='mb-6 text-3xl font-bold text-white lg:text-4xl'>
            Ready to Ace Your Interview?
          </h2>
          <p className='mx-auto mb-8 max-w-2xl text-xl text-slate-300'>
            Join thousands of professionals who have improved their interview
            skills with InterviewAI
          </p>
          <SignedIn>
            <Link
              to='/form'
              className='inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg'
            >
              Start Interview Now
              <ArrowRight className='h-5 w-5' />
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode='modal'>
              <button className='inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg'>
                Get Started Now
                <ArrowRight className='h-5 w-5' />
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </section>
    </div>
  );
};

export default Home;
