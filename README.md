# Dependency Injection in TypeScript

A comprehensive implementation of a custom Dependency Injection (DI) container in TypeScript, demonstrating various design patterns and best practices for managing dependencies in object-oriented applications.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Core Concepts](#core-concepts)
- [Getting Started](#getting-started)
- [Usage Examples](#usage-examples)
- [Design Patterns](#design-patterns)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project implements a lightweight, custom Dependency Injection container in TypeScript that demonstrates:

- **Inversion of Control (IoC)** - Dependencies are injected rather than created
- **Service Registration** - Automatic service registration using decorators
- **Dependency Resolution** - Automatic dependency resolution and injection
- **Factory Pattern** - Dynamic service selection based on configuration
- **Interface Segregation** - Clean separation of concerns through interfaces

The implementation showcases how to solve the "dependency hell" problem and create loosely coupled, testable, and maintainable code.

## ✨ Features

- 🏗️ **Custom DI Container** - Lightweight dependency injection container
- 🎨 **Decorator-based Registration** - `@Injectable` decorator for automatic service registration
- 💉 **Property Injection** - `@Inject` decorator for dependency injection
- 🏭 **Factory Pattern** - Dynamic service selection using factory classes
- 🔧 **Multiple Logger Implementations** - Console, File, and Cloud logger services
- 📝 **TypeScript Support** - Full TypeScript implementation with type safety
- 🧪 **Clean Architecture** - Demonstrates SOLID principles

## 📁 Project Structure

```
dependency-injection/
├── src/
│   ├── index.ts                    # Entry point
│   └── dependencyInjection/
│       └── index.ts                # Main DI implementation
├── package.json                    # Project configuration
├── tsconfig.json                   # TypeScript configuration
├── README.md                       # Project documentation
└── .gitignore                      # Git ignore rules
```

## 🧠 Core Concepts

### 1. Dependency Injection Container

The `Container` class manages service registration and resolution:

```typescript
class Container {
    private services = new Map();
    
    public register<T>(token: new (...args: any[]) => T, instance: T): void
    public resolve<T>(token: new (...args: any[]) => T): T
}
```

### 2. Injectable Decorator

The `@Injectable` decorator automatically registers classes in the DI container:

```typescript
@Injectable
class MyService {
    // Service implementation
}
```

### 3. Inject Decorator

The `@Inject` decorator provides automatic dependency injection for class properties:

```typescript
class MyClass {
    @Inject(MyService)
    private myService!: MyService;
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- TypeScript compiler

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/prince981620/dependency-injection.git
   cd dependency-injection
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Compile TypeScript:**
   ```bash
   npm run compile
   ```

4. **Run the application:**
   ```bash
   node dist/dependencyInjection/index.js
   ```

## 💡 Usage Examples

### Basic Service Registration and Injection

```typescript
// 1. Define a service
@Injectable
class DatabaseService {
    connect() {
        console.log("Connected to database");
    }
}

// 2. Use the service in another class
@Injectable
class UserRepository {
    @Inject(DatabaseService)
    private db!: DatabaseService;
    
    findUser(id: string) {
        this.db.connect();
        // Find user logic
    }
}

// 3. Resolve and use
const userRepo = container.resolve(UserRepository);
userRepo.findUser("123");
```

### Factory Pattern Implementation

```typescript
// Interface for logger contract
interface ILogger {
    log(message: string): void;
}

// Multiple implementations
@Injectable
class ConsoleLoggerService implements ILogger {
    log(message: string) {
        console.log(`[console]: ${message}`);
    }
}

@Injectable
class FileLoggerService implements ILogger {
    log(message: string) {
        console.log(`[file]: ${message}`);
    }
}

// Factory to select appropriate logger
@Injectable
class LoggerFactory {
    @Inject(ConsoleLoggerService)
    private consoleLogger!: ConsoleLoggerService;
    
    @Inject(FileLoggerService)
    private fileLogger!: FileLoggerService;
    
    getLogger(): ILogger {
        const config = this.configService.getEnvConfig('loggerConfig');
        switch(config) {
            case 'console': return this.consoleLogger;
            case 'file': return this.fileLogger;
            default: throw new Error('Unknown logger type');
        }
    }
}
```

## 🎨 Design Patterns

### 1. **Dependency Injection Pattern**
- Eliminates tight coupling between classes
- Enables easier testing and mocking
- Promotes code reusability

### 2. **Factory Pattern**
- `LoggerFactory` dynamically selects logger implementation
- Configuration-driven service selection
- Runtime flexibility

### 3. **Strategy Pattern**
- Multiple logger implementations (`ConsoleLoggerService`, `FileLoggerService`, `CloudLoggerService`)
- Interchangeable algorithms/implementations

### 4. **Decorator Pattern**
- `@Injectable` and `@Inject` decorators
- Clean, declarative dependency management

## 📚 API Reference

### Container Class

#### `register<T>(token: Constructor<T>, instance: T): void`
Registers a service instance with the container.

#### `resolve<T>(token: Constructor<T>): T`
Resolves and returns a service instance from the container.

### Decorators

#### `@Injectable`
Class decorator that automatically registers the class in the DI container.

#### `@Inject(token: Constructor)`
Property decorator that injects a dependency into a class property.

### Services

#### `ConfigService`
- `getEnvConfig(configName: string): string`
- `getDbConfig(configName: string): string`

#### `LoggerFactory`
- `getLogger(): ILogger`

#### `UserService`
- `login(username: string, password: string): void`
- `updateUserName(newUsername: string): void`
- `logOut(): void`

## 🏃‍♂️ Examples

The project includes a complete working example in `src/dependencyInjection/index.ts` that demonstrates:

1. **Service Registration** - Multiple services registered with `@Injectable`
2. **Dependency Injection** - Services injected using `@Inject`
3. **Factory Pattern** - Dynamic logger selection
4. **Real-world Usage** - User service with logging capabilities

### Running the Example

```bash
npm run compile
node dist/dependencyInjection/index.js
```

**Expected Output:**
```
[console]: logging in user with john and john@123
[console]: updating username bob
[console]: logging out user
```

## 🛠️ Development

### Scripts

- `npm run compile` - Compile TypeScript to JavaScript

### Configuration

- **TypeScript Config**: Configured for ES2016 target with decorator support
- **Decorators**: Experimental decorators enabled for DI functionality
- **Output**: Compiled JavaScript output to `dist/` directory

## 🔍 Key Learning Points

1. **Solving Dependency Hell**: Shows progression from tightly coupled code to clean DI
2. **Decorator Usage**: Practical implementation of TypeScript decorators
3. **Factory Pattern**: Dynamic service selection based on configuration
4. **Clean Architecture**: Separation of concerns and dependency management
5. **Type Safety**: Full TypeScript support with proper typing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🎓 Educational Value

This project serves as an excellent learning resource for:

- Understanding Dependency Injection principles
- Implementing custom DI containers
- Working with TypeScript decorators
- Applying SOLID principles
- Factory and Strategy pattern implementation
- Building maintainable, testable code architectures

---

**Author**: [prince981620](https://github.com/prince981620)  
**Repository**: [dependency-injection](https://github.com/prince981620/dependency-injection)
