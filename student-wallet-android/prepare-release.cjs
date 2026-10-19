// Generated Capacitor Android project: Play release adjustments only.
// Run after npx cap add android, before Gradle. No keystore is stored in git.
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const variablesPath = path.join(root, 'android/variables.gradle');
let vars = fs.readFileSync(variablesPath, 'utf8');
vars = vars.replace(/compileSdkVersion\s*=\s*\d+/, 'compileSdkVersion = 36');
vars = vars.replace(/targetSdkVersion\s*=\s*\d+/, 'targetSdkVersion = 36');
fs.writeFileSync(variablesPath, vars);
const gradlePath = path.join(root, 'android/app/build.gradle');
let gradle = fs.readFileSync(gradlePath, 'utf8');
gradle = gradle.replace(/versionCode\s+\d+/, 'versionCode ' + (process.env.PLAY_VERSION_CODE || '1'));
gradle = gradle.replace(/versionName\s+["'][^"']+["']/, 'versionName "1.0.0"');
fs.writeFileSync(gradlePath, gradle);
console.log('Configured Play target API 36, version code, and release bundle.');
