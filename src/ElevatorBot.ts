import {CommandClient} from "eris";
import fs from "fs";
import {ElevatorCommand} from "./commands/ElevatorCommand";

export class ElevatorBot {
    public static instance: ElevatorBot
    public readonly bot: CommandClient
    public readonly config: ConfigurationInterface

    constructor() {
        this.config = ElevatorBot.readConfig();

        this.bot = new CommandClient(
            this.config.token,
            {},
            {prefix: this.config.prefix}
        );

        ElevatorBot.instance = this;
    }

    public run(): Promise<string> {
        return new Promise(async resolve => {
            await this.bot.connect()
            this.bot.on('ready', () => {
                this.init()
                resolve("connected");
            })
        })
    }

    private static readConfig(): ConfigurationInterface {
        return JSON.parse(fs.readFileSync('config.js', {encoding: "utf8"}));
    }

    private init() {
    }

    private initializeCommand(command: ElevatorCommand) {
        this.bot.registerCommand(
            command.name,
            (msg, args) => {
                command.execute(msg, args)
            })
    }
}