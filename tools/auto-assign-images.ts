// Script para detectar automáticamente imágenes y asignarlas inteligentemente
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

function findBestImageMatch(productName: string, productSlug: string, availableImages: string[]): string | null {
  const searchTerms = [
    productSlug,
    productName.toLowerCase().replace(/[^a-z0-9]/g, ''),
    ...productName.toLowerCase().split(' '),
    ...productSlug.split('-')
  ];

  // Buscar coincidencias exactas primero
  for (const term of searchTerms) {
    if (term.length < 3) continue; // Ignorar términos muy cortos
    
    const exactMatch = availableImages.find(img => 
      img.toLowerCase().includes(term.toLowerCase())
    );
    
    if (exactMatch) {
      return exactMatch;
    }
  }

  return null;
}

async function autoAssignImages() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🤖 === ASIGNACIÓN AUTOMÁTICA DE IMÁGENES ===');
    console.log('');

    // Leer imágenes disponibles
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'sample-products');
    const availableImages = fs.readdirSync(imagesDir).filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    console.log('📁 Imágenes disponibles:');
    availableImages.forEach((img, index) => {
      console.log(`   ${index + 1}. ${img}`);
    });
    console.log('');

    // Obtener productos
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        images: true
      }
    });

    console.log(`📦 Productos a procesar: ${products.length}`);
    console.log('');

    let assignedCount = 0;
    let notFoundCount = 0;

    for (const product of products) {
      console.log(`🔍 Procesando: ${product.name}`);
      console.log(`   Slug: ${product.slug}`);

      const bestMatch = findBestImageMatch(product.name, product.slug, availableImages);
      
      if (bestMatch) {
        const imagePath = `/images/sample-products/${bestMatch}`;
        
        console.log(`   ✅ Coincidencia encontrada: ${bestMatch}`);
        console.log(`   📷 Asignando imagen: ${imagePath}`);

        await prisma.product.update({
          where: { id: product.id },
          data: {
            images: [imagePath]
          }
        });

        assignedCount++;
      } else {
        console.log(`   ⚠️  No se encontró coincidencia`);
        notFoundCount++;
      }
      console.log('');
    }

    // Mostrar resultado final
    console.log('🎉 === ASIGNACIÓN COMPLETADA ===');
    console.log(`✅ Imágenes asignadas: ${assignedCount}`);
    console.log(`⚠️  Sin imagen: ${notFoundCount}`);
    console.log('');

    // Mostrar el estado final
    const finalProducts = await prisma.product.findMany({
      select: {
        name: true,
        slug: true,
        images: true
      }
    });

    console.log('📋 Estado final:');
    finalProducts.forEach((product, index) => {
      const hasImage = product.images && product.images.length > 0;
      const status = hasImage ? '✅' : '❌';
      const imageName = hasImage ? 
        product.images[0].split('/').pop() : 
        'Sin imagen';
      
      console.log(`   ${status} ${product.name}: ${imageName}`);
    });

    console.log('');
    console.log('💡 Reinicia el servidor: npm run dev');

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
  } finally {
    await prisma.$disconnect();
  }
}

autoAssignImages();
