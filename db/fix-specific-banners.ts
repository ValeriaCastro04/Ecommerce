// Script para actualizar banners específicos por nombre de producto
import { PrismaClient } from '@prisma/client';

async function updateSpecificBanners() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Actualizando banners específicos por producto...');

    // Primero, veamos todos los productos que tienen banner
    const allProducts = await prisma.product.findMany({
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

    console.log('📋 Productos actuales con banners:');
    allProducts.forEach(product => {
      console.log(`   - ${product.name}: ${product.banner}`);
    });

    // Actualizar banner para el producto "Serum clinique" -> banner-11.png
    const updateSerum = await prisma.product.updateMany({
      where: {
        name: {
          contains: 'Serum',
          mode: 'insensitive'
        }
      },
      data: {
        banner: '/images/banner-11.png'
      }
    });

    // Actualizar banner para el producto con "Dokdo Cleansing Oil" -> banner-22.jpg
    const updateDokdo = await prisma.product.updateMany({
      where: {
        name: {
          contains: 'Dokdo',
          mode: 'insensitive'
        }
      },
      data: {
        banner: '/images/banner-22.jpg'
      }
    });

    // Actualizar banner para el producto con "Hyper Niacinamide" -> banner-33.jpeg
    const updateNiacinamide = await prisma.product.updateMany({
      where: {
        name: {
          contains: 'Niacinamide',
          mode: 'insensitive'
        }
      },
      data: {
        banner: '/images/banner-33.png'
      }
    });

    console.log(`✅ Actualizado ${updateSerum.count} producto(s) de Serum con banner-11.png`);
    console.log(`✅ Actualizado ${updateDokdo.count} producto(s) de Dokdo con banner-22.jpg`);
    console.log(`✅ Actualizado ${updateNiacinamide.count} producto(s) de Niacinamide con banner-33.png`);

    // Si no se encontraron por nombre, busquemos por los productos que están featured
    if (updateSerum.count === 0 && updateDokdo.count === 0 && updateNiacinamide.count === 0) {
      console.log('🔄 No se encontraron por nombre, actualizando por orden de productos featured...');
      
      const featuredProducts = await prisma.product.findMany({
        where: {
          isFeatured: true,
          banner: {
            not: null
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      // Actualizar el primer producto featured
      if (featuredProducts[0]) {
        await prisma.product.update({
          where: { id: featuredProducts[0].id },
          data: { banner: '/images/banner-11.png' }
        });
        console.log(`✅ Primer producto featured (${featuredProducts[0].name}) actualizado con banner-11.png`);
      }

      // Actualizar el segundo producto featured
      if (featuredProducts[1]) {
        await prisma.product.update({
          where: { id: featuredProducts[1].id },
          data: { banner: '/images/banner-22.jpg' }
        });
        console.log(`✅ Segundo producto featured (${featuredProducts[1].name}) actualizado con banner-22.jpg`);
      }

      // Actualizar el tercer producto featured
      if (featuredProducts[2]) {
        await prisma.product.update({
          where: { id: featuredProducts[2].id },
          data: { banner: '/images/banner-33.png' }
        });
        console.log(`✅ Tercer producto featured (${featuredProducts[2].name}) actualizado con banner-33.png`);
      }
    }

    // Verificar el resultado final
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
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    console.log('🎯 Estado final de productos con banners:');
    finalProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name}`);
      console.log(`      Banner: ${product.banner}`);
      console.log(`      Featured: ${product.isFeatured}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateSpecificBanners();
