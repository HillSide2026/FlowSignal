import { exec } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { promisify } from 'node:util';
import readline from 'node:readline';
import crypto from 'node:crypto';
import path from 'node:path';

const execAsync = promisify(exec);

function question(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

async function getPostgresURL(): Promise<string> {
  console.log('Step 1: Setting up Postgres');
  const dbChoice = await question(
    'Use a local Postgres instance with Docker (L) or a remote Postgres instance (R)? (L/R): '
  );

  if (dbChoice.toLowerCase() === 'l') {
    console.log('Setting up local Postgres instance with Docker...');
    await setupLocalPostgres();
    return 'postgres://postgres:postgres@localhost:54322/postgres';
  }

  return await question('Enter your POSTGRES_URL: ');
}

async function setupLocalPostgres() {
  console.log('Checking if Docker is installed...');
  try {
    await execAsync('docker --version');
    console.log('Docker is installed.');
  } catch {
    console.error(
      'Docker is not installed. Please install Docker and try again.'
    );
    console.log('To install Docker, visit: https://docs.docker.com/get-docker/');
    process.exit(1);
  }

  const dockerComposePath = path.join(process.cwd(), 'docker-compose.yml');
  const hasDockerCompose = await fs
    .access(dockerComposePath)
    .then(() => true)
    .catch(() => false);

  if (hasDockerCompose) {
    console.log('Using existing docker-compose.yml file.');
  } else {
    console.log('Creating docker-compose.yml file...');
  }

  const dockerComposeContent = `
services:
  postgres:
    image: postgres:16.4-alpine
    container_name: flowsignal_postgres
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "54322:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
`;

  if (!hasDockerCompose) {
    await fs.writeFile(dockerComposePath, dockerComposeContent);
    console.log('docker-compose.yml file created.');
  }

  console.log('Starting Docker container with `docker compose up -d`...');
  try {
    await execAsync('docker compose up -d');
    console.log('Docker container started successfully.');
  } catch {
    console.error(
      'Failed to start Docker container. Please check Docker and try again.'
    );
    process.exit(1);
  }
}

function generateAuthSecret(): string {
  console.log('Step 2: Generating AUTH_SECRET...');
  return crypto.randomBytes(32).toString('hex');
}

async function writeEnvFile(envVars: Record<string, string>) {
  console.log('Step 3: Writing environment variables to .env');
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  await fs.writeFile(path.join(process.cwd(), '.env'), envContent);
  console.log('.env file created.');
}

async function main() {
  const POSTGRES_URL = await getPostgresURL();
  const BASE_URL = 'http://localhost:3000';
  const AUTH_SECRET = generateAuthSecret();

  await writeEnvFile({
    POSTGRES_URL,
    BASE_URL,
    AUTH_SECRET
  });

  console.log('Setup completed successfully.');
}

main().catch(console.error);
