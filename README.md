# Category Tree Service

A robust and flexible category tree management service built with NestJS and TypeORM, featuring hierarchical data structures, efficient tree operations, and comprehensive API endpoints.

## Features

- 🌳 Hierarchical category management
- 🔄 Tree structure operations (move, delete, restructure)
- 📊 Pagination and filtering
- 🔍 Advanced tree queries (ancestors, descendants, subcategories)
- 🛡️ Type safety with TypeScript
- 📝 Swagger API documentation
- 🐳 Docker support
- 🔄 Database migrations
- 🧪 Testing setup

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Docker and Docker Compose (optional)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/category-tree.git
cd category-tree
```

2. Install dependencies:
```bash
npm install
```

3. Configure the environment:
   - Copy `config.yaml.example` to `config.yaml`
   - Update the database configuration in `config.yaml`

## Configuration

The application uses a `config.yaml` file for configuration. Here's an example:

```yaml
DATA_BASE:
  HOST: localhost
  PORT: 3306
  USERNAME: category_user
  PASSWORD: category_password
  DATABASE: category_db
  SYNCHRONIZE: false
  LOGGING: true
  MIGRATIONSRUN: true

HTTP:
  PORT: 3003
```

## Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

### Using Docker

```bash
docker-compose up -d
```

## Database Migrations

Run migrations:
```bash
npm run migration:run
```

Generate a new migration:
```bash
npm run migration:generate -- src/migrations/MigrationName
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3003/api
```

### Main Endpoints

#### Category Management
- `POST /category` - Create a new category
- `GET /category/:id` - Get category by ID
- `PATCH /category/:id` - Update category
- `DELETE /category/:id` - Delete category
- `PUT /category/:id` - Move category

#### Tree Operations
- `GET /category/tree/findAll` - Get entire category tree
- `GET /category/subcategories/:id` - Get subcategories
- `GET /category/flat/:id` - Get flat descendants
- `GET /category/ancestors/:id` - Get ancestors
- `GET /category/ancestors-tree/:id` - Get ancestors tree

#### Advanced Delete Operations
- `DELETE /category/:id/with-children` - Delete category with children
- `DELETE /category/:id/keep-children` - Delete category but keep children

## Project Structure

```
src/
├── category/                 # Category module
│   ├── dto/                 # Data Transfer Objects
│   ├── entities/            # Database entities
│   ├── category.controller.ts
│   ├── category.service.ts
│   └── category.repository.ts
├── common/                  # Common utilities
│   ├── decorators/         # Custom decorators
│   ├── filters/            # Exception filters
│   ├── guards/             # Guards
│   ├── interceptors/       # Interceptors
│   └── typeorm/            # TypeORM configuration
├── config/                 # Configuration
├── migrations/             # Database migrations
└── main.ts                # Application entry point
```

## Testing

Run unit tests:
```bash
npm run test
```

Run e2e tests:
```bash
npm run test:e2e
```

Run test coverage:
```bash
npm run test:cov
```

## API Examples

### Create a Category
```bash
curl -X POST http://localhost:3003/category \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Electronics",
    "description": "Electronic devices and accessories",
    "parentId": null
  }'
```

### Get Category Tree
```bash
curl http://localhost:3003/category/tree/findAll
```

### Move Category
```bash
curl -X PUT http://localhost:3003/category/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "parrentId": "456e4567-e89b-12d3-a456-426614174000"
  }'
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- NestJS team for the amazing framework
- TypeORM for the excellent ORM
- All contributors who have helped shape this project 
