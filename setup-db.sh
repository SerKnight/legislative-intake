#!/bin/bash
# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
  echo "Creating .env.local..."
  cat > .env.local << 'ENVEOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/legislative_intake"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="YTvUfnro/5jt9uSfkAWVXaOIGHtaRY6ZrFHNw2nxN/c="
ENVEOF
  echo "✅ Created .env.local"
else
  echo "⚠️  .env.local already exists, skipping..."
fi

# Start Docker if not running
if ! docker info > /dev/null 2>&1; then
  echo "⚠️  Docker is not running. Please start Docker Desktop and run this script again."
  exit 1
fi

# Start PostgreSQL
echo "Starting PostgreSQL container..."
docker-compose up -d

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 3

# Check if database is accessible
if docker exec legislative-intake-db pg_isready -U postgres > /dev/null 2>&1; then
  echo "✅ Database is ready!"
  echo ""
  echo "Next steps:"
  echo "  pnpm db:generate"
  echo "  pnpm db:migrate"
  echo "  pnpm db:seed"
else
  echo "❌ Database failed to start. Check logs with: docker-compose logs"
fi
