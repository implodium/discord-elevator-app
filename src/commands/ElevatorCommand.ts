import {Message} from "eris";
import {BotException} from "../BotException";

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
        try {
            if (this.argsAreValid(args)) {
                await this.run(msg, args)
            } else throw new BotException('Invalid number of arguments')
        } catch (e) {
            if (e instanceof BotException) {
                await msg.channel.createMessage(e.message)
            } else {
                await msg.channel.createMessage(
                    `Something went wrong please contact the maintainer: LebenderFux`
                )

                console.log(e.stack);
            }
        }

    }

    private argsAreValid(args: Array<string>) {
        return args.length >= this.minArgs && args.length <= this.maxArgs
    }
}
