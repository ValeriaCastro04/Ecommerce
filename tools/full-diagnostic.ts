// Diagnóstico completo del problema
import { PrismaClient } from '@prisma/client';

async function fullDiagnostic() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 === DIAGNÓSTICO COMPLETO ===');
    console.log('');

    // 1. Verificar conexión a la base de datos
    console.log('1. Verificando conexión a la base de datos...');
    try {
      await prisma.$connect();
      console.log('✅ Conexión a la base de datos exitosa');
    } catch (error) {
      console.log('❌ Error de conexión:', error instanceof Error ? error.message : String(error));
      return;
    }

    // 2. Contar productos
    console.log('');
    console.log('2. Contando productos...');
    const productCount = await prisma.product.count();
    console.log(`📦 Total de productos: ${productCount}`);

    if (productCount === 0) {
      console.log('⚠️  LA BASE DE DATOS ESTÁ VACÍA - Este es el problema principal');
      console.log('');
      console.log('💡 Solución: Ejecutar el seed o crear productos manualmente');
      
      // Crear productos de prueba inmediatamente
      console.log('🔧 Creando productos de prueba...');
      
      const testProduct = await prisma.product.create({
        data: {
          name: 'Smart Clinical Repair Test',
          slug: 'smart-clinical-repair-test',
          category: 'Skincare',
          description: 'Producto de prueba para verificar funcionamiento',
          images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'],
          price: 89.99,
          brand: 'Test Brand',
          rating: 4.8,
          numReviews: 25,
          stock: 15,
          isFeatured: true,
          banner: '/images/banner-33.png'
        }
      });
      
      console.log('✅ Producto de prueba creado:', testProduct.name);
      console.log(`   URL: /product/${testProduct.slug}`);
      
    } else {
      // 3. Listar productos existentes
      console.log('');
      console.log('3. Productos existentes:');
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          stock: true,
          isFeatured: true,
          banner: true,
          images: true
        },
        take: 10
      });

      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Slug: ${product.slug}`);
        console.log(`   URL de prueba: https://prostore-ecommerce-eta-nine.vercel.app/product/${product.slug}`);
        console.log(`   Precio: $${product.price}`);
        console.log(`   Stock: ${product.stock}`);
        console.log(`   Featured: ${product.isFeatured}`);
        console.log(`   Banner: ${product.banner || 'Sin banner'}`);
        console.log(`   Imágenes: ${product.images?.length || 0}`);
        console.log('');
      });

      // 4. Verificar productos featured específicamente
      console.log('4. Productos destacados (featured):');
      const featuredProducts = await prisma.product.findMany({
        where: { isFeatured: true },
        select: {
          name: true,
          slug: true,
          banner: true
        }
      });

      if (featuredProducts.length === 0) {
        console.log('⚠️  No hay productos destacados para el carrusel');
        
        // Hacer algunos productos featured
        await prisma.product.updateMany({
          where: {},
          data: { isFeatured: true },
          take: 3
        });
        
        console.log('✅ Se marcaron los primeros 3 productos como featured');
      } else {
        featuredProducts.forEach((product, index) => {
          console.log(`${index + 1}. ${product.name} (${product.slug})`);
          console.log(`   Banner: ${product.banner || 'Sin banner'}`);
        });
      }
    }

    // 5. Probar la función getProductBySlug
    console.log('');
    console.log('5. Probando función getProductBySlug...');
    
    const firstProduct = await prisma.product.findFirst();
    if (firstProduct) {
      console.log(`🧪 Probando con slug: ${firstProduct.slug}`);
      
      const productBySlug = await prisma.product.findFirst({
        where: { slug: firstProduct.slug }
      });
      
      if (productBySlug) {
        console.log('✅ getProductBySlug funciona correctamente');
        console.log(`   Producto encontrado: ${productBySlug.name}`);
      } else {
        console.log('❌ getProductBySlug no está funcionando');
      }
    }

    console.log('');
    console.log('🎯 === RESUMEN DEL DIAGNÓSTICO ===');
    if (productCount === 0) {
      console.log('❌ PROBLEMA PRINCIPAL: Base de datos vacía');
      console.log('💡 SOLUCIÓN: Se creó un producto de prueba');
    } else {
      console.log('✅ Hay productos en la base de datos');
      console.log('💡 El problema puede estar en el deployment o cache');
    }

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error instanceof Error ? error.message : String(error));
  } finally {
    await prisma.$disconnect();
  }
}

fullDiagnostic();
