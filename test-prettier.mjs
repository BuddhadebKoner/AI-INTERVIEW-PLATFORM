#!/usr/bin/env node

/**
 * Prettier Configuration Test Script
 * Tests the Prettier setup across the monorepo
 */

import { execSync } from 'child_process';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colors = {
   green: '\x1b[32m',
   red: '\x1b[31m',
   yellow: '\x1b[33m',
   blue: '\x1b[34m',
   reset: '\x1b[0m',
   bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
   console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, cwd = process.cwd()) {
   try {
      const result = execSync(command, {
         cwd,
         encoding: 'utf8',
         stdio: 'pipe'
      });
      return { success: true, output: result };
   } catch (error) {
      return { success: false, error: error.message, output: error.stdout };
   }
}

function createTestFiles() {
   const testFiles = [
      {
         path: join(__dirname, 'test-format.js'),
         content: `// Intentionally poorly formatted JS
const   badlyFormatted={name:"test",value:123,array:[1,2,3,4,5],object:{nested:true,deep:{very:true}}};

function   badFunction(  param1,param2  ){
return param1+param2;
}

const arrow=(a,b)=>{return a*b};

export{badlyFormatted,badFunction,arrow};`
      },
      {
         path: join(__dirname, 'test-format.json'),
         content: `{
"name":"test",
"version":"1.0.0",
"scripts":{"dev":"echo test","build":"echo build"},
"dependencies":{"react":"^18.0.0","lodash":"^4.17.21"}
}`
      },
      {
         path: join(__dirname, 'frontend', 'test-format.jsx'),
         content: `import React from"react";

const Component=({prop1,prop2,prop3})=>{
return(<div className="flex items-center justify-center bg-blue-500 text-white p-4 m-2 rounded-lg shadow-md">
<h1 className="text-2xl font-bold">{prop1}</h1>
<p className="text-sm">{prop2}</p>
<button onClick={()=>console.log(prop3)}className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded">Click</button>
</div>);
};

export default Component;`
      },
      {
         path: join(__dirname, 'backend', 'test-format.js'),
         content: `import express from'express';

const app=express();

app.use(express.json());

app.get('/api/test',(req,res)=>{
const data={message:'Hello World',timestamp:new Date().toISOString(),status:'success'};
res.json(data);
});

export default app;`
      }
   ];

   return testFiles;
}

function cleanupTestFiles(testFiles) {
   testFiles.forEach(file => {
      if (existsSync(file.path)) {
         try {
            unlinkSync(file.path);
         } catch (error) {
            log(`Warning: Could not clean up ${file.path}`, colors.yellow);
         }
      }
   });
}

async function runTests() {
   log(`${colors.bold}🧪 Prettier Configuration Test Suite${colors.reset}\n`);

   const testFiles = createTestFiles();
   let passed = 0;
   let failed = 0;

   try {
      // Test 1: Check if Prettier is installed
      log('1. Checking Prettier installation...', colors.blue);
      const prettierCheck = runCommand('npx prettier --version');
      if (prettierCheck.success) {
         log(`   ✅ Prettier installed: ${prettierCheck.output.trim()}`, colors.green);
         passed++;
      } else {
         log('   ❌ Prettier not found', colors.red);
         failed++;
      }

      // Test 2: Check configuration file
      log('\n2. Checking Prettier configuration...', colors.blue);
      const configFiles = ['.prettierrc.json', '.prettierrc.js', '.prettierrc.yaml', 'prettier.config.js'];
      const configExists = configFiles.some(file => existsSync(join(__dirname, file)));
      if (configExists) {
         log('   ✅ Prettier configuration found', colors.green);
         passed++;
      } else {
         log('   ❌ No Prettier configuration found', colors.red);
         failed++;
      }

      // Test 3: Create and format test files
      log('\n3. Creating test files...', colors.blue);
      testFiles.forEach(file => {
         try {
            writeFileSync(file.path, file.content);
            log(`   ✅ Created: ${file.path}`, colors.green);
         } catch (error) {
            log(`   ❌ Failed to create: ${file.path}`, colors.red);
         }
      });

      // Test 4: Check formatting (dry run)
      log('\n4. Testing format check...', colors.blue);
      const formatCheck = runCommand('npx prettier --check test-format.js test-format.json');
      if (!formatCheck.success) {
         log('   ✅ Format check correctly identified unformatted files', colors.green);
         passed++;
      } else {
         log('   ❌ Format check should have failed for unformatted files', colors.red);
         failed++;
      }

      // Test 5: Apply formatting
      log('\n5. Testing format application...', colors.blue);
      const formatApply = runCommand('npx prettier --write test-format.js test-format.json');
      if (formatApply.success) {
         log('   ✅ Formatting applied successfully', colors.green);
         passed++;
      } else {
         log('   ❌ Failed to apply formatting', colors.red);
         failed++;
      }

      // Test 6: Verify formatting worked
      log('\n6. Verifying formatted files...', colors.blue);
      const verifyFormat = runCommand('npx prettier --check test-format.js test-format.json');
      if (verifyFormat.success) {
         log('   ✅ Files are properly formatted', colors.green);
         passed++;
      } else {
         log('   ❌ Files are still not properly formatted', colors.red);
         failed++;
      }

      // Test 7: Test workspace-specific formatting
      log('\n7. Testing workspace formatting...', colors.blue);
      const frontendFormat = runCommand('npx prettier --check frontend/test-format.jsx');
      const backendFormat = runCommand('npx prettier --check backend/test-format.js');

      if (!frontendFormat.success && !backendFormat.success) {
         log('   ✅ Workspace files correctly identified as unformatted', colors.green);
         passed++;
      } else {
         log('   ❌ Workspace formatting test failed', colors.red);
         failed++;
      }

      // Test 8: Test ignore patterns
      log('\n8. Testing ignore patterns...', colors.blue);
      if (existsSync(join(__dirname, '.prettierignore'))) {
         log('   ✅ .prettierignore file exists', colors.green);
         passed++;
      } else {
         log('   ❌ .prettierignore file missing', colors.red);
         failed++;
      }

      // Test 9: Test npm scripts
      log('\n9. Testing npm scripts...', colors.blue);
      const scriptsTest = runCommand('npm run format:check');
      if (scriptsTest.success || scriptsTest.error.includes('prettier')) {
         log('   ✅ npm scripts are configured', colors.green);
         passed++;
      } else {
         log('   ❌ npm scripts not properly configured', colors.red);
         failed++;
      }

   } finally {
      // Cleanup
      log('\n🧹 Cleaning up test files...', colors.blue);
      cleanupTestFiles(testFiles);
   }

   // Results
   log(`\n${colors.bold}📊 Test Results:${colors.reset}`);
   log(`✅ Passed: ${passed}`, colors.green);
   log(`❌ Failed: ${failed}`, colors.red);
   log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

   if (failed === 0) {
      log(`\n🎉 All tests passed! Prettier is properly configured.`, colors.green);
   } else {
      log(`\n⚠️  Some tests failed. Please check the configuration.`, colors.yellow);
   }

   // Usage instructions
   log(`\n${colors.bold}📝 Usage Instructions:${colors.reset}`);
   log('• Format all files: npm run format');
   log('• Check formatting: npm run format:check');
   log('• Format frontend only: npm run format:frontend');
   log('• Format backend only: npm run format:backend');
   log('• Test formatting: npm run test:format');

   return failed === 0;
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
   runTests().then(success => {
      process.exit(success ? 0 : 1);
   });
}

export { runTests };
