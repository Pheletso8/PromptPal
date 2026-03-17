/**
 * seed.ts — MongoDB Course Seeder
 *
 * Run this once to populate the database with the 4 starter courses.
 * Usage from backend/ directory:
 *   npx ts-node src/utils/seed.ts
 *
 * The script reads MONGO_URI from a .env file in the backend/ directory.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course';

dotenv.config();

const courses = [
  {
    title: 'Economic Management Sciences (EMS)',
    tag: 'EMS',
    description: 'Explore the world of business, budget, and entrepreneurship.',
    image: '',
    videoUrl: 'https://www.youtube.com/embed/rwF-X5STYks',
    whyLearn: 'Learn how money works and how to start your own successful business.',
    lessonTopic: 'The Business Mindset',
    passingThreshold: 70,
    templates: [
      { title: 'Business Plan AI', prompt: 'I want to sell [Product]. Help me make a budget.', icon: '💰' }
    ],
    assessment: {
      question: 'What is a business plan?',
      options: ['A map for business', 'A type of money', 'A lunch menu'],
      correctAnswer: 'A map for business'
    }
  },
  {
    title: 'Mathematics (Fun With Numbers)',
    tag: 'Mathematics',
    description: 'Master logic and problem solving with interactive AI math play.',
    image: '',
    videoUrl: 'https://www.youtube.com/embed/rwF-X5STYks',
    whyLearn: 'Unlock the secret language of the universe through numbers.',
    lessonTopic: 'Logic & Patterns',
    passingThreshold: 60,
    templates: [
      { title: 'Pattern Finder', prompt: 'Explain this math pattern: [Sequence].', icon: '🔢' }
    ],
    assessment: {
      question: 'What comes after 2, 4, 6...?',
      options: ['7', '8', '9'],
      correctAnswer: '8'
    }
  },
  {
    title: 'Social Science (Our World)',
    tag: 'Social Science',
    description: 'Travel through history and geography to understand our planet.',
    image: '',
    videoUrl: 'https://www.youtube.com/embed/rwF-X5STYks',
    whyLearn: 'Understand how people and places shape our history and future.',
    lessonTopic: 'History & Land',
    passingThreshold: 65,
    templates: [
      { title: 'Time Traveler', prompt: 'Tell me about life in [Year] in South Africa.', icon: '🌍' }
    ],
    assessment: {
      question: 'Who was Nelson Mandela?',
      options: ['A traveler', 'A president', 'A chef'],
      correctAnswer: 'A president'
    }
  },
  {
    title: 'Natural Science (The Explorer)',
    tag: 'Natural Science',
    description: 'Dive into biology, chemistry, and physics through fun simulations.',
    image: '',
    videoUrl: 'https://www.youtube.com/embed/rwF-X5STYks',
    whyLearn: 'Science helps us understand how everything from ants to stars works.',
    lessonTopic: 'Life & Matter',
    passingThreshold: 75,
    templates: [
      { title: 'Atom Explainer', prompt: 'Explain how atoms work using a lego analogy.', icon: '🧪' }
    ],
    assessment: {
      question: 'What do plants need to grow?',
      options: ['Sun and water', 'Chocolate', 'Laptops'],
      correctAnswer: 'Sun and water'
    }
  },
  {
    title: 'Technology (Future Builders)',
    tag: 'Technology',
    description: 'Design and build the future using modern tools and AI concepts.',
    image: '',
    videoUrl: 'https://www.youtube.com/embed/rwF-X5STYks',
    whyLearn: 'Coding and tech are the superpowers of the next generation.',
    lessonTopic: 'Design & Code',
    passingThreshold: 80,
    templates: [
      { title: 'Gadget Designer', prompt: 'Help me design a robot that can [Task].', icon: '🤖' }
    ],
    assessment: {
      question: 'What is code?',
      options: ['Instructions for computers', 'A secret handshake', 'A type of juice'],
      correctAnswer: 'Instructions for computers'
    }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ Connected to MongoDB');

    // Remove existing courses to avoid duplicates on re-run
    const deleted = await Course.deleteMany({});
    console.log(`🗑  Cleared ${deleted.deletedCount} existing course(s)`);

    const inserted = await Course.insertMany(courses);
    console.log(`🌱 Seeded ${inserted.length} courses:`);
    inserted.forEach(c => console.log(`   • ${c.title} [${c._id}]`));

    await mongoose.disconnect();
    console.log('✅ Done. You can now start the backend server.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seedDB();
