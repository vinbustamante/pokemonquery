export function mapCommand(command: string) {   
    return function (target) {       
        if(target) {
            target.__command__ = target.__command__ || [];
        }
        target.__command__.push(command);
    }
}