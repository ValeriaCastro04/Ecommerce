// Script para asignar imágenes apropiadas de productos de skincare
import { PrismaClient } from '@prisma/client';

// Mapeo de productos con sus imágenes apropiadas y información
const productImageMapping = {
  'serum-clinique': {
    images: ['/images/sample-products/p1-1.jpg', '/images/sample-products/p1-2.jpg'],
    name: 'Serum clinique',
    description: 'Advanced anti-aging serum with proven clinical results. Reduces fine lines and improves skin texture.',
    category: 'Serums'
  },
  '1025-dokdo-cleansing-oil-round-lab': {
    images: ['/images/sample-products/p2-1.jpg', '/images/sample-products/p2-2.jpg'],
    name: '1025 Dokdo Cleansing Oil (ROUND LAB)',
    description: 'Gentle deep cleansing oil that effectively removes makeup and impurities without stripping the skin.',
    category: 'Cleansers'
  },
  'hyper-niacinamide-20-serum-isntree': {
    images: ['/images/sample-products/p3-1.jpg', '/images/sample-products/p3-2.jpg'],
    name: 'Hyper Niacinamide 20 Serum (Isntree)',
    description: 'High concentration niacinamide serum for pore care, oil control and brightening. 20ml concentrated formula.',
    category: 'Serums'
  },
  'low-ph-good-morning-gel-cleanser-cosrx': {
    images: ['/images/sample-products/p4-1.jpg', '/images/sample-products/p4-2.jpg'],
    name: 'Low pH Good Morning Gel Cleanser (COSRX)',
    description: 'Gentle morning cleanser with low pH formula. Perfect for sensitive skin and daily use.',
    category: 'Cleansers'
  },
  'madagascar-centella-ampoule-skin1004': {
    images: ['/images/sample-products/p5-1.jpg', '/images/sample-products/p5-2.jpg'],
    name: 'Madagascar Centella Ampoule (SKIN1004)',
    description: '55ml serum with 100% Centella Asiatica extract. Soothes and heals irritated skin.',
    category: 'Serums'
  },
  'anua-rice-70-glow-milky-toner': {
    images: ['/images/sample-products/p6-1.jpg', '/images/sample-products/p6-2.jpg'],
    name: 'Anua - Rice 70 Glow Milky Toner',
    description: '250ml milky toner with 70% rice water for hydration and natural glow.',
    category: 'Toner'
  }
};

async function assignCorrectImages() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🎨 === ASIGNANDO IMÁGENES APROPIADAS ===');
    console.log('');

    // Obtener todos los productos
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        description: true,
        category: true
      }
    });

    console.log(`📦 Total de productos: ${products.length}`);
    console.log('');

    let updatedCount = 0;

    // Actualizar cada producto con sus imágenes correctas
    for (const product of products) {
      const mapping = productImageMapping[product.slug as keyof typeof productImageMapping];
      
      if (mapping) {
        console.log(`🔄 Actualizando: ${product.name}`);
        console.log(`   Slug: ${product.slug}`);
        console.log(`   Imágenes anteriores: ${product.images?.length || 0}`);
        console.log(`   Imágenes nuevas: ${mapping.images.join(', ')}`);

        await prisma.product.update({
          where: { id: product.id },
          data: {
            images: mapping.images,
            name: mapping.name, // Actualizar nombre si es necesario
            description: mapping.description,
            category: mapping.category
          }
        });

        console.log(`   ✅ Actualizado correctamente`);
        updatedCount++;
      } else {
        console.log(`⚠️  No hay mapeo para: ${product.name} (${product.slug})`);
        console.log(`   Usando imágenes por defecto...`);
        
        // Asignar imágenes por defecto basadas en el índice
        const defaultImages = [
          '/images/sample-products/p1-1.jpg',
          '/images/sample-products/p2-1.jpg'
        ];

        await prisma.product.update({
          where: { id: product.id },
          data: {
            images: defaultImages
          }
        });

        console.log(`   ✅ Imágenes por defecto asignadas`);
        updatedCount++;
      }
      console.log('');
    }

    console.log('🎉 === PROCESO COMPLETADO ===');
    console.log(`✅ Productos actualizados: ${updatedCount}`);
    console.log('');
    console.log('📋 Todas las imágenes ahora usan rutas locales:');
    console.log('   - /images/sample-products/p1-1.jpg');
    console.log('   - /images/sample-products/p2-1.jpg');
    console.log('   - etc...');
    console.log('');
    console.log('💡 Reinicia el servidor: npm run dev');

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
  } finally {
    await prisma.$disconnect();
  }
}

assignCorrectImages();
