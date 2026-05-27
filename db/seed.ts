import { db } from './index';
import { portfolioItems } from './schema';

async function seed() {
  console.log('Seeding portfolio items...');
  
  const items = [
    {
      imageUrl: '/portfolio/IMG_5288.JPG',
      descriptionPt: 'Moldura personalizada com tema Stitch e ecografias.',
      descriptionEn: 'Custom Stitch themed frame with ultrasound photos.',
    },
    {
      imageUrl: '/portfolio/IMG_5287.JPG',
      descriptionPt: 'Moldura para camisola de futebol (Teixeira #10).',
      descriptionEn: 'Football jersey frame (Teixeira #10).',
    },
    {
      imageUrl: '/portfolio/IMG_5286.JPG',
      descriptionPt: 'Moldura para camisola de futebol comemorativa (Neno).',
      descriptionEn: 'Commemorative football jersey frame (Neno).',
    },
    {
      imageUrl: '/portfolio/IMG_5284.JPG',
      descriptionPt: 'Espelho com moldura prateada trabalhada.',
      descriptionEn: 'Mirror with ornate silver frame.',
    },
    {
      imageUrl: '/portfolio/IMG_5283.JPG',
      descriptionPt: 'Moldura profunda para chuteiras e recordações de futebol.',
      descriptionEn: 'Deep shadow box frame for football boots and memorabilia.',
    },
    {
      imageUrl: '/portfolio/IMG_5282.JPG',
      descriptionPt: 'Quadro religioso em ponto cruz com moldura dourada.',
      descriptionEn: 'Religious cross-stitch artwork with gold frame.',
    },
    {
      imageUrl: '/portfolio/IMG_5281.JPG',
      descriptionPt: 'Amostras de perfis de molduras em tons metálicos.',
      descriptionEn: 'Frame profile samples in metallic tones.',
    },
    {
      imageUrl: '/portfolio/IMG_5280.JPG',
      descriptionPt: 'Amostras de molduras modernas em madeira e cores neutras.',
      descriptionEn: 'Modern frame samples in wood and neutral colors.',
    },
    {
      imageUrl: '/portfolio/IMG_5279.JPG',
      descriptionPt: 'Pormenor de cantos de molduras ornamentadas brancas e douradas.',
      descriptionEn: 'Detail of ornate white and gold frame corners.',
    },
    {
      imageUrl: '/portfolio/IMG_5278.JPG',
      descriptionPt: 'Trabalho de bordado com moldura dourada clássica.',
      descriptionEn: 'Embroidery work with classic gold frame.',
    },
    {
      imageUrl: '/portfolio/IMG_5277.JPG',
      descriptionPt: 'Trabalho em ponto cruz personalizado com moldura vermelha.',
      descriptionEn: 'Personalized cross-stitch work with red frame.',
    },
    {
      imageUrl: '/portfolio/IMG_5276.JPG',
      descriptionPt: 'Conjunto de molduras pequenas com padrão prateado.',
      descriptionEn: 'Set of small silver-patterned frames.',
    },
    {
      imageUrl: '/portfolio/IMG_5275.JPG',
      descriptionPt: 'Moldura múltipla para fotografias tipo passe.',
      descriptionEn: 'Multi-photo frame for passport-style pictures.',
    }
  ];

  for (const item of items) {
    await db.insert(portfolioItems).values(item);
  }

  console.log('Seeding complete!');
}

seed().catch(console.error);
