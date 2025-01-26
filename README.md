# NestJS Category Tree Management Application

This application provides a backend service for managing a hierarchical category tree using NestJS. It offers RESTful APIs for creating, updating, moving, deleting, and retrieving categories and their subcategories, utilizing TypeORM with a "Closure Table" pattern for efficient tree operations.

## Table of Contents

1.  [Prerequisites](#prerequisites)
2.  [Installation](#installation)
3.  [Configuration](#configuration)
4.  [Running the Application](#running-the-application)
5.  [API Endpoints](#api-endpoints)
6.  [Manual Migration Management](#manual-migration-management)
7.  [Project Structure](#project-structure)
8.  [Technologies Used](#technologies-used)
9.  [Contributing](#contributing)
10. [License](#license)

## 0. Prerequisites

*   **Node.js:** v16 or higher (LTS recommended)
*   **npm:** v8 or higher
*   **MySQL:** Or another database supported by TypeORM
*   **Git**


# 1.  **Clone the repository:**

    git clone <your-repository-url>
    cd <your-repository-name>

# 2.  **Install dependencies:**

    npm install

# 3. Configuration

Create a `config.yaml` file in the root:

```yaml
DATA_BASE:
  host: 'localhost'
  port: 3306
  username: 'root'
  password: 'mysql'
  database: 'mysql'
  synchronize: false # Use migrations instead of auto-synchronization

HTTP_PORT: 3003


MIGRATION: true # Set to 'false' to disable automatic migrations
Important: Configure DATA_BASE with your database credentials.
```
# 4. Running the Application
Migrations:

Automatic: Enabled by default (MIGRATION: true). Migrations run on application startup.
Manual: See Manual Migration Management.
Start the Server:

Bash

npm run start:dev
Access the application at HTTP_ENDPOINT.

# 5. API Endpoints
Method	Endpoint	Description	Request Body

POST	/category	Create a new category	CreateCategoryDto

PUT	/category/:id	Move a category under a new parent	MoveCategoryDto

DELETE	/category/:id	Delete a category	-

PATCH	/category/:id	Update a category's properties	UpdateCategoryDto

GET	/category/:id	Get a single category by ID	- 

GET	/category/tree/findAll	Get the entire category tree	-

GET	/category/subcategories/:id	Get subcategories of a category (tree structure)	-

GET	/category/flat/:id	Get all descendants of a category (flat list)	-


CreateCategoryDto:


{ "name": string, "description"?: string, "parentId"?: string }
MoveCategoryDto:


{ "parrentId": string }
UpdateCategoryDto:


{ "name"?: string, "description"?: string }
Example (Create):



# 6. Manual Migration Management
Run Migrations:

Bash
```
npm run migration:run
npm run migration:revert
```

# 7. Project Structure
```src/
├── category/          # Category module
│   ├── *.controller.ts   # API Controller
│   ├── *.module.ts       # Module
│   ├── *.repository.ts   # Database interactions
│   ├── *.service.ts      # Business logic
│   ├── dto/             # Data Transfer Objects
│   └── entities/        # Entity definition
├── common/            # Shared utilities
├── migrations/        # Database migrations
├── migration/
│   └── migration.service.ts
├── app.*.ts            # Root application files
├── main.ts              # Application entry
├── data-source.ts       # TypeORM data source
├── config.yaml          # Configuration
├── package.json
└── README.md
8. Technologies Used
NestJS
TypeORM
MySQL
TypeScript
YAML
```
# 9. Contributing
Fork the repo.
Create a new branch.
Commit your changes with descriptive messages.
Submit a pull request.
# 10. License
MIT License 
