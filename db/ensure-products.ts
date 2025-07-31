// Script para crear productos de prueba si no existen
import { PrismaClient } from '@prisma/client';

const testProducts = [
  {
    name: 'Smart%20Clinical%20Repair',
    slug: 'smart-20-clinical-20-repair',
    category: 'Skincare',
    description: 'Advanced clinical repair serum for all skin types',
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'],
    price: 89.99,
    brand: 'Smart Clinical',
    rating: 4.8,
    numReviews: 25,
    stock: 15,
    isFeatured: true,
    banner: '/images/banner-33.png'
  },
  {
    name: '1025 Dokdo Cleansing Oil',
    slug: '1025-dokdo-cleansing-oil-round-lab',
    category: 'Cleansers',
    description: 'Gentle yet effective cleansing oil from Round Lab',
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500'],
    price: 24.99,
    brand: 'Round Lab',
    rating: 4.6,
    numReviews: 18,
    stock: 20,
    isFeatured: true,
    banner: '/images/banner-22.jpg'
  },
  {
    name: 'Serum Clinique',
    slug: 'serum-clinique',
    category: 'Serums',
    description: 'Professional grade serum from Clinique',
    images: ['https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500'],
    price: 65.00,
    brand: 'Clinique',
    rating: 4.5,
    numReviews: 12,
    stock: 8,
    isFeatured: true,
    banner: '/images/banner-11.png'
  }
];

async function ensureProducts() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Verificando productos existentes...');

    const existingProducts = await prisma.product.count();
    
    if (existingProducts === 0) {
      console.log('📦 No hay productos. Creando productos de prueba...');
      
      for (const product of testProducts) {
        await prisma.product.create({
          data: product
        });
        console.log(`✅ Creado: ${product.name}`);
      }
      
      console.log('🎉 Productos de prueba creados exitosamente!');
    } else {
      console.log(`✅ Ya existen ${existingProducts} productos en la base de datos`);
      
      // Verificar que los productos featured tengan banners
      const featuredWithoutBanner = await prisma.product.findMany({
        where: {
          isFeatured: true,
          banner: null
        }
      });
      
      if (featuredWithoutBanner.length > 0) {
        console.log('🔧 Asignando banners a productos featured...');
        
        for (let i = 0; i < featuredWithoutBanner.length; i++) {
          const banners = ['/images/banner-11.png', '/images/banner-22.jpg', '/images/banner-33.png'];
          await prisma.product.update({
            where: { id: featuredWithoutBanner[i].id },
            data: { banner: banners[i % banners.length] }
          });
        }
        
        console.log('✅ Banners asignados');
      }
    }

    // Mostrar productos finales
    const finalProducts = await prisma.product.findMany({
      select: {
        name: true,
        slug: true,
        price: true,
        stock: true,
        isFeatured: true,
        banner: true
      }
    });

    console.log('\n📋 Productos disponibles:');
    finalProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   URL: https://prostore-ecommerce-eta-nine.vercel.app/product/${product.slug}`);
      console.log(`   Precio: $${product.price}`);
      console.log(`   Stock: ${product.stock}`);
      if (product.isFeatured) {
        console.log(`   🌟 Featured - Banner: ${product.banner}`);
      }
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

ensureProducts();
