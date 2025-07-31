// Script para asignar las nuevas imágenes personalizadas a los productos
import { PrismaClient } from '@prisma/client';

// Mapeo automático basado en los nombres de las imágenes y productos
const imageMapping = {
  'serum-clinique': {
    images: ['/images/sample-products/clinique-serum.jpg'],
    name: 'Serum clinique'
  },
  '1025-dokdo-cleansing-oil-round-lab': {
    images: ['/images/sample-products/1025-dokdo-cleansing-oil-round-lab.jpg'],
    name: '1025 Dokdo Cleansing Oil (ROUND LAB)'
  },
  'hyper-niacinamide-20-serum-isntree': {
    images: ['/images/sample-products/isntree-hyper-niacinamide-20-serum-20-ml.jpg'],
    name: 'Hyper Niacinamide 20 Serum (Isntree)'
  },
  'low-ph-good-morning-gel-cleanser-cosrx': {
    images: ['/images/sample-products/Cosrx-gel-cleanser.jpg'],
    name: 'Low pH Good Morning Gel Cleanser (COSRX)'
  },
  'madagascar-centella-ampoule-skin1004': {
    images: ['/images/sample-products/skin1004-centella-serum.jpeg'],
    name: 'Madagascar Centella Ampoule (SKIN1004)'
  },
  'anua-rice-70-glow-milky-toner': {
    images: ['/images/sample-products/anua-rice-70-glow-milky-toner-250ml-2-min.jpg'],
    name: 'Anua - Rice 70 Glow Milky Toner'
  }
};

async function assignCustomImages() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🎨 === ASIGNANDO IMÁGENES PERSONALIZADAS ===');
    console.log('');

    // Obtener todos los productos
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        images: true
      }
    });

    console.log(`📦 Productos encontrados: ${products.length}`);
    console.log('');

    let updatedCount = 0;
    let notFoundCount = 0;

    // Actualizar cada producto con su imagen personalizada
    for (const product of products) {
      const mapping = imageMapping[product.slug as keyof typeof imageMapping];
      
      if (mapping) {
        console.log(`🔄 Actualizando: ${product.name}`);
        console.log(`   Slug: ${product.slug}`);
        console.log(`   Imagen anterior: ${product.images?.[0] || 'Sin imagen'}`);
        console.log(`   Imagen nueva: ${mapping.images[0]}`);

        await prisma.product.update({
          where: { id: product.id },
          data: {
            images: mapping.images,
            name: mapping.name
          }
        });

        console.log(`   ✅ Imagen asignada correctamente`);
        updatedCount++;
      } else {
        console.log(`⚠️  No se encontró imagen para: ${product.name} (${product.slug})`);
        notFoundCount++;
      }
      console.log('');
    }

    // Verificar que las imágenes se asignaron correctamente
    console.log('🔍 Verificando asignaciones...');
    const updatedProducts = await prisma.product.findMany({
      select: {
        name: true,
        slug: true,
        images: true
      }
    });

    console.log('');
    console.log('📋 Estado final de productos:');
    updatedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Slug: ${product.slug}`);
      console.log(`   Imagen: ${product.images?.[0] || 'Sin imagen'}`);
      console.log('');
    });

    console.log('🎉 === PROCESO COMPLETADO ===');
    console.log(`✅ Productos actualizados: ${updatedCount}`);
    console.log(`⚠️  Productos sin imagen: ${notFoundCount}`);
    console.log('');
    console.log('🔗 Imágenes asignadas:');
    Object.entries(imageMapping).forEach(([slug, data]) => {
      console.log(`   - ${data.name}: ${data.images[0]}`);
    });
    console.log('');
    console.log('💡 Reinicia el servidor para ver los cambios: npm run dev');

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
  } finally {
    await prisma.$disconnect();
  }
}

assignCustomImages();
