// Script para arreglar slugs problemáticos
import { PrismaClient } from '@prisma/client';

function createCleanSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .replace(/^-|-$/g, '') // Remover guiones al inicio y final
    .substring(0, 60); // Limitar longitud
}

async function fixSlugs() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 === ARREGLANDO SLUGS PROBLEMÁTICOS ===');
    console.log('');

    // Obtener todos los productos
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true
      }
    });

    console.log('📋 Productos actuales y sus nuevos slugs:');
    
    for (const product of products) {
      const newSlug = createCleanSlug(product.name);
      
      console.log(`🔄 ${product.name}`);
      console.log(`   Slug anterior: "${product.slug}"`);
      console.log(`   Slug nuevo: "${newSlug}"`);
      
      // Verificar si el nuevo slug ya existe
      const existingProduct = await prisma.product.findFirst({
        where: { 
          slug: newSlug,
          id: { not: product.id }
        }
      });
      
      let finalSlug = newSlug;
      if (existingProduct) {
        finalSlug = `${newSlug}-${product.id.substring(0, 8)}`;
        console.log(`   ⚠️  Slug duplicado, usando: "${finalSlug}"`);
      }
      
      // Actualizar el producto
      await prisma.product.update({
        where: { id: product.id },
        data: { slug: finalSlug }
      });
      
      console.log(`   ✅ Actualizado a: "${finalSlug}"`);
      console.log(`   🔗 Nueva URL: https://prostore-ecommerce-eta-nine.vercel.app/product/${finalSlug}`);
      console.log('');
    }

    // Verificar productos featured después del update
    console.log('🌟 Productos featured con nuevos slugs:');
    const featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true },
      select: {
        name: true,
        slug: true,
        banner: true
      }
    });

    featuredProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Slug: ${product.slug}`);
      console.log(`   Banner: ${product.banner}`);
      console.log(`   URL: https://prostore-ecommerce-eta-nine.vercel.app/product/${product.slug}`);
      console.log('');
    });

    console.log('🎉 === SLUGS ARREGLADOS EXITOSAMENTE ===');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('1. git add .');
    console.log('2. git commit -m "Fix: Clean product slugs for URL compatibility"');
    console.log('3. git push origin main');
    console.log('4. Esperar redeploy de Vercel');
    console.log('');
    console.log('⚡ URLs de prueba después del deploy:');
    featuredProducts.forEach(product => {
      console.log(`   https://prostore-ecommerce-eta-nine.vercel.app/product/${product.slug}`);
    });

  } catch (error) {
    console.error('❌ Error arreglando slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSlugs();
