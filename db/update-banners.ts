// Script para actualizar los banners en la base de datos
import { PrismaClient } from '@prisma/client';

async function updateBanners() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Actualizando banners en la base de datos...');

    // Actualizar banner-1 por banner-11.png
    const product1 = await prisma.product.updateMany({
      where: {
        banner: '/images/banner-1.jpg'
      },
      data: {
        banner: '/images/banner-11.png'
      }
    });

    // Actualizar banner-2 por banner-2.jpg (mantener el mismo nombre)
    const product2 = await prisma.product.updateMany({
      where: {
        banner: '/images/banner-2.jpg'
      },
      data: {
        banner: '/images/banner-2.jpg'  // Ya está correcto, pero por consistencia
      }
    });

    console.log(`✅ Actualizados ${product1.count} productos con banner-11.png`);
    console.log(`✅ Verificados ${product2.count} productos con banner-2.jpg`);
    
    // Verificar los cambios
    const updatedProducts = await prisma.product.findMany({
      where: {
        banner: {
          not: null
        }
      },
      select: {
        name: true,
        banner: true
      }
    });
    
    console.log('📋 Productos con banners actualizados:');
    updatedProducts.forEach(product => {
      console.log(`   - ${product.name}: ${product.banner}`);
    });

  } catch (error) {
    console.error('❌ Error actualizando banners:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBanners();
