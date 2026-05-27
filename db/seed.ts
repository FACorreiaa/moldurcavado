import { db } from './index';
import { portfolioItems } from './schema';

async function seed() {
  console.log('Seeding portfolio items...');
  
  const items = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop',
      descriptionPt: 'Moldura de madeira clássica esculpida à mão.',
      descriptionEn: 'Classic hand-carved wood frame.',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=600&auto=format&fit=crop',
      descriptionPt: 'Tela personalizada com acabamento em pinho.',
      descriptionEn: 'Custom canvas with pine finish.',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=600&auto=format&fit=crop',
      descriptionPt: 'Moldura moderna minimalista para arte contemporânea.',
      descriptionEn: 'Modern minimalist frame for contemporary art.',
    }
  ];

  for (const item of items) {
    await db.insert(portfolioItems).values(item);
  }

  console.log('Seeding complete!');
}

seed().catch(console.error);
