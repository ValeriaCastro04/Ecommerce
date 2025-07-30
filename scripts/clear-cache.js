// Script para limpiar caché de Next.js y reiniciar
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function clearNextCache() {
  try {
    console.log('🧹 Limpiando caché de Next.js...');
    
    // Eliminar carpeta .next si existe
    const nextDir = path.join(process.cwd(), '.next');
    if (fs.existsSync(nextDir)) {
      fs.rmSync(nextDir, { recursive: true, force: true });
      console.log('✅ Carpeta .next eliminada');
    }
    
    console.log('✅ Caché limpiada. Reinicia el servidor con: npm run dev');
    
  } catch (error) {
    console.error('❌ Error limpiando caché:', error.message);
  }
}

clearNextCache();
