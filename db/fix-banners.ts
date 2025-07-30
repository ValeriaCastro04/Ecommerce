// Script para ver y actualizar los banners de productos
import { PrismaClient } from '@prisma/client';

async function checkAndUpdateBanners() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Revisando productos con banners...');

    // Obtener todos los productos que tienen banner
    const productsWithBanners = await prisma.product.findMany({
      where: {
        banner: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        banner: true,
        isFeatured: true
      }
    });

    console.log('📋 Productos con banners actuales:');
    productsWithBanners.forEach(product => {
      console.log(`   - ${product.name}`);
      console.log(`     Banner: ${product.banner}`);
      console.log(`     Featured: ${product.isFeatured}`);
      console.log('');
    });

    // Actualizar banners problemáticos
    console.log('🔄 Actualizando banners...');

    // Actualizar el banner que causa problemas con banner-33.jpeg
    const updateResult1 = await prisma.product.updateMany({
      where: {
        OR: [
          { banner: '/images/banner-1.jpg' },
          { banner: '/images/banner-11.png' },
          { banner: { contains: 'banner-1' } }
        ]
      },
      data: {
        banner: '/images/banner-33.jpeg'
      }
    });

    // Asegurar que banner-2 esté correctamente actualizado
    const updateResult2 = await prisma.product.updateMany({
      where: {
        banner: '/images/banner-2.jpg'
      },
      data: {
        banner: '/images/banner-22.jpg'
      }
    });

    console.log(`✅ Actualizados ${updateResult1.count} productos con banner-33.jpeg`);
    console.log(`✅ Actualizados ${updateResult2.count} productos con banner-22.jpg`);

    // Verificar los cambios finales
    const finalProducts = await prisma.product.findMany({
      where: {
        banner: {
          not: null
        }
      },
      select: {
        name: true,
        banner: true,
        isFeatured: true
      }
    });
    
    console.log('🎯 Estado final de productos con banners:');
    finalProducts.forEach(product => {
      console.log(`   - ${product.name}: ${product.banner} (Featured: ${product.isFeatured})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndUpdateBanners();
