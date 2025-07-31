// Script para encontrar y arreglar imágenes problemáticas
import { PrismaClient } from '@prisma/client';

async function fixProblematicImages() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 === ARREGLANDO IMÁGENES PROBLEMÁTICAS ===');
    console.log('');

    // Obtener todos los productos
    console.log('1. Obteniendo todos los productos...');
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        images: true
      }
    });

    console.log(`📦 Total de productos: ${allProducts.length}`);

    // Encontrar productos con imágenes problemáticas
    console.log('');
    console.log('2. Identificando imágenes problemáticas...');
    
    const problematicProducts = allProducts.filter(product => 
      product.images?.some(img => 
        img.includes('cloudfront.net') || 
        img.includes('d1flfk77wl2xk4') ||
        img.includes('amazonaws.com') ||
        !img.startsWith('https://images.unsplash.com') && !img.startsWith('/images/')
      )
    );

    console.log(`⚠️  Productos con imágenes problemáticas: ${problematicProducts.length}`);

    if (problematicProducts.length === 0) {
      console.log('✅ No se encontraron imágenes problemáticas');
      return;
    }

    // Mostrar productos problemáticos
    console.log('');
    console.log('📋 Productos que necesitan arreglo:');
    problematicProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.slug})`);
      product.images?.forEach((img, imgIndex) => {
        if (img.includes('cloudfront.net') || img.includes('d1flfk77wl2xk4') || img.includes('amazonaws.com')) {
          console.log(`     🔴 Imagen problemática: ${img.substring(0, 60)}...`);
        }
      });
    });

    // Arreglar las imágenes
    console.log('');
    console.log('3. Arreglando imágenes...');
    
    // Imágenes de reemplazo seguras
    const safeImages = [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80', // Skincare
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80', // Serum
      'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500&q=80', // Cosmetics
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80', // Beauty products
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500&q=80', // Bottles
    ];

    for (const product of problematicProducts) {
      console.log(`🔧 Arreglando: ${product.name}`);
      
      const newImages = product.images?.map((img, index) => {
        if (img.includes('cloudfront.net') || 
            img.includes('d1flfk77wl2xk4') || 
            img.includes('amazonaws.com') ||
            (!img.startsWith('https://images.unsplash.com') && !img.startsWith('/images/'))
        ) {
          // Usar una imagen diferente para cada producto
          const safeImage = safeImages[index % safeImages.length];
          console.log(`     ✅ Reemplazada: ${img.substring(0, 40)}... → ${safeImage}`);
          return safeImage;
        }
        return img;
      });

      // Actualizar el producto
      await prisma.product.update({
        where: { id: product.id },
        data: { images: newImages }
      });

      console.log(`     ✅ Producto actualizado: ${product.name}`);
    }

    console.log('');
    console.log('4. Verificando resultado...');
    
    // Verificar que todo esté arreglado
    const updatedProducts = await prisma.product.findMany({
      select: {
        name: true,
        images: true
      }
    });

    const stillProblematic = updatedProducts.filter(product => 
      product.images?.some(img => 
        img.includes('cloudfront.net') || img.includes('d1flfk77wl2xk4')
      )
    );

    if (stillProblematic.length === 0) {
      console.log('✅ Todas las imágenes problemáticas han sido arregladas');
    } else {
      console.log(`⚠️  Aún quedan ${stillProblematic.length} productos con problemas`);
    }

    console.log('');
    console.log('🎉 === PROCESO COMPLETADO ===');
    console.log('💡 Ahora reinicia el servidor: npm run dev');

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
  } finally {
    await prisma.$disconnect();
  }
}

fixProblematicImages();
