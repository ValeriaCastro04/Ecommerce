// URLs de imágenes de productos de skincare confiables
export const SAFE_SKINCARE_IMAGES = {
  serums: [
    'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500&q=80',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80',
    'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500&q=80',
  ],
  cleansers: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
  ],
  toners: [
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80',
  ]
};

// ✅ ESTOS DOMINIOS YA ESTÁN CONFIGURADOS EN next.config.ts:
// - images.unsplash.com ✅
// - picsum.photos ✅  
// - via.placeholder.com ✅

// ❌ EVITA ESTOS DOMINIOS:
// - *.cloudfront.net (excepto si los configuras específicamente)
// - *.amazonaws.com (excepto si los configuras)
// - Cualquier dominio no configurado en next.config.ts
