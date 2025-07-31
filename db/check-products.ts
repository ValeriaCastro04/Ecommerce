// Script para verificar y arreglar productos y slugs
import { PrismaClient } from '@prisma/client';

async function checkProducts() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Verificando productos en la base de datos...');

    // Obtener todos los productos
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        price: true,
        stock: true,
        isFeatured: true
      }
    });

    console.log(`📦 Total de productos: ${allProducts.length}`);
    console.log('');

    if (allProducts.length === 0) {
      console.log('⚠️  No hay productos en la base de datos.');
      console.log('💡 Ejecuta el seed para crear productos: npm run db:seed');
      return;
    }

    console.log('📋 Lista de productos:');
    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Slug: ${product.slug}`);
      console.log(`   Precio: $${product.price}`);
      console.log(`   Stock: ${product.stock}`);
      console.log(`   Featured: ${product.isFeatured}`);
      console.log(`   Imágenes: ${product.images?.length || 0}`);
      console.log('');
    });

    // Verificar si hay productos featured para el carrusel
    const featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true },
      select: {
        name: true,
        slug: true,
        banner: true
      }
    });

    console.log(`🌟 Productos destacados (para carrusel): ${featuredProducts.length}`);
    featuredProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.slug})`);
      console.log(`   Banner: ${product.banner}`);
    });

    // Verificar si hay problemas con slugs
    const duplicateSlugs = await prisma.product.groupBy({
      by: ['slug'],
      having: {
        slug: {
          _count: {
            gt: 1
          }
        }
      }
    });

    if (duplicateSlugs.length > 0) {
      console.log('⚠️  Slugs duplicados encontrados:');
      duplicateSlugs.forEach(item => {
        console.log(`   - ${item.slug}`);
      });
    } else {
      console.log('✅ No hay slugs duplicados');
    }

    // Generar URLs de ejemplo
    console.log('');
    console.log('🔗 URLs de productos de ejemplo:');
    const sampleProducts = allProducts.slice(0, 3);
    sampleProducts.forEach(product => {
      console.log(`   https://prostore-ecommerce-eta-nine.vercel.app/product/${product.slug}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
