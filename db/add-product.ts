// Script rápido para agregar un producto con tu URL
import { PrismaClient } from '@prisma/client';

async function addNewProduct() {
  const prisma = new PrismaClient();
  
  const newProduct = await prisma.product.create({
    data: {
      name: 'Mi Producto Personalizado',
      slug: 'mi-producto-personalizado',
      category: 'Personalizado',
      description: 'Producto con imagen personalizada',
      images: [
        'https://www.allaboutbirds.org/guide/assets/photo/308743051-1900px.jpg'
      ],
      price: 99.99,
      brand: 'Mi Marca',
      rating: 5.0,
      numReviews: 1,
      stock: 10,
      isFeatured: false
    }
  });
  
  console.log('✅ Producto creado:', newProduct);
  await prisma.$disconnect();
}

addNewProduct();
