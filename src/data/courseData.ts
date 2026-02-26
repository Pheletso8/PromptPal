import ems from '../assets/ems.jfif';
import research from '../assets/research.jpg';
import science from '../assets/science.jfif';
import maths from '../assets/maths.jfif';

export const COURSES = [
  {
    id: 1,
    title: "AI for Maths Homework",
    tag: "Maths",
    image: maths,
    progress: 45,
    videoUrl: "https://www.youtube.com/embed/rwF-X5STYks", // Replace with your actual lesson video
    whyLearn: "Maths is about logic. Learning to prompt for Maths helps you break down complex word problems into solvable steps and understand the 'why' behind the formula.",
    lessonTopic: "The 'Step-by-Step' Logical Constraint",
    templates: [
      { 
        id: "m1", 
        title: "The Logic Tutor", 
        prompt: "Act as a friendly Grade 7 Maths tutor. I am struggling with this problem: [Insert Problem]. Do not give me the final answer. Instead, explain the mathematical rules I need to follow and give me a hint for the first step.", 
        icon: "🔢" 
      },
      { 
        id: "m2", 
        title: "Formula Decoder", 
        prompt: "Explain the [Insert Formula, e.g., Area of a Circle] as if I am 12 years old. Use an analogy involving a pizza or a sports field.", 
        icon: "📐" 
      }
    ],
    assessment: {
      question: "Why should you ask an AI for 'hints' rather than 'answers' in Maths?",
      options: [
        "Because AI is bad at calculation", 
        "To help your brain build the logical 'muscles' to solve it yourself", 
        "To make the homework take longer"
      ]
    }
  },
  {
    id: 2,
    title: "GenAI Research Masterclass",
    tag: "Research",
    image: research,
    progress: 10,
    videoUrl: "https://www.youtube.com/embed/rwF-X5STYks",
    whyLearn: "Research is about finding truth. AI can summarize 20-page documents into 5 bullet points, helping you find the most important facts for your school projects faster.",
    lessonTopic: "The 'Fact-Check' & Verification Method",
    templates: [
      { 
        id: "r1", 
        title: "The Fact Summariser", 
        prompt: "I am researching [Topic]. Please summarize the most important facts into a bulleted list suitable for a Grade 7 project. Include a 'Check Your Facts' section pointing out what I should verify.", 
        icon: "🔍" 
      },
      { 
        id: "r2", 
        title: "South African Source Finder", 
        prompt: "I need to find information about [Topic] specifically in a South African context. Suggest 3 types of local websites or organisations I should look for to get accurate data.", 
        icon: "🇿🇦" 
      }
    ],
    assessment: {
      question: "What is a 'Hallucination' in AI Research?",
      options: [
        "When the AI uses too many emojis", 
        "When the AI confidently gives you a fact that is actually false", 
        "When the computer screen gets blurry"
      ]
    }
  },
  {
    id: 3,
    title: "Natural Sciences Assistant",
    tag: "Science",
    image: science,
    progress: 0,
    videoUrl: "https://www.youtube.com/embed/rwF-X5STYks",
    whyLearn: "Science is the study of how the world works. Using AI in Science allows you to simulate experiments and visualize invisible things like atoms or energy flow.",
    lessonTopic: "The 'Analogy' Prompting Technique",
    templates: [
      { 
        id: "s1", 
        title: "The Science Simulator", 
        prompt: "Explain the process of [Scientific Process, e.g., Photosynthesis] but describe it like a busy factory. Tell me what the 'raw materials' are and what the 'finished products' are.", 
        icon: "🧪" 
      },
      { 
        id: "s2", 
        title: "Practical Experiment Guide", 
        prompt: "I want to do a safe home experiment to learn about [Concept, e.g., Acids and Bases]. Suggest an experiment using only kitchen items, and explain the science behind what happens.", 
        icon: "🌋" 
      }
    ],
    assessment: {
      question: "How does using an analogy (like a factory) help in Science prompting?",
      options: [
        "It makes the AI work faster", 
        "It helps turn invisible scientific concepts into something easy to imagine", 
        "It's just for fun and doesn't help learning"
      ]
    }
  },
  {
    id: 4,
    title: "EMS: Future Economics",
    tag: "EMS",
    image: ems,
    progress: 0,
    videoUrl: "https://www.youtube.com/embed/rwF-X5STYks",
    whyLearn: "Economic and Management Sciences teach you about money, business, and the economy. AI can help you model a small business or understand how global markets affect South Africa.",
    lessonTopic: "The 'Business Persona' Prompt",
    templates: [
      { 
        id: "e1", 
        title: "The Entrepreneur Coach", 
        prompt: "Act as a successful South African business owner. I want to start a small business selling [Product/Service] at my school. Help me create a simple budget and a marketing plan that appeals to 13-year-olds.", 
        icon: "💰" 
      },
      { 
        id: "e2", 
        title: "Financial Literacy Helper", 
        prompt: "Explain the difference between 'Needs' and 'Wants' in a household budget. Give me 3 examples of each that a typical South African family might have.", 
        icon: "📊" 
      }
    ],
    assessment: {
      question: "In EMS, what does 'Persona' prompting mean?",
      options: [
        "Asking the AI to talk like a specific type of person, like an accountant or CEO", 
        "Asking the AI to write a poem about money", 
        "Checking your personal bank balance"
      ]
    }
  }
];