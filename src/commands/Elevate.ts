import {ElevatorCommand} from "./ElevatorCommand";
import {Message} from "eris";

export class Elevate extends ElevatorCommand {

    constructor() {
        super('elevate', 2,2);
    }


    protected async run(msg: Message, args: Array<string>): Promise<void> {
        const who: string = args[0];
        const where: string = args[1];

        console.log(`Moving ${who} to ${where}`)
    }

}