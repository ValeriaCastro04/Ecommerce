// Script para preparar deployment a Vercel
const fs = require('fs');
const path = require('path');

function prepareDeployment() {
  console.log('🚀 Preparando proyecto para deployment en Vercel...');

  // 1. Verificar next.config.ts
  const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
  
  if (fs.existsSync(nextConfigPath)) {
    console.log('✅ next.config.ts encontrado');
    
    const config = fs.readFileSync(nextConfigPath, 'utf8');
    console.log('📄 Configuración actual:');
    console.log(config);
  }

  // 2. Verificar package.json scripts
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  console.log('\n📦 Scripts de build:');
  console.log('Build:', packageJson.scripts.build);
  console.log('Start:', packageJson.scripts.start);
  console.log('Postinstall:', packageJson.scripts.postinstall);

  // 3. Crear archivo vercel.json si no existe
  const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
  
  if (!fs.existsSync(vercelConfigPath)) {
    const vercelConfig = {
      "buildCommand": "npm run build",
      "functions": {
        "app/api/**/*.ts": {
          "maxDuration": 30
        }
      },
      "env": {
        "NODE_ENV": "production"
      }
    };
    
    fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
    console.log('✅ vercel.json creado');
  } else {
    console.log('✅ vercel.json ya existe');
  }

  // 4. Verificar variables de entorno
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = envContent.split('\n').filter(line => line.includes('='));
    
    console.log('\n🔐 Variables de entorno encontradas:');
    envVars.forEach(line => {
      const [key] = line.split('=');
      console.log(`   - ${key.trim()}`);
    });
    
    // Verificar variables críticas
    const criticalVars = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXT_PUBLIC_APP_NAME'];
    const missingVars = criticalVars.filter(varName => 
      !envVars.some(line => line.startsWith(varName))
    );
    
    if (missingVars.length > 0) {
      console.log('\n⚠️  Variables críticas faltantes:');
      missingVars.forEach(varName => console.log(`   - ${varName}`));
    } else {
      console.log('\n✅ Todas las variables críticas están configuradas');
    }
  }

  console.log('\n📋 Pasos para deployment:');
  console.log('1. git add .');
  console.log('2. git commit -m "Fix product routes and deployment"');
  console.log('3. git push origin main');
  console.log('4. Vercel redesplegará automáticamente');
  console.log('\n💡 Después del deployment, ejecuta:');
  console.log('   npm run db:ensure-products (para asegurar que hay productos)');
}

prepareDeployment();
