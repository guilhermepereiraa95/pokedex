# Pokédex

This repository contains a complete Pokédex application with a REST API built using [NestJS](https://nestjs.com) and a client-side single-page application built in [Angular](https://angular.dev).

## Features

- **Pokémon List**: Browse a paginated list of Pokémon with "Load More" functionality
- **Search**: Search Pokémon by name
- **Details**: View detailed information about each Pokémon including stats, abilities, height, and weight
- **Responsive UI**: Modern and responsive interface with Material Design principles
- **Docker Support**: Easy deployment with Docker and Docker Compose

## Prerequisites

- [Node.js v22](https://nodejs.org/en) or higher
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for containerized deployment)

## Project Structure

```
pokedex/
├── api/                 # NestJS REST API
│   ├── src/
│   │   ├── pokemon/     # Pokemon module
│   │   │   ├── pokemon.controller.ts
│   │   │   ├── pokemon.service.ts
│   │   │   └── pokemon.types.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── app/                 # Angular SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── pokemon/    # Pokemon components and services
│   │   │   └── ...
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Setup

### Local Development

1. Clone the repository:
   ```shell
   git clone https://github.com/jitterbit/pokedex.git
   cd pokedex
   ```

2. Install dependencies:
   ```shell
   # API
   cd api/
   npm install

   # App
   cd ../app/
   npm install
   ```

## Run

### Local Development (without Docker)

Start the API and app in separate terminals:

**Terminal 1 - API:**
```shell
cd api/
npm run start
```

**Terminal 2 - App:**
```shell
cd app/
npm run start
```

The API will be available at `http://localhost:3000/api`
The app will be available at `http://localhost:4200`

### Docker Deployment

Build and run using Docker Compose:

```shell
docker-compose up --build
```

The app will be available at `http://localhost:4200`
The API will be available at `http://localhost:3000/api` (internal to the network)

To stop the containers:
```shell
docker-compose down
```

## API Endpoints

- `GET /api/pokemon/list?limit=20&offset=0` - Get paginated Pokémon list
- `GET /api/pokemon/search?name=bulbasaur` - Search Pokémon by name
- `GET /api/pokemon/:name` - Get detailed information about a Pokémon

## Testing

### Run Tests

```shell
cd api/
npm run test          # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:cov      # Run tests with coverage report
```

### Test Coverage

The project includes unit tests for:
- PokemonService (API calls, data transformation)
- PokemonController (Request handling, validation)

## Build

### Build API

```shell
cd api/
npm run build
```

### Build App

```shell
cd app/
npm run build
```

## Technologies Used

### Backend
- **NestJS** - Node.js framework
- **Axios** - HTTP client for PokéAPI integration
- **Jest** - Testing framework

### Frontend
- **Angular 21** - Modern web framework
- **RxJS** - Reactive programming library
- **TypeScript** - Type-safe JavaScript

### Deployment
- **Docker** - Containerization
- **Docker Compose** - Container orchestration
- **Nginx** - Web server for the frontend

## Environment Variables

### API
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS configuration (default: http://localhost:4200)

## Data Source

This application uses the free [PokéAPI](https://pokeapi.co/) to fetch Pokémon data.

## License

ISC

## Author

Jitterbit, Inc.

