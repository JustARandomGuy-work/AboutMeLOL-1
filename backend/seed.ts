import { db } from './src/index.js';
import { cosmetics } from './src/db/schema.js';

const seedCosmetics = async () => {
  const cosmeticsList = [
    {
      name: 'Premium Glow Badge',
      type: 'badge',
      price: 2.99,
      description: 'Make your profile shine with a glowing text effect',
      previewUrl: 'https://aboutme-media.b-cdn.net/cosmetics/glow-badge.png'
    },
    {
      name: 'Rainbow Animation',
      type: 'animation',
      price: 4.99,
      description: 'Animate your entire profile with vibrant rainbow colors',
      previewUrl: 'https://aboutme-media.b-cdn.net/cosmetics/rainbow-animation.png'
    },
    {
      name: 'Dark Mode Theme',
      type: 'theme',
      price: 1.99,
      description: 'Professional dark theme for your profile',
      previewUrl: 'https://aboutme-media.b-cdn.net/cosmetics/dark-theme.png'
    },
    {
      name: 'Custom Background',
      type: 'background',
      price: 3.99,
      description: 'Personalized background patterns for your profile',
      previewUrl: 'https://aboutme-media.b-cdn.net/cosmetics/custom-bg.png'
    },
    {
      name: 'Elite Badge',
      type: 'badge',
      price: 5.99,
      description: 'Exclusive elite member badge with special effects',
      previewUrl: 'https://aboutme-media.b-cdn.net/cosmetics/elite-badge.png'
    },
    {
      name: 'Particle Effects',
      type: 'animation',
      price: 4.99,
      description: 'Floating particles that follow your mouse',
      previewUrl: 'https://aboutme-media.b-cdn.net/cosmetics/particles.png'
    },
    {
      name: 'Gold Accent',
      type: 'accent',
      price: 2.99,
      description: 'Premium gold color accents throughout your profile',
      previewUrl: 'https://aboutme-media.b-cdn.net/cosmetics/gold-accent.png'
    },
    {
      name: 'Profile Border',
      type: 'decoration',
      price: 1.99,
      description: 'Decorative animated border for your profile card',
      previewUrl: 'https://aboutme-media.b-cdn.net/cosmetics/border.png'
    }
  ];

  try {
    await db.insert(cosmetics).values(cosmeticsList);
    console.log('✅ Seeded cosmetics successfully');
  } catch (error) {
    console.error('❌ Error seeding cosmetics:', error);
  }

  process.exit(0);
};

seedCosmetics();
