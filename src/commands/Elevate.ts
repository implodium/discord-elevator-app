import {ElevatorCommand} from "./ElevatorCommand";
import {Channel, Collection, Member, Message, TextChannel, VoiceChannel} from "eris";
import {BotException} from "../BotException";

export class Elevate extends ElevatorCommand {

    constructor() {
        super('elevate', 2,2);
    }


    protected async run(msg: Message, args: Array<string>): Promise<void> {
        const who: string = args[0];
        const where: string = args[1];
        const textChannel: TextChannel = msg.channel as TextChannel;
        const channels: Array<VoiceChannel> = textChannel.guild.channels.filter(channel => {
            return channel instanceof VoiceChannel
        }) as Array<VoiceChannel>

        channels.sort((c1, c2) => {
            if (c1.position > c2.position) {
                return 1
            } else if (c1.position < c2.position) {
                return -1
            } else return 0;
        })

        const finalChannel: VoiceChannel = this.getChannelByName(where, textChannel);
        const member: Member = textChannel.guild.members.get(who.replace(/[^0-9]/g, '')) as Member;

        if ((textChannel.guild.members.get(msg.author.id) as Member).permission.has('voiceMoveMembers')) {
            const interval = setInterval(async() => {
                let channelToMove: VoiceChannel;
                let countTo = 1;

                if (finalChannel.id === (textChannel.guild.channels.get(member.voiceState.channelID as string) as VoiceChannel).id) {
                    clearInterval(interval);
                    await msg.channel.createMessage('Elevator has arrived')
                    return;
                }

                do {
                    channelToMove = channels.filter(channel => {
                        if ((textChannel.guild.channels.get(member.voiceState.channelID as string) as VoiceChannel).position < finalChannel.position) {
                            return (textChannel.guild.channels.get(member.voiceState.channelID as string) as VoiceChannel).position + countTo === channel.position;
                        } else if ((textChannel.guild.channels.get(member.voiceState.channelID as string) as VoiceChannel).position > finalChannel.position) {
                            return (textChannel.guild.channels.get(member.voiceState.channelID as string) as VoiceChannel).position - countTo === channel.position;
                        }
                    })[0] as VoiceChannel;

                    countTo++;
                } while (!channelToMove.permissionsOf(member.id).has('voiceConnect'))

                await member.edit({
                    channelID: channelToMove.id
                })
            }, 1000)
        } else throw new BotException('Only allowed to members with move rights')
    }

    private getChannelByName(name: string, textChannel: TextChannel): VoiceChannel {
        const channels: Collection<Channel> = textChannel.guild.channels;

        const voiceChannelsWithName = channels.filter(channel => {
            if (channel instanceof VoiceChannel) {
                return channel.name === name
            } else return false;
        })

        if (voiceChannelsWithName.length < 1) {
            throw new BotException('VoiceChannel not found')
        } else return voiceChannelsWithName[0] as VoiceChannel;
    }
}