console.clear();



class UserService {
    /* 
    here we can see that Userservice is dependent upon logger servise 
    as a result we have to create and instance of consoleLoggerserive
    it should be genric Userservice should not care about loggerservice 
    so we will pass loggerserice to the Userservice
    so that logger serive can be anything like cloud logger, server logger etc
     */
    private loggerService: ConsoleLoggerService;
    constructor(loggerService: ConsoleLoggerService) {
        this.loggerService = loggerService;
    }
    login(username: string, password: string){
        this.loggerService.log(`Logggin in user with ${username} and ${password}`)
    }

    updateUsername(newUsername: string) {
        this.loggerService.log(`updating Username ${newUsername}`);
    }

    logout() {
        this.loggerService.log(`logging out user`);
    }
}


class Main {
    private userService: UserService;
    constructor(userservice: UserService) {
        /* 
        now this makes it this main dependent upon consolelogger service 
        and main is dependednt upon the Userservice
        so we will pass userserice into it so that we don need to create the
        instance og userservice here in the Main
        */
        this.userService = userservice;
    }
    init() {
        this.userService.login('John', 'Jogn@123');
        this.userService.updateUsername('bob');
        this.userService.logout();
    }
}

// not this cause dependency hell
const main = new Main(new UserService(new ConsoleLoggerService));
main.init();

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