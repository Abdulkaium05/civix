import React, { useState } from 'react';
import { translations, Language } from '../constants';
import { Microscope, Construction, Info, ChevronRight, CheckCircle2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

interface Test {
  name: string;
  bnName: string;
  description: string;
  bnDescription: string;
  steps: string[];
  bnSteps: string[];
}

interface Material {
  id: string;
  name: string;
  bnName: string;
  icon: string;
  labTests: Test[];
  fieldTests: Test[];
}

const MATERIALS: Material[] = [
  {
    id: 'cement',
    name: 'Cement',
    bnName: 'সিমেন্ট',
    icon: 'https://picsum.photos/seed/cement-bag/100/100',
    labTests: [
      {
        name: 'Consistency Test',
        bnName: 'কনসিস্টেন্সি টেস্ট',
        description: 'To find the amount of water needed to make a standard cement paste.',
        bnDescription: 'সিমেন্টের স্ট্যান্ডার্ড পেস্ট তৈরির জন্য প্রয়োজনীয় পানির পরিমাণ নির্ণয় করা।',
        steps: [
          'Take 300g of cement and place it in a tray.',
          'Add a measured quantity of water (initially 25% by weight).',
          'Mix thoroughly for 3-5 minutes to get a uniform paste.',
          'Fill the Vicat mold and place it under the plunger.',
          'Release the plunger and record the penetration depth.',
          'Repeat with different water percentages until penetration is 5-7mm from the bottom.'
        ],
        bnSteps: [
          '৩০০ গ্রাম সিমেন্ট একটি ট্রেতে নিন।',
          'পরিমিত পানি যোগ করুন (শুরুতে ওজনের ২৫%)।',
          '৩-৫ মিনিট ভালোভাবে মিশিয়ে একটি সুষম পেস্ট তৈরি করুন।',
          'ভাইকাট মোল্ড পূর্ণ করুন এবং প্লাঞ্জারের নিচে রাখুন।',
          'প্লাঞ্জারটি ছেড়ে দিন এবং পেনিট্রেশন ডেপথ রেকর্ড করুন।',
          'পানির পরিমাণ পরিবর্তন করে পুনরায় পরীক্ষা করুন যতক্ষণ না পেনিট্রেশন নিচ থেকে ৫-৭ মিমি হয়।'
        ]
      },
      {
        name: 'Setting Time Test',
        bnName: 'সেটিং টাইম টেস্ট',
        description: 'To determine initial and final setting time of cement.',
        bnDescription: 'সিমেন্টের প্রাথমিক এবং চূড়ান্ত সেটিং টাইম নির্ণয় করা।',
        steps: [
          'Prepare a cement paste with 0.85 times the water required for standard consistency.',
          'Fill the Vicat mold and place it on a non-porous plate.',
          'Initial Setting: Use the 1mm square needle. It should not penetrate more than 5mm from the bottom.',
          'Final Setting: Use the needle with an annular attachment. It should leave a mark but the attachment should not.'
        ],
        bnSteps: [
          'স্ট্যান্ডার্ড কনসিস্টেন্সির ০.৮৫ গুণ পানি দিয়ে সিমেন্ট পেস্ট তৈরি করুন।',
          'ভাইকাট মোল্ড পূর্ণ করুন এবং একটি নন-পোরাস প্লেটের ওপর রাখুন।',
          'প্রাথমিক সেটিং: ১ মিমি বর্গাকার নিডল ব্যবহার করুন। এটি নিচ থেকে ৫ মিমি এর বেশি প্রবেশ করা উচিত নয়।',
          'চূড়ান্ত সেটিং: অ্যানুলার অ্যাটাচমেন্ট সহ নিডল ব্যবহার করুন। এটি দাগ কাটবে কিন্তু অ্যাটাচমেন্টটি নয়।'
        ]
      }
    ],
    fieldTests: [
      {
        name: 'Color Test',
        bnName: 'রঙ পরীক্ষা',
        description: 'Cement should be uniform greenish-grey in color.',
        bnDescription: 'সিমেন্টের রঙ অভিন্ন সবুজাভ-ধূসর হওয়া উচিত।',
        steps: [
          'Open a fresh bag of cement.',
          'Take a handful of cement and observe the color in daylight.',
          'The color should be a uniform greenish-grey.',
          'Check for any discoloration or dark spots which indicate impurities.'
        ],
        bnSteps: [
          'সিমেন্টের একটি নতুন ব্যাগ খুলুন।',
          'এক মুঠো সিমেন্ট নিন এবং দিনের আলোতে রঙ পর্যবেক্ষণ করুন।',
          'রঙটি অভিন্ন সবুজাভ-ধূসর হওয়া উচিত।',
          'কোনো বিবর্ণতা বা কালো দাগ আছে কি না পরীক্ষা করুন যা অপদ্রব্যের উপস্থিতি নির্দেশ করে।'
        ]
      },
      {
        name: 'Lump Test',
        bnName: 'দলা পরীক্ষা',
        description: 'Check for the presence of hard lumps in the cement bag.',
        bnDescription: 'সিমেন্টের ব্যাগে শক্ত দলার উপস্থিতি পরীক্ষা করা।',
        steps: [
          'Insert your hand into the cement bag.',
          'Feel for any hard lumps or grit.',
          'The cement should feel smooth and cool to the touch.',
          'Small lumps that can be crushed with fingers are acceptable, but hard ones are not.'
        ],
        bnSteps: [
          'সিমেন্টের ব্যাগের ভেতর হাত ঢুকিয়ে দিন।',
          'কোনো শক্ত দলা বা বালুকণা অনুভব করুন।',
          'সিমেন্ট স্পর্শে মসৃণ এবং ঠান্ডা অনুভূত হওয়া উচিত।',
          'আঙুল দিয়ে গুঁড়ো করা যায় এমন ছোট দলা গ্রহণযোগ্য, কিন্তু শক্ত দলা নয়।'
        ]
      }
    ]
  },
  {
    id: 'sand',
    name: 'Sand (Fine Aggregate)',
    bnName: 'বালু',
    icon: 'https://picsum.photos/seed/sand-pile/100/100',
    labTests: [
      {
        name: 'Sieve Analysis',
        bnName: 'সিভ অ্যানালাইসিস',
        description: 'To determine the particle size distribution of sand.',
        bnDescription: 'বালুর কণার আকারের বিন্যাস নির্ণয় করা।',
        steps: [
          'Take 500g of dry sand sample.',
          'Arrange the sieves in descending order (4.75mm, 2.36mm, 1.18mm, 600µ, 300µ, 150µ).',
          'Place the sand on the top sieve and shake manually or mechanically for 10-15 minutes.',
          'Weigh the material retained on each sieve.',
          'Calculate the cumulative percentage retained and Fineness Modulus (FM).'
        ],
        bnSteps: [
          '৫০০ গ্রাম শুকনো বালুর নমুনা নিন।',
          'চালনিগুলো বড় থেকে ছোট ক্রমে সাজান (৪.৭৫ মিমি, ২.৩৬ মিমি, ১.১৮ মিমি, ৬০০µ, ৩০০µ, ১৫০µ)।',
          'বালু উপরের চালনিতে দিন এবং ১০-১৫ মিনিট ঝাঁকান।',
          'প্রতিটি চালনিতে আটকে থাকা বালুর ওজন নিন।',
          'কিউমুলেটিভ পার্সেন্টেজ এবং ফাইননেস মডুলাস (FM) গণনা করুন।'
        ]
      },
      {
        name: 'Silt Content Test',
        bnName: 'সিল্ট কন্টেন্ট টেস্ট',
        description: 'To find the percentage of silt in sand.',
        bnDescription: 'বালুতে পলি বা সিল্টের পরিমাণ নির্ণয় করা।',
        steps: [
          'Fill a measuring cylinder with sand up to 50ml.',
          'Add salt water solution up to 100ml.',
          'Shake the cylinder vigorously and let it settle for 3 hours.',
          'The silt layer will settle on top of the sand.',
          'Measure the height of the silt layer (V1) and sand layer (V2).',
          'Silt % = (V1/V2) * 100. Should not exceed 8%.'
        ],
        bnSteps: [
          'একটি মেজারিং সিলিন্ডার ৫০ মিলি পর্যন্ত বালু দিয়ে পূর্ণ করুন।',
          '১০০ মিলি পর্যন্ত লবণ-পানির দ্রবণ যোগ করুন।',
          'সিলিন্ডারটি জোরে ঝাঁকান এবং ৩ ঘণ্টা স্থির হতে দিন।',
          'বালুর উপরে সিল্টের একটি স্তর জমা হবে।',
          'সিল্ট স্তর (V1) এবং বালু স্তরের (V2) উচ্চতা পরিমাপ করুন।',
          'সিল্ট % = (V1/V2) * ১০০। এটি ৮% এর বেশি হওয়া উচিত নয়।'
        ]
      }
    ],
    fieldTests: [
      {
        name: 'Rubbing Test',
        bnName: 'ঘর্ষণ পরীক্ষা',
        description: 'To check for clay or silt presence in the field.',
        bnDescription: 'মাঠে কাদা বা সিল্টের উপস্থিতি পরীক্ষা করা।',
        steps: [
          'Take a small amount of wet sand in your palm.',
          'Rub it vigorously with your other hand.',
          'If your palm remains clean, the sand is good.',
          'If your palm becomes dirty or stained, it contains excess clay or silt.'
        ],
        bnSteps: [
          'হাতের তালুতে অল্প পরিমাণ ভেজা বালু নিন।',
          'অন্য হাত দিয়ে এটি জোরে ঘষুন।',
          'যদি আপনার তালু পরিষ্কার থাকে, তবে বালু ভালো।',
          'যদি তালু নোংরা বা দাগযুক্ত হয়, তবে এতে অতিরিক্ত কাদা বা সিল্ট আছে।'
        ]
      }
    ]
  },
  {
    id: 'reinforcement',
    name: 'Reinforcement (Steel)',
    bnName: 'রড (স্টিল)',
    icon: 'https://picsum.photos/seed/steel-rods/100/100',
    labTests: [
      {
        name: 'Tensile Strength Test',
        bnName: 'টেনসাইল স্ট্রেন্থ টেস্ট',
        description: 'To determine the yield strength and ultimate strength of steel.',
        bnDescription: 'স্টিলের ইল্ড স্ট্রেন্থ এবং আল্টিমেট স্ট্রেন্থ নির্ণয় করা।',
        steps: [
          'Cut a standard length of the steel bar (usually 600mm).',
          'Mark the gauge length on the bar.',
          'Fix the bar in the Universal Testing Machine (UTM).',
          'Apply gradual tensile load until the bar breaks.',
          'Record the yield load, ultimate load, and elongation percentage.'
        ],
        bnSteps: [
          'স্টিল বারের একটি স্ট্যান্ডার্ড দৈর্ঘ্য কাটুন (সাধারণত ৬০০ মিমি)।',
          'বারের ওপর গেজ লেন্থ মার্ক করুন।',
          'বারটি ইউনিভার্সাল টেস্টিং মেশিনে (UTM) স্থাপন করুন।',
          'বারটি না ভাঙা পর্যন্ত ধীরে ধীরে টেনসাইল লোড প্রয়োগ করুন।',
          'ইল্ড লোড, আল্টিমেট লোড এবং ইলংগেশন পার্সেন্টেজ রেকর্ড করুন।'
        ]
      }
    ],
    fieldTests: [
      {
        name: 'Bend and Re-bend Test',
        bnName: 'বেন্ড এবং রি-বেন্ড টেস্ট',
        description: 'To check the ductility and crack resistance of steel.',
        bnDescription: 'স্টিলের নমনীয়তা এবং ফাটল প্রতিরোধ ক্ষমতা পরীক্ষা করা।',
        steps: [
          'Bend the bar to 180 degrees using a mandrel.',
          'Check for any cracks on the outer surface.',
          'For re-bend: Bend to 135 degrees, keep in boiling water for 30 mins, then bend back to 157.5 degrees.',
          'No cracks should appear.'
        ],
        bnSteps: [
          'একটি ম্যান্ড্রেল ব্যবহার করে বারটি ১৮০ ডিগ্রি বাঁকান।',
          'বাইরের পৃষ্ঠে কোনো ফাটল আছে কি না পরীক্ষা করুন।',
          'রি-বেন্ডের জন্য: ১৩৫ ডিগ্রি বাঁকান, ৩০ মিনিট ফুটন্ত পানিতে রাখুন, তারপর ১৫৭.৫ ডিগ্রি পর্যন্ত ফিরিয়ে আনুন।',
          'কোনো ফাটল দেখা দেওয়া উচিত নয়।'
        ]
      }
    ]
  },
  {
    id: 'aggregate',
    name: 'Aggregate (Stone/Chips)',
    bnName: 'এগ্রিগেট (খোয়া/পাথর)',
    icon: 'https://picsum.photos/seed/stone-aggregate/100/100',
    labTests: [
      {
        name: 'Crushing Value Test',
        bnName: 'ক্রাশিং ভ্যালু টেস্ট',
        description: 'To determine the resistance of aggregate to crushing under load.',
        bnDescription: 'লোডের নিচে এগ্রিগেটের চূর্ণ হওয়ার প্রতিরোধ ক্ষমতা নির্ণয় করা।',
        steps: [
          'Fill the cylinder with aggregate in 3 layers, tamping each 25 times.',
          'Place the cylinder in the compression machine.',
          'Apply a load of 40 tons at a rate of 4 tons per minute.',
          'Sieve the crushed material through 2.36mm sieve.',
          'Crushing value = (Weight of crushed material / Total weight) * 100.'
        ],
        bnSteps: [
          'সিলিন্ডারটি ৩ স্তরে এগ্রিগেট দিয়ে পূর্ণ করুন, প্রতি স্তরে ২৫ বার ট্যাম্পিং করুন।',
          'সিলিন্ডারটি কমপ্রেশন মেশিনে রাখুন।',
          'প্রতি মিনিটে ৪ টন হারে মোট ৪০ টন লোড প্রয়োগ করুন।',
          'চূর্ণ হওয়া অংশ ২.৩৬ মিমি চালনি দিয়ে চালুন।',
          'ক্রাশিং ভ্যালু = (চূর্ণ হওয়া অংশের ওজন / মোট ওজন) * ১০০।'
        ]
      }
    ],
    fieldTests: [
      {
        name: 'Impact Test (Field)',
        bnName: 'ইমপ্যাক্ট টেস্ট (ফিল্ড)',
        description: 'To check the toughness of aggregate.',
        bnDescription: 'এগ্রিগেটের টাফনেস বা দৃঢ়তা পরীক্ষা করা।',
        steps: [
          'Take a few pieces of aggregate.',
          'Hit them with a hammer.',
          'Good aggregate should not break easily into small pieces.',
          'It should produce a metallic sound when struck.'
        ],
        bnSteps: [
          'কয়েকটি এগ্রিগেট নিন।',
          'হাতুড়ি দিয়ে সেগুলোতে আঘাত করুন।',
          'ভালো এগ্রিগেট সহজে ছোট ছোট টুকরো হয়ে ভেঙে যাবে না।',
          'আঘাত করলে ধাতব শব্দ হওয়া উচিত।'
        ]
      }
    ]
  },
  {
    id: 'bricks',
    name: 'Bricks',
    bnName: 'ইট',
    icon: 'https://picsum.photos/seed/bricks-pile/100/100',
    labTests: [
      {
        name: 'Water Absorption Test',
        bnName: 'পানি শোষণ পরীক্ষা',
        description: 'To check the percentage of water absorbed by the brick.',
        bnDescription: 'ইট কত শতাংশ পানি শোষণ করে তা পরীক্ষা করা।',
        steps: [
          'Take 5 bricks and dry them in an oven at 105°C.',
          'Weight the dry bricks (W1).',
          'Immerse the bricks in clean water for 24 hours.',
          'Remove the bricks, wipe with a damp cloth, and weigh again (W2).',
          'Absorption % = [(W2 - W1) / W1] * 100. For 1st class brick, it should be < 20%.'
        ],
        bnSteps: [
          '৫টি ইট নিন এবং ১০৫°C তাপমাত্রায় ওভেনে শুকিয়ে নিন।',
          'শুকনো ইটের ওজন নিন (W1)।',
          'ইটগুলো ২৪ ঘণ্টা পরিষ্কার পানিতে ডুবিয়ে রাখুন।',
          'ইটগুলো তুলে ভেজা কাপড় দিয়ে মুছে পুনরায় ওজন নিন (W2)।',
          'শোষণ % = [(W2 - W1) / W1] * ১০০। প্রথম শ্রেণির ইটের জন্য এটি ২০% এর কম হওয়া উচিত।'
        ]
      }
    ],
    fieldTests: [
      {
        name: 'Soundness Test',
        bnName: 'শব্দ পরীক্ষা',
        description: 'Two bricks should produce a clear metallic ringing sound when struck.',
        bnDescription: 'দুটি ইট একসাথে আঘাত করলে পরিষ্কার ধাতব শব্দ হওয়া উচিত।',
        steps: [
          'Take two bricks, one in each hand.',
          'Strike them against each other firmly.',
          'A clear metallic ringing sound indicates a good quality brick.',
          'A dull or thud sound indicates poor quality or internal cracks.'
        ],
        bnSteps: [
          'দুই হাতে দুটি ইট নিন।',
          'একে অপরের সাথে জোরে আঘাত করুন।',
          'পরিষ্কার ধাতব শব্দ ভালো মানের ইট নির্দেশ করে।',
          'ভোঁতা শব্দ নিম্নমানের বা অভ্যন্তরীণ ফাটল নির্দেশ করে।'
        ]
      }
    ]
  },
  {
    id: 'concrete',
    name: 'Concrete',
    bnName: 'কংক্রিট',
    icon: 'https://picsum.photos/seed/concrete-mixer/100/100',
    labTests: [
      {
        name: 'Compressive Strength Test',
        bnName: 'কম্প্রেসিভ স্ট্রেন্থ টেস্ট',
        description: 'To find the strength of concrete cubes or cylinders.',
        bnDescription: 'কংক্রিট কিউব বা সিলিন্ডারের শক্তি নির্ণয় করা।',
        steps: [
          'Prepare concrete mix and fill 150mm x 150mm x 150mm molds in 3 layers.',
          'Tamp each layer 35 times with a standard tamping rod.',
          'Remove molds after 24 hours and place cubes in a curing tank.',
          'Test the cubes at 7, 14, and 28 days using a Compression Testing Machine (CTM).',
          'Apply load at 140 kg/cm²/min until failure.'
        ],
        bnSteps: [
          'কংক্রিট মিক্স তৈরি করুন এবং ১৫০মিমি x ১৫০মিমি x ১৫০মিমি মোল্ড ৩ স্তরে পূর্ণ করুন।',
          'প্রতি স্তরে স্ট্যান্ডার্ড ট্যাম্পিং রড দিয়ে ৩৫ বার ট্যাম্পিং করুন।',
          '২৪ ঘণ্টা পর মোল্ড খুলে কিউবগুলো কিউরিং ট্যাংকে রাখুন।',
          '৭, ১৪ এবং ২৮ দিন পর কমপ্রেশন টেস্টিং মেশিনে (CTM) কিউবগুলো পরীক্ষা করুন।',
          'ব্যর্থ না হওয়া পর্যন্ত প্রতি মিনিটে ১৪০ কেজি/সেমি² হারে লোড প্রয়োগ করুন।'
        ]
      }
    ],
    fieldTests: [
      {
        name: 'Slump Test',
        bnName: 'স্লাম্প টেস্ট',
        description: 'To check the workability of fresh concrete.',
        bnDescription: 'তাজা কংক্রিটের ওয়ার্কাবিলিটি পরীক্ষা করা।',
        steps: [
          'Clean the internal surface of the slump cone.',
          'Place the cone on a level, non-absorbent surface.',
          'Fill the cone in 4 layers, tamping each layer 25 times.',
          'Remove excess concrete and lift the cone slowly and vertically.',
          'Measure the difference in height between the cone and the highest point of the slumped concrete.'
        ],
        bnSteps: [
          'স্লাম্প কোনের অভ্যন্তরীণ পৃষ্ঠ পরিষ্কার করুন।',
          'কোনটি একটি সমতল এবং পানি শোষণ করে না এমন পৃষ্ঠে রাখুন।',
          'কোনটি ৪ স্তরে পূর্ণ করুন, প্রতি স্তরে ২৫ বার ট্যাম্পিং করুন।',
          'অতিরিক্ত কংক্রিট সরিয়ে ফেলুন এবং কোনটি ধীরে ধীরে উল্লম্বভাবে তুলুন।',
          'কোনের উচ্চতা এবং কংক্রিটের সর্বোচ্চ বিন্দুর উচ্চতার পার্থক্য পরিমাপ করুন।'
        ]
      }
    ]
  }
];

export default function TestsTab({ lang }: { lang: Language }) {
  const t = translations[lang];
  const [activeMaterial, setActiveMaterial] = useState<Material>(MATERIALS[0]);
  const [activeTestType, setActiveTestType] = useState<'lab' | 'field'>('lab');
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});

  const generateTestImage = async (test: Test) => {
    const testId = `${activeMaterial.id}-${test.name}`;
    setLoadingImages(prev => ({ ...prev, [testId]: true }));

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `A professional, high-quality technical illustration of a civil engineering material test: ${test.name}. Description: ${test.description}. Show the equipment and procedure clearly in a laboratory or field setting.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (imagePart?.inlineData) {
        const imageUrl = `data:image/png;base64,${imagePart.inlineData.data}`;
        setGeneratedImages(prev => ({ ...prev, [testId]: imageUrl }));
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoadingImages(prev => ({ ...prev, [testId]: false }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{t.tests}</h2>
          <p className="text-slate-500">
            {lang === 'bn' 
              ? 'সিভিল ইঞ্জিনিয়ারিং মালামালের ল্যাব এবং ফিল্ড টেস্ট পদ্ধতি' 
              : 'Lab and Field testing methods for civil engineering materials'}
          </p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {MATERIALS.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMaterial(m)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${
              activeMaterial.id === m.id 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <img src={m.icon} alt={m.name} className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
            {lang === 'bn' ? m.bnName : m.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <button
              onClick={() => setActiveTestType('lab')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTestType === 'lab' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Microscope size={20} />
              {lang === 'bn' ? 'ল্যাব টেস্ট' : 'Lab Tests'}
            </button>
            <button
              onClick={() => setActiveTestType('field')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTestType === 'field' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Construction size={20} />
              {lang === 'bn' ? 'ফিল্ড টেস্ট' : 'Field Tests'}
            </button>
          </div>

          <div className="bg-emerald-900 text-white p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400">
              <Info size={20} />
              <h4 className="font-bold uppercase text-xs tracking-widest">Pro Tip</h4>
            </div>
            <p className="text-sm text-emerald-100 leading-relaxed">
              {lang === 'bn' 
                ? 'মালামালের গুণগত মান নিশ্চিত করতে সবসময় আইএস (IS) বা এএসটিএম (ASTM) স্ট্যান্ডার্ড অনুসরণ করুন।' 
                : 'Always follow IS or ASTM standards to ensure the quality of construction materials.'}
            </p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeMaterial.id}-${activeTestType}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {(activeTestType === 'lab' ? activeMaterial.labTests : activeMaterial.fieldTests).map((test, i) => {
                const testId = `${activeMaterial.id}-${test.name}`;
                const isGenerating = loadingImages[testId];
                const generatedImage = generatedImages[testId];

                return (
                  <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="md:w-2/5 h-64 md:h-auto overflow-hidden bg-slate-100 flex items-center justify-center relative group">
                      {generatedImage ? (
                        <img 
                          src={generatedImage} 
                          alt={test.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-center p-8 space-y-4">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-slate-400">
                            {isGenerating ? (
                              <Loader2 className="animate-spin" size={32} />
                            ) : (
                              <ImageIcon size={32} />
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-600">
                              {lang === 'bn' ? 'কোনো ছবি নেই' : 'No illustration yet'}
                            </p>
                            <button
                              onClick={() => generateTestImage(test)}
                              disabled={isGenerating}
                              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-50"
                            >
                              {isGenerating 
                                ? (lang === 'bn' ? 'তৈরি হচ্ছে...' : 'Generating...') 
                                : (lang === 'bn' ? 'AI দিয়ে ছবি তৈরি করুন' : 'Generate AI Illustration')}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {generatedImage && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => generateTestImage(test)}
                            disabled={isGenerating}
                            className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                          >
                            {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
                            {lang === 'bn' ? 'পুনরায় তৈরি করুন' : 'Regenerate'}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="md:w-3/5 p-8 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-wider">
                        <CheckCircle2 size={16} />
                        {activeTestType === 'lab' ? 'Lab Procedure' : 'Field Procedure'}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {lang === 'bn' ? test.bnName : test.name}
                      </h3>
                      <p className="text-slate-500 leading-relaxed">
                        {lang === 'bn' ? test.bnDescription : test.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        <ChevronRight size={18} className="text-emerald-500" />
                        {lang === 'bn' ? 'ধাপসমূহ:' : 'Steps:'}
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(lang === 'bn' ? test.bnSteps : test.steps).map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="bg-emerald-100 text-emerald-700 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </div>
);
}
