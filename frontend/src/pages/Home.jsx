import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Brain,
  Check,
  Code2,
  FileText,
  MessageSquareText,
  Mic,
  MonitorUp,
  PhoneOff,
  Play,
  Radio,
  ScreenShare,
  Sparkles,
  Timer,
  Users,
  Video,
  Volume2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const features = [
  {
    icon: Brain,
    title: 'AI Mock Interviews',
    description:
      'Role-aware practice sessions that adapt to your resume, target role, and seniority.',
  },
  {
    icon: FileText,
    title: 'Resume Based Questions',
    description:
      'Turn real experience into sharp technical, behavioral, and project questions.',
  },
  {
    icon: BarChart3,
    title: 'Detailed AI Feedback',
    description:
      'Receive structured scoring across clarity, confidence, relevance, and completeness.',
  },
  {
    icon: Volume2,
    title: 'Voice Analysis',
    description:
      'Improve pacing, filler words, tone, and communication quality before the real call.',
  },
  {
    icon: Code2,
    title: 'Coding Round',
    description:
      'Practice technical screens with targeted prompts and actionable improvement notes.',
  },
  {
    icon: MessageSquareText,
    title: 'Behavioral Round',
    description:
      'Refine STAR answers, leadership examples, and concise executive communication.',
  },
];

const steps = [
  { title: 'Upload resume', text: 'Give the AI context about your work, skills, and goals.', icon: MonitorUp },
  { title: 'Start the session', text: 'Practice in a realistic interview room with live prompts.', icon: Video },
  { title: 'Review feedback', text: 'Get clear next steps, strengths, and weak spots after each round.', icon: BadgeCheck },
];

const Home = () => {
  motion;

  return (
    <div className='relative overflow-hidden'>
      <section className='relative px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24'>
        <div className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:42px_42px]' />
        <motion.div
          className='absolute right-10 top-24 -z-10 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl'
          animate={{ y: [-10, 14, -10], scale: [1, 1.05, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className='absolute bottom-20 left-10 -z-10 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl'
          animate={{ y: [12, -12, 12], scale: [1.04, 1, 1.04] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className='mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.92fr]'>
          <motion.div initial='hidden' animate='visible' variants={stagger}>
            <motion.div variants={fadeUp}>
              <Badge className='mb-6 gap-2 rounded-full border-indigo-200 bg-white/80 px-4 py-2 text-indigo-700 shadow-sm'>
                <Sparkles className='h-4 w-4' />
                AI interview practice for serious candidates
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className='max-w-4xl text-5xl font-bold leading-[0.95] tracking-tight text-slate-950 sm:text-6xl lg:text-[72px]'
            >
              Master Your Next
              <span className='block bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 bg-clip-text text-transparent'>
                Job Interview
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className='mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl'
            >
              Practice AI-powered interviews, receive instant feedback, improve
              communication, confidence and technical skills with your personal
              AI interviewer.
            </motion.p>

            <motion.div variants={fadeUp} className='mt-9 flex flex-col gap-3 sm:flex-row'>
              <SignedIn>
                <Button asChild variant='gradient' size='lg' className='h-14 px-8'>
                  <Link to='/form'>
                    Start Interview Now
                    <ArrowRight className='h-5 w-5' />
                  </Link>
                </Button>
              </SignedIn>
              <SignedOut>
                <SignInButton mode='modal'>
                  <Button variant='gradient' size='lg' className='h-14 px-8'>
                    Start Interview Now
                    <ArrowRight className='h-5 w-5' />
                  </Button>
                </SignInButton>
              </SignedOut>
              <Button variant='outline' size='lg' className='h-14 px-8'>
                <Play className='h-5 w-5' />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className='mt-8 flex flex-wrap gap-3'>
              {['AI Powered', 'Instant Feedback', '24/7 Practice'].map(label => (
                <div
                  key={label}
                  className='flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur'
                >
                  <Check className='h-4 w-4 text-indigo-600' />
                  {label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className='relative'
          >
            <div className='absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-blue-500/15 blur-2xl' />
            <Card className='relative overflow-hidden border-white/70 bg-slate-950 text-white shadow-2xl shadow-slate-300/70'>
              <CardContent className='p-0'>
                <div className='flex items-center justify-between border-b border-white/10 bg-white/10 px-5 py-4 backdrop-blur'>
                  <div className='flex items-center gap-3'>
                    <span className='flex h-2.5 w-2.5 rounded-full bg-red-400' />
                    <span className='flex h-2.5 w-2.5 rounded-full bg-amber-300' />
                    <span className='flex h-2.5 w-2.5 rounded-full bg-emerald-400' />
                  </div>
                  <div className='flex items-center gap-3 text-xs font-medium text-white/75'>
                    <span className='flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-red-100'>
                      <Radio className='h-3.5 w-3.5' />
                      Live
                    </span>
                    <span className='flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1'>
                      <Timer className='h-3.5 w-3.5' />
                      12:48
                    </span>
                  </div>
                </div>

                <div className='relative p-4 sm:p-6'>
                  <motion.div
                    className='absolute right-8 top-8 h-28 w-28 rounded-full bg-indigo-500/30 blur-3xl'
                    animate={{ opacity: [0.35, 0.7, 0.35] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className='relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.34),transparent_28%),linear-gradient(135deg,#111827,#020617)] p-5'>
                    <div className='flex h-full min-h-[320px] flex-col justify-between'>
                      <div className='flex items-start justify-between'>
                        <div>
                          <p className='text-sm text-white/55'>Candidate video</p>
                          <h3 className='mt-1 text-2xl font-semibold'>Alex Morgan</h3>
                        </div>
                        <span className='rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100'>
                          Strong connection
                        </span>
                      </div>

                      <div className='mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl'>
                        <Users className='h-12 w-12 text-white/80' />
                      </div>

                      <div className='flex items-end justify-between gap-4'>
                        <div className='flex items-center gap-2 rounded-full bg-black/30 px-3 py-2 text-sm text-white/75 backdrop-blur'>
                          <Mic className='h-4 w-4 text-emerald-300' />
                          Listening
                        </div>
                        <motion.div
                          className='w-36 rounded-2xl border border-white/15 bg-white/15 p-3 shadow-2xl backdrop-blur-xl sm:w-44'
                          animate={{ y: [-4, 5, -4] }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <div className='mb-9 flex items-center justify-between'>
                            <span className='text-xs text-white/60'>AI interviewer</span>
                            <Video className='h-4 w-4 text-indigo-200' />
                          </div>
                          <div className='flex items-center gap-2'>
                            <div className='flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500'>
                              <Sparkles className='h-4 w-4' />
                            </div>
                            <div className='h-2 flex-1 rounded-full bg-white/25'>
                              <div className='h-2 w-2/3 rounded-full bg-gradient-to-r from-indigo-300 to-blue-300' />
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  <div className='mt-5 grid grid-cols-4 gap-3'>
                    {[
                      { icon: Mic, label: 'Mute' },
                      { icon: Video, label: 'Camera' },
                      { icon: ScreenShare, label: 'Share' },
                      { icon: PhoneOff, label: 'End' },
                    ].map(({ icon: Icon, label }) => {
                      Icon;

                      return (
                        <button
                          key={label}
                          className={`flex h-14 flex-col items-center justify-center gap-1 rounded-2xl border text-xs font-medium transition-all duration-300 hover:-translate-y-1 ${
                            label === 'End'
                              ? 'border-red-400/20 bg-red-500 text-white hover:bg-red-400'
                              : 'border-white/10 bg-white/10 text-white/75 hover:bg-white/15 hover:text-white'
                          }`}
                        >
                          <Icon className='h-4 w-4' />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section id='features' className='px-4 py-20 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          <div className='mb-12 max-w-3xl'>
            <Badge className='mb-4 rounded-full bg-indigo-50 px-3 py-1 text-indigo-700'>Features</Badge>
            <h2 className='text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl'>
              Everything a modern candidate needs to improve quickly.
            </h2>
          </div>
          <motion.div
            className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            {features.map(({ icon: Icon, title, description }) => {
              Icon;

              return (
                <motion.div key={title} variants={fadeUp}>
                  <Card className='h-full bg-white/85'>
                    <CardHeader>
                      <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 text-white shadow-lg shadow-indigo-200'>
                        <Icon className='h-6 w-6' />
                      </div>
                      <CardTitle>{title}</CardTitle>
                      <CardDescription className='text-base leading-7'>{description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section id='how-it-works' className='border-y border-slate-200/80 bg-slate-50/80 px-4 py-20 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          <div className='grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-center'>
            <div>
              <Badge className='mb-4 rounded-full bg-white px-3 py-1 text-slate-700'>How it works</Badge>
              <h2 className='text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl'>
                A focused workflow from resume to measurable progress.
              </h2>
            </div>
            <div className='grid gap-4'>
              {steps.map(({ title, text, icon: Icon }, index) => {
                Icon;

                return (
                  <Card key={title} className='bg-white'>
                    <CardContent className='flex gap-5 p-6 sm:p-7'>
                      <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white'>
                        <Icon className='h-5 w-5' />
                      </div>
                      <div>
                        <p className='text-sm font-semibold text-indigo-600'>Step {index + 1}</p>
                        <h3 className='mt-1 text-xl font-semibold text-slate-950'>{title}</h3>
                        <p className='mt-2 text-slate-600'>{text}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id='pricing' className='px-4 py-20 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          <Card className='overflow-hidden border-slate-200 bg-white'>
            <CardContent className='grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center'>
              <div>
                <Badge className='mb-4 rounded-full bg-indigo-50 px-3 py-1 text-indigo-700'>Pricing</Badge>
                <h2 className='text-3xl font-bold text-slate-950 sm:text-4xl'>
                  Start practicing with a premium AI interview workspace.
                </h2>
                <p className='mt-4 max-w-2xl text-lg text-slate-600'>
                  Built for repeat practice, resume-aware questions, and feedback that turns each session into progress.
                </p>
              </div>
              <Button asChild variant='gradient' size='lg' className='h-14 px-8'>
                <Link to='/form'>
                  Start Interview
                  <ArrowRight className='h-5 w-5' />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
