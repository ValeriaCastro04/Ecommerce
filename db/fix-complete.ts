// Solución completa para el problema de productos
import { PrismaClient } from '@prisma/client';

const sampleProducts = [
  {
    name: 'Smart%20Clinical%20Repair',
    slug: 'smart-20-clinical-20-repair',
    category: 'Skincare',
    description: 'Advanced clinical repair serum for sensitive skin. Clinically tested formula.',
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80'],
    price: 89.99,
    brand: 'Smart Clinical',
    rating: 4.8,
    numReviews: 25,
    stock: 15,
    isFeatured: true,
    banner: '/images/banner-33.png'
  },
  {
    name: '1025 Dokdo Cleansing Oil (ROUND LAB)',
    slug: '1025-dokdo-cleansing-oil-round-lab',
    category: 'Cleansers',
    description: 'Gentle deep cleansing oil from Korean brand Round Lab. Removes makeup and impurities.',
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80'],
    price: 24.99,
    brand: 'Round Lab',
    rating: 4.6,
    numReviews: 18,
    stock: 20,
    isFeatured: true,
    banner: '/images/banner-22.jpg'
  },
  {
    name: 'Serum clinique',
    slug: 'serum-clinique',
    category: 'Serums',
    description: 'Professional grade anti-aging serum from Clinique. Reduces fine lines and brightens skin.',
    images: ['https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500&q=80'],
    price: 65.00,
    brand: 'Clinique',
    rating: 4.5,
    numReviews: 12,
    stock: 8,
    isFeatured: true,
    banner: '/images/banner-11.png'
  },
  {
    name: 'Hyper Niacinamide 20 Serum',
    slug: 'hyper-niacinamide-20-serum-isntree',
    category: 'Serums',
    description: 'High concentration niacinamide serum for pore care and oil control. 20ml bottle.',
    images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500&q=80'],
    price: 18.50,
    brand: 'Isntree',
    rating: 4.7,
    numReviews: 31,
    stock: 25,
    isFeatured: false,
    banner: null
  },
  {
    name: 'Vitamin C Brightening Serum',
    slug: 'vitamin-c-brightening-serum',
    category: 'Serums',
    description: 'Potent vitamin C serum for brightening and evening skin tone.',
    images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80'],
    price: 32.99,
    brand: 'SkinCeuticals',
    rating: 4.3,
    numReviews: 45,
    stock: 12,
    isFeatured: false,
    banner: null
  },
  {
    name: 'Retinol Anti-Aging Cream',
    slug: 'retinol-anti-aging-cream',
    category: 'Moisturizers',
    description: 'Advanced retinol formula for anti-aging and skin renewal.',
    images: ['https://images.unsplash.com/photo-1556228578-dd52457435b7?w=500&q=80'],
    price: 54.00,
    brand: 'RoC',
    rating: 4.4,
    numReviews: 28,
    stock: 18,
    isFeatured: false,
    banner: null
  }
];

async function fixProductsCompletely() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 === SOLUCIONANDO PROBLEMA DE PRODUCTOS ===');
    console.log('');

    // 1. Limpiar productos existentes
    console.log('1. Limpiando productos existentes...');
    await prisma.product.deleteMany();
    console.log('✅ Productos existentes eliminados');

    // 2. Crear productos nuevos
    console.log('');
    console.log('2. Creando productos nuevos...');
    
    for (const productData of sampleProducts) {
      const product = await prisma.product.create({
        data: productData
      });
      console.log(`✅ Creado: ${product.name} (${product.slug})`);
    }

    // 3. Verificar que todo está bien
    console.log('');
    console.log('3. Verificando productos creados...');
    
    const totalProducts = await prisma.product.count();
    const featuredProducts = await prisma.product.count({
      where: { isFeatured: true }
    });
    
    console.log(`📦 Total productos: ${totalProducts}`);
    console.log(`🌟 Productos featured: ${featuredProducts}`);

    // 4. Probar URLs específicas
    console.log('');
    console.log('4. URLs de prueba:');
    const testProducts = await prisma.product.findMany({
      select: { name: true, slug: true },
      take: 3
    });

    testProducts.forEach(product => {
      console.log(`   https://prostore-ecommerce-eta-nine.vercel.app/product/${product.slug}`);
    });

    // 5. Forzar regeneración de páginas estáticas
    console.log('');
    console.log('5. Información para regenerar páginas estáticas:');
    console.log('   - Hacer commit y push para redeployar');
    console.log('   - O usar Vercel CLI: vercel --prod');

    console.log('');
    console.log('🎉 === PROBLEMA SOLUCIONADO ===');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('1. git add .');
    console.log('2. git commit -m "Fix: Add products to database"');
    console.log('3. git push origin main');
    console.log('4. Esperar el redeploy automático de Vercel');
    console.log('');
    console.log('⚡ URLs de prueba después del deploy:');
    console.log('   https://prostore-ecommerce-eta-nine.vercel.app/product/smart-20-clinical-20-repair');
    console.log('   https://prostore-ecommerce-eta-nine.vercel.app/product/serum-clinique');
    console.log('   https://prostore-ecommerce-eta-nine.vercel.app/product/1025-dokdo-cleansing-oil-round-lab');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixProductsCompletely();
