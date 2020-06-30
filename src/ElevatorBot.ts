import {CommandClient} from "eris";
import fs from "fs";

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
    }

    private static readConfig(): ConfigurationInterface {
        return JSON.parse(fs.readFileSync('config.js', {encoding: "utf8"}));
    }
}