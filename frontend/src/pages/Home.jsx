import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BarChart,
  Brain,
  CheckCircle,
  Clock,
  FileText,
  Lightbulb,
  Mic,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Upload,
  Users,
  Video,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: <Brain className='h-8 w-8' />,
      title: 'AI-Powered Questions',
      description: 'Smart questions tailored to your CV and experience level. Our AI analyzes your resume and generates relevant questions.',
      gradient: 'from-blue-500 to-cyan-500',
      emoji: '🤖',
    },
    {
      icon: <Video className='h-8 w-8' />,
      title: 'Video Interview Practice',
      description: 'Practice with realistic video interview scenarios and improve your communication skills',
      gradient: 'from-purple-500 to-pink-500',
      emoji: '🎥',
    },
    {
      icon: <FileText className='h-8 w-8' />,
      title: 'Instant Feedback',
      description: 'Get detailed analysis and improvement suggestions within seconds of completing your interview',
      gradient: 'from-orange-500 to-red-500',
      emoji: '📊',
    },
    {
      icon: <Target className='h-8 w-8' />,
      title: 'Personalized Learning',
      description: 'Track your progress and focus on areas that need improvement with our analytics dashboard',
      gradient: 'from-green-500 to-emerald-500',
      emoji: '🎯',
    },
    {
      icon: <BarChart className='h-8 w-8' />,
      title: 'Performance Analytics',
      description: 'Detailed insights into your interview performance with actionable recommendations',
      gradient: 'from-red-500 to-pink-500',
      emoji: '📈',
    },
    {
      icon: <Shield className='h-8 w-8' />,
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. Practice confidently knowing your privacy is protected',
      gradient: 'from-indigo-500 to-purple-500',
      emoji: '🔒',
    },
  ];

  const howItWorks = [
    {
      icon: <Upload className='h-12 w-12' />,
      title: 'Upload Your Resume',
      description: 'Upload your resume and let our AI understand your skills and experience.',
      image: 'https://imgs.search.brave.com/qopQllZoWkfFbYS2jqr8oFxLewdUaQuDjAUQkAtTbCM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lbmhh/bmN2LmNvbS9fbmV4/dC9zdGF0aWMvaW1h/Z2VzL3Jlc3VtZS0z/NDhjMDMzZGM3Mzhk/YTM0M2Y2NjIxZTQ3/NGY0OGE4Ny5zdmc',
      showButton: true,
    },
    {
      icon: <Brain className='h-12 w-12' />,
      title: 'Get Personalized Questions',
      description: 'Our AI creates interview questions that match your background and the role you want.',
      image: 'https://media.istockphoto.com/id/2244328501/photo/businessman-using-smartphone-and-laptop-with-glowing-ai-icons-artificial-intelligence-machine.jpg?s=612x612&w=0&k=20&c=GpngWPVsq4ZVwsMCXyEsXRenM_DNQ_8ixAJnp5CVYH8=',
      showButton: false,
    },
    {
      icon: <Mic className='h-12 w-12' />,
      title: 'Practice Interview',
      description: 'Answer questions through video or text and practice until you feel confident.',
      image: 'https://imgs.search.brave.com/xXeO8bx9bxNLlhO352DV2YNrXpEN0_uAyaa4PDFgswE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvYWktdGV4dC1n/ZW5lcmF0b3ItZmxh/dC1jb25jZXB0LXZl/Y3Rvci1zcG90LWls/bHVzdHJhdGlvbl8x/NTExNTAtMTMxODgu/anBnP3NlbXQ9YWlz/X2h5YnJpZCZ3PTc0/MCZxPTgw',
      showButton: false,
    },
    {
      icon: <Award className='h-12 w-12' />,
      title: 'Review Your Results',
      description: 'Get instant feedback with detailed scores and tips to improve your interview skills.',
      image: 'https://media.istockphoto.com/id/2153852505/photo/business-approve-document-guarantee-process-quality-for-certificate-concept-assurance-check.jpg?s=612x612&w=0&k=20&c=d7h9SjbZJBRcTSzGac2Svf_8YiiVhOx-lIaoTJ_Azbg=',
      showButton: false,
    },
  ];

  const whyChoose = [
    {
      icon: <Zap className='h-6 w-6' />,
      title: 'Lightning Fast',
      description: 'Get your personalized interview questions generated in seconds, not hours.',
    },
    {
      icon: <Users className='h-6 w-6' />,
      title: 'Trusted by Thousands',
      description: 'Join over 10,000+ professionals who have improved their interview skills.',
    },
    {
      icon: <Clock className='h-6 w-6' />,
      title: 'Practice Anytime',
      description: '24/7 access means you can practice whenever it suits your schedule.',
    },
    {
      icon: <Lightbulb className='h-6 w-6' />,
      title: 'Smart Insights',
      description: 'AI-powered analytics provide actionable insights to boost your performance.',
    },
  ];

  const interviewTypes = [
    {
      title: 'Technical Interviews',
      description: 'Master coding challenges and system design questions',
      icon: '💻',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Behavioral Interviews',
      description: 'Perfect your STAR method responses and soft skills',
      icon: '🎭',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Management Rounds',
      description: 'Prepare for leadership and strategic thinking questions',
      icon: '👔',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Case Interviews',
      description: 'Tackle business cases and analytical problems',
      icon: '📊',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  const benefits = [
    'Personalized interview questions based on your CV',
    'Real-time AI feedback and scoring',
    'Practice at your own pace, anytime',
    'Comprehensive performance analysis',
  ];

  const stats = [
    { icon: <Users className='h-6 w-6' />, value: '10K+', label: 'Active Users' },
    { icon: <Award className='h-6 w-6' />, value: '95%', label: 'Success Rate' },
    { icon: <TrendingUp className='h-6 w-6' />, value: '50K+', label: 'Interviews Completed' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className='relative'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 lg:py-32'>
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]'></div>
        </div>

        {/* Animated background elements */}
        <motion.div
          className='absolute left-1/4 top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl'
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className='absolute right-1/4 top-40 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl'
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='text-center'
            initial='hidden'
            animate='visible'
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className='mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-2 text-sm font-semibold text-blue-700 shadow-lg'>
              <Sparkles className='h-4 w-4' />
              <span>Your Success Story Starts Here</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className='mb-6 text-5xl font-bold text-slate-900 sm:text-6xl lg:text-7xl'
            >
              Master Your Next
              <span className='block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                Job Interview
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className='mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-slate-600 sm:text-2xl'
            >
              Practice with our AI interviewer that analyzes your CV and creates
              personalized questions. Get instant feedback and ace your dream job.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className='flex flex-col items-center justify-center gap-4 sm:flex-row'
            >
              <SignedIn>
                <Link
                  to='/form'
                  className='group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-5 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:shadow-2xl'
                >
                  <motion.span
                    className='absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600'
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className='relative flex items-center gap-2'>
                    Start Interview Now
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className='h-5 w-5' />
                    </motion.span>
                  </span>
                </Link>
                <Link
                  to='/profile'
                  className='group rounded-full border-2 border-slate-300 bg-white px-10 py-5 text-lg font-semibold text-slate-700 transition-all duration-300 hover:border-slate-400 hover:bg-slate-50'
                >
                  View Profile
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode='modal'>
                  <motion.button
                    className='group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-5 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:shadow-2xl'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      className='absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600'
                      initial={{ x: '100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className='relative flex items-center gap-2'>
                      Get Started Free ✨
                      <ArrowRight className='h-5 w-5' />
                    </span>
                  </motion.button>
                </SignInButton>
                <motion.button
                  className='rounded-full border-2 border-slate-300 bg-white px-10 py-5 text-lg font-semibold text-slate-700 transition-all duration-300 hover:border-slate-400 hover:bg-slate-50'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Watch Demo 🎬
                </motion.button>
              </SignedOut>
            </motion.div>
          </motion.div>

          {/* Stats Section */}

        </div>
      </section>

      {/* Interview Types Section */}
      <section className='bg-white py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='mb-16 text-center'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2
              variants={itemVariants}
              className='mb-4 text-4xl font-bold text-slate-900 lg:text-5xl'
            >
              Prepare for Any Interview Type
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className='mx-auto max-w-2xl text-xl text-slate-600'
            >
              From technical coding rounds to behavioral assessments, we've got you covered
            </motion.p>
          </motion.div>

          <motion.div
            className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {interviewTypes.map((type, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className='group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 transition-all duration-300'
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}></div>
                <div className='relative'>
                  <div className='mb-4 text-5xl'>{type.icon}</div>
                  <h3 className='mb-3 text-xl font-bold text-slate-900'>
                    {type.title}
                  </h3>
                  <p className='text-slate-600'>{type.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='bg-gradient-to-b from-slate-50 to-white py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='mb-16 text-center'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2
              variants={itemVariants}
              className='mb-4 text-4xl font-bold text-slate-900 lg:text-5xl'
            >
              How It Works
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className='mx-auto max-w-2xl text-xl text-slate-600'
            >
              Four simple steps to interview success
            </motion.p>
          </motion.div>

          <div className='space-y-24'>
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                className={`flex flex-col items-center gap-12 lg:flex-row ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className='flex-1'>
                  <motion.div
                    className='relative overflow-hidden rounded-3xl shadow-2xl'
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className='h-[400px] w-full object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent'></div>
                  </motion.div>
                </div>

                <div className='flex-1'>
                  <motion.div
                    className='mb-4 inline-flex items-center gap-3'
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <div className='flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'>
                      {item.icon}
                    </div>
                  </motion.div>
                  <h3 className='mb-4 text-3xl font-bold text-slate-900'>
                    {item.title}
                  </h3>
                  <p className='text-lg leading-relaxed text-slate-600 mb-6'>
                    {item.description}
                  </p>
                  {item.showButton && (
                    <SignedIn>
                      <Link to='/form'>
                        <motion.button
                          className='inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl'
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Upload className='h-5 w-5' />
                          Upload Resume
                        </motion.button>
                      </Link>
                    </SignedIn>
                  )}
                  {item.showButton && (
                    <SignedOut>
                      <SignInButton mode='modal'>
                        <motion.button
                          className='inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl'
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Upload className='h-5 w-5' />
                          Upload Resume
                        </motion.button>
                      </SignInButton>
                    </SignedOut>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='bg-white py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='mb-16 text-center'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2
              variants={itemVariants}
              className='mb-4 text-4xl font-bold text-slate-900 lg:text-5xl'
            >
              Amazing Features
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className='mx-auto max-w-2xl text-xl text-slate-600'
            >
              Everything you need to succeed in your next interview
            </motion.p>
          </motion.div>

          <motion.div
            className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className='group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl'
                whileHover={{ y: -10 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}></div>
                <div className='relative'>
                  <div className='mb-6 flex items-center gap-4'>
                    <motion.div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${feature.gradient} text-white shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <div className='text-4xl'>{feature.emoji}</div>
                  </div>
                  <h3 className='mb-3 text-2xl font-bold text-slate-900'>
                    {feature.title}
                  </h3>
                  <p className='text-slate-600'>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className='bg-gradient-to-r from-blue-50 to-purple-50 py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='mb-16 text-center'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2
              variants={itemVariants}
              className='mb-4 text-4xl font-bold text-slate-900 lg:text-5xl'
            >
              Why Choose InterviewAI?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className='mx-auto max-w-2xl text-xl text-slate-600'
            >
              Join thousands of successful candidates who trust us
            </motion.p>
          </motion.div>

          <motion.div
            className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {whyChoose.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className='rounded-2xl bg-white/80 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-xl'
                whileHover={{ y: -10 }}
              >
                <motion.div
                  className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className='mb-3 text-xl font-bold text-slate-900'>
                  {item.title}
                </h3>
                <p className='text-slate-600'>{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='bg-slate-900 py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='mb-12 text-center'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2
              variants={itemVariants}
              className='mb-4 text-4xl font-bold text-white lg:text-5xl'
            >
              Trusted by Thousands
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className='mx-auto max-w-2xl text-xl text-slate-300'
            >
              Join our growing community of successful interview candidates
            </motion.p>
          </motion.div>

          <motion.div
            className='grid gap-8 md:grid-cols-3'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className='flex flex-col items-center gap-4 rounded-3xl bg-slate-800/50 p-10 backdrop-blur-sm'
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl'>
                  {stat.icon}
                </div>
                <div className='text-center'>
                  <motion.div
                    className='text-5xl font-bold text-white'
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className='mt-2 text-lg text-slate-300'>{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className='bg-gradient-to-r from-blue-50 to-purple-50 py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className='mb-6 text-3xl font-bold text-slate-900 lg:text-4xl'>
                Everything You Need to
                <span className='block text-blue-600'>Succeed</span>
              </h2>
              <motion.div
                className='space-y-4'
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true }}
                variants={containerVariants}
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className='flex items-start gap-3 rounded-lg bg-white/50 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-md'
                    whileHover={{ x: 10 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, type: 'spring' }}
                    >
                      <CheckCircle className='mt-0.5 h-6 w-6 flex-shrink-0 text-green-500' />
                    </motion.div>
                    <p className='text-slate-700'>{benefit}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className='relative'
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className='rounded-2xl bg-white p-8 shadow-xl'
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className='mb-6 flex items-center gap-4'
                  variants={floatingVariants}
                  initial='initial'
                  animate='animate'
                >
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'>
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
                </motion.div>

                <div className='space-y-3'>
                  <motion.div
                    className='flex justify-between rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-3'
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className='text-slate-600'>CV Analysis</span>
                    <span className='font-semibold text-green-600'>
                      ✓ Complete
                    </span>
                  </motion.div>

                  <motion.div
                    className='flex justify-between rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 p-3'
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className='text-slate-600'>Question Generation</span>
                    <span className='font-semibold text-blue-600'>
                      🤖 AI Powered
                    </span>
                  </motion.div>

                  <motion.div
                    className='flex justify-between rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-3'
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className='text-slate-600'>Performance Score</span>
                    <motion.span
                      className='font-semibold text-purple-600'
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6, type: 'spring' }}
                    >
                      85%
                    </motion.span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating decorative elements */}
              <motion.div
                className='absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 blur-2xl'
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className='absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-2xl'
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.3, 0.2, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}


        {/* Floating elements */}



    </div>
  );
};

export default Home;
