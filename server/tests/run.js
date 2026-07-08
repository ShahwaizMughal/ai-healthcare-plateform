import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/ai-healthcare-test';
const TEST_PORT = '5999';

console.log('🧪 Starting QA Audit Test Orchestrator...');

// Step 1: Run DB Seed
const runSeeder = () => {
  return new Promise((resolve, reject) => {
    console.log('🌱 Seeding test database...');
    const seed = spawn('node', ['seed/seed.js'], {
      cwd: path.resolve(__dirname, '..'),
      env: { ...process.env, MONGO_URI: TEST_MONGO_URI }
    });

    seed.stdout.on('data', (data) => {
      console.log(`[Seed] ${data.toString().trim()}`);
    });

    seed.stderr.on('data', (data) => {
      console.error(`[Seed Error] ${data.toString().trim()}`);
    });

    seed.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Test database seeded successfully.');
        resolve();
      } else {
        reject(new Error(`Database seeding failed with exit code ${code}`));
      }
    });
  });
};

// Step 2: Spawn Express Server
const spawnServer = () => {
  return new Promise((resolve, reject) => {
    console.log(`🚀 Spawning Express API server on port ${TEST_PORT}...`);
    const server = spawn('node', ['server.js'], {
      cwd: path.resolve(__dirname, '..'),
      env: { ...process.env, MONGO_URI: TEST_MONGO_URI, PORT: TEST_PORT, NODE_ENV: 'test' }
    });

    let resolved = false;

    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[Server] ${output.trim()}`);
      if (output.includes('Server running') && !resolved) {
        resolved = true;
        resolve(server);
      }
    });

    server.stderr.on('data', (data) => {
      console.error(`[Server Error] ${data.toString().trim()}`);
    });

    server.on('close', (code) => {
      console.log(`[Server] Process exited with code ${code}`);
      if (!resolved) {
        reject(new Error(`Server exited unexpectedly with code ${code}`));
      }
    });
  });
};

// Step 3: Run Node Test Runner
const runTests = () => {
  return new Promise((resolve) => {
    console.log('🧪 Executing integration test suite...');
    const tests = spawn('node', ['--test', 'tests/qa.test.js'], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
      env: { ...process.env, MONGO_URI: TEST_MONGO_URI, PORT: TEST_PORT, NODE_ENV: 'test' }
    });

    tests.on('close', (code) => {
      resolve(code);
    });
  });
};

const main = async () => {
  let serverProcess;
  try {
    await runSeeder();
    serverProcess = await spawnServer();
    const testExitCode = await runTests();
    
    console.log('🧹 Tearing down Express server...');
    serverProcess.kill();
    process.exit(testExitCode);
  } catch (err) {
    console.error(`❌ Orchestrator Failure: ${err.message}`);
    if (serverProcess) {
      serverProcess.kill();
    }
    process.exit(1);
  }
};

main();
