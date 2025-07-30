// Script para actualizar URLs de imágenes rápidamente
// Uso: npm run update-images

const fs = require('fs');
const path = require('path');

// URLs que quieres usar (puedes cambiar estas cuando quieras)
const NEW_IMAGE_URLS = {
  'p1-1': 'https://www.allaboutbirds.org/guide/assets/photo/308743051-1900px.jpg',
  'p1-2': 'https://ejemplo.com/imagen2.jpg',
  'p2-1': 'https://ejemplo.com/imagen3.jpg',
  'p2-2': 'https://ejemplo.com/imagen4.jpg',
  // Agrega más según necesites...
};

function updateImageUrls() {
  const sampleDataPath = path.join(__dirname, 'sample-data.ts');
  let content = fs.readFileSync(sampleDataPath, 'utf8');
  
  // Reemplazar URLs
  Object.entries(NEW_IMAGE_URLS).forEach(([key, newUrl]) => {
    const oldPattern = `/images/sample-products/${key}.jpg`;
    content = content.replace(oldPattern, newUrl);
  });
  
  fs.writeFileSync(sampleDataPath, content);
  console.log('✅ URLs de imágenes actualizadas!');
}

// Función para restaurar desde backup
function restoreFromBackup() {
  const backupPath = path.join(__dirname, 'sample-data-backup.ts');
  const sampleDataPath = path.join(__dirname, 'sample-data.ts');
  
  let backupContent = fs.readFileSync(backupPath, 'utf8');
  // Cambiar el export para que funcione con el archivo principal
  backupContent = backupContent.replace('originalSampleData', 'sampleData');
  
  fs.writeFileSync(sampleDataPath, backupContent);
  console.log('🔄 Datos restaurados desde backup!');
}

// Ejecutar según el argumento
const action = process.argv[2];
if (action === 'restore') {
  restoreFromBackup();
} else {
  updateImageUrls();
}
