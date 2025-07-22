console.clear();

/**
 * DI Container
 * ConsoleLoggerService: new ConsoleLoggerService()
 * UserService: new UserService()
 */

class Container {
    private services = new Map();
    public register<T>(token: new (...args: any[]) => T, instance: T) {
        this.services.set(token, instance);
    }
    public resolve<T>(token: new (...args: any[]) => T) {
        const service = this.services.get(token);
        if (!service) {
            throw new Error(`Service not found for token: ${token}`)
        }
        return service;
    }
}

const container  = new Container();

function Injectable<T extends { new (...args: any[]): {}}>(BaseClassEntity: T) {
    container.register(BaseClassEntity, new BaseClassEntity)
}

function Inject(token: any) {
    return function(target: any, propertyKey: string) {
        const serviceInstance = container.resolve(token);
        Object.defineProperty(target, propertyKey, {
            get: () => serviceInstance,
            enumerable: true,
            configurable: true,
        })
    }
}

@Injectable
class ConfigService {
    getEnvConfig(configName: string) {
        return 'console'
    }
    getDbConfig(configName: string) {
        return 'console';
    }
}

interface ILogger {
    log(message: string): void
}

@Injectable
class ConsoleLoggerService implements ILogger {
    log(message: string) {
        console.log(`[console]: ${message}`);
    }
}

function getLoggerType() {
    return 'console';
}

@Injectable
class FileLoggerService implements ILogger {
    log(message: string) {
        console.log(`[file]: ${message}`);
    }
}

@Injectable
class CloudLoggerService implements ILogger {
    log(message: string) {
        console.log(`[cloud]: ${message}`);
    }
}

@Injectable
class LoggerFactory {

    @Inject(ConfigService)
    private configService!: ConfigService

    @Inject(ConsoleLoggerService)
    private consoleLogger!: ConsoleLoggerService;

    @Inject(FileLoggerService)
    private fileLogger!: FileLoggerService;

    @Inject(CloudLoggerService)
    private cloudLogger!: CloudLoggerService;

    getLogger(): ILogger {
        const config = this.configService.getEnvConfig('loggerConfig');
        switch(config) {
            case 'console':
                return this.consoleLogger
            case 'file': 
                return this.fileLogger;
            case 'cloud':
                return this.cloudLogger;
            default:
                throw new Error('unknown logger service instance');
        }
    }
}

@Injectable
class UserService {
    @Inject(LoggerFactory)
    private loggerFactory!: LoggerFactory

    private loggerService: ILogger;
    constructor() {
        this.loggerService = this.loggerFactory.getLogger()
    }
    login(username: string, password: string){
        this.loggerService.log(`logging in user with ${username} and ${password}`)
    }
    updateUserName(newUsername: string) {
        this.loggerService.log(`updating username ${newUsername}`);
    }
    logOut() {
        this.loggerService.log('logging out user');
    }
}

@Injectable
class Main {
    @Inject(UserService)
    private userService!: UserService;
    constructor() {}
    init() {
        this.userService.login('john', 'john@123');
        this.userService.updateUserName('bob');
        this.userService.logOut()
    }
}

const main = container.resolve(Main);
main.init()


// optimised version with dependency injection



// console.clear();

// /**
//  * DI container
//  * ConsoleLoggerService: new ConsoleLoggerService()
//  * UserService: new UserService()
//  */

// class Container {
//     private services = new Map();
//     public register<T>(token: new (...args: any[]) => T, instance: T) {
//         this.services.set(token, instance);
//     }

//     public resolve<T>(token: new (...args: any[]) => T) {
//         const service = this.services.get(token);
//         if(!service) {
//             throw new Error(`Servicce not found for token: ${token}`);
//         }
//         return service;
//     }
// }

// const container = new Container();


// // Injectable decorator
// function Injectable<T extends { new (...args: any[]): {}}>(BaseClassEntity: T) {
//     container.register(BaseClassEntity, new BaseClassEntity());
// }

// // we can create a property decorator to avoid manually claling
// // and initializing services in constructors
// function Inject(token: any) { // this is a decorator factory
//     return function(target: any, propertyKey: string) {
//         const serviceIntanece = container.resolve(token);
//         Object.defineProperty(target, propertyKey, {
//             get: () => serviceIntanece,
//             enumerable: true,
//             configurable: true
//         })
//     }
// }

// interface ILogger {
//     log(message: string): void;
// }

// @Injectable
// class ConsoleLoggerService implements ILogger {
//     log(message: string) {
//         console.log(`[console]: ${message}`);
//     }
// }

// @Injectable
// class CloudLoggerService implements ILogger {
//     log(message: string) {
//         console.log(`[cloud]: ${message}`);
//     }
// }

// @Injectable
// class FileLoggerService implements ILogger{
//     log(message: string) {
//         console.log(`[file]: ${message}`);
//     }
// }




// function getLoggerType(){
//     // this would return what looger service should be used
//     // ideally it should come from .env or db or cloud
//     // here is hardcoded for learning purpose
//     return 'file';
// }

// class LoggerFactroy {
//     @Inject(ConsoleLoggerService)
//     private consoleLogger!: ConsoleLoggerService;

//     @Inject(FileLoggerService)
//     private fileLogger!: FileLoggerService;

//     @Inject(CloudLoggerService)
//     private cloudLogger!: CloudLoggerService;

//     getLogger(): ILogger {
//         // this should be from env 
//         const config = getLoggerType();
//         switch (config) {
//             case 'console':
//                 return this.consoleLogger
//             case 'file':
//                 return this.fileLogger
//             case 'cloud':
//                 return this.cloudLogger
//             default:
//                 throw new Error('Unknown Logger service instance');

//         }
//     }
// }



// basic version with dependency hell problem


// @Injectable
// class UserService {
//     /* 
//     here we can see that Userservice is dependent upon logger servise 
//     as a result we have to create and instance of consoleLoggerserive
//     it should be genric Userservice should not care about loggerservice 
//     so we will pass loggerserice to the Userservice
//     so that logger serive can be anything like cloud logger, server logger etc
//      */

//     /**
//      * still we have to come to UserService to change the type of logger service by
//      * providing CloudLoggerService, FileLoggerService etc
//      * our goal is that we should never come to User service 
//      * it should be able to fetch it from the environment and decide what logger service to use
//      * so we create a logger factory that tell UserService to what loggerservice to use
//      */

//     /**
//      * now we are going one step further
//      * now we dont even need to specify here what logger service are we suppsed to need
//      */

//     // @Inject(CloudLoggerService)
//     // private loggerService!: ILogger;

//     // instead

//     @Inject(LoggerFactroy)
//     private loggerFactory!: LoggerFactroy;
    
//     private loggerService: ILogger;


//     constructor() {
//         // this.loggerService = container.resolve(ConsoleLoggerService);

//         this.loggerService = this.loggerFactory.getLogger();
//     }
//     login(username: string, password: string){
//         this.loggerService.log(`Logggin in user with ${username} and ${password}`)
//     }

//     updateUsername(newUsername: string) {
//         this.loggerService.log(`updating Username ${newUsername}`);
//     }

//     logout() {
//         this.loggerService.log(`logging out user`);
//     }
// }

// @Injectable
// class Main {
//     @Inject(UserService)
//     private userService!: UserService;
//     constructor() {
//         /* 
//         now this makes it this main dependent upon consolelogger service 
//         and main is dependednt upon the Userservice
//         so we will pass userserice into it so that we don need to create the
//         instance og userservice here in the Main
//         */
//         // this.userService = container.resolve(UserService);
//     }
//     init() {
//         this.userService.login('John', 'Jogn@123');
//         this.userService.updateUsername('bob');
//         this.userService.logout();
//     }
// }

// // not this cause dependency hell so we use containter wi thdependenc injectons
// // now make it more cleaner -> insead of doing it mannually we will create a decorator
// // called @Injectable this will taka a class and register it into the container so that it can be used later
// // container.register(ConsoleLoggerService, new ConsoleLoggerService());
// // container.register(UserService, new UserService());
 
// const main = container.resolve(Main);
// main.init();

// console.clear();

// class ConsoleLoggerService {
//     log(message: string) {
//         console.log(`[console]: ${message}`);
//     }
// }

// class UserService {
//     /* 
//     here we can see that Userservice is dependent upon logger servise 
//     as a result we have to create and instance of consoleLoggerserive
//     it should be genric Userservice should not care about loggerservice 
//     so we will pass loggerserice to the Userservice
//     so that logger serive can be anything like cloud logger, server logger etc
//      */
//     private loggerService: ConsoleLoggerService;
//     constructor(loggerService: ConsoleLoggerService) {
//         this.loggerService = loggerService;
//     }
//     login(username: string, password: string){
//         this.loggerService.log(`Logggin in user with ${username} and ${password}`)
//     }

//     updateUsername(newUsername: string) {
//         this.loggerService.log(`updating Username ${newUsername}`);
//     }

//     logout() {
//         this.loggerService.log(`logging out user`);
//     }
// }


// class Main {
//     private userService: UserService;
//     constructor(userservice: UserService) {
//         /* 
//         now this makes it this main dependent upon consolelogger service 
//         and main is dependednt upon the Userservice
//         so we will pass userserice into it so that we don need to create the
//         instance og userservice here in the Main
//         */
//         this.userService = userservice;
//     }
//     init() {
//         this.userService.login('John', 'Jogn@123');
//         this.userService.updateUsername('bob');
//         this.userService.logout();
//     }
// }

// // not this cause dependency hell
// const main = new Main(new UserService(new ConsoleLoggerService));
// main.init();