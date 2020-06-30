import {Message} from "eris";

export abstract class ElevatorCommand {
    public readonly name: string;
    protected readonly minArgs: number;
    protected readonly maxArgs: number;

    protected constructor(name: string, minArgs:number, maxArgs:number) {
        this.name = name;
        this.minArgs = minArgs;
        this.maxArgs = maxArgs;
    }

    protected async abstract run(msg: Message, args: Array<string>): Promise<void>;


    public async execute(msg: Message, args: Array<string>) {
        await this.run(msg, args)
    }
}