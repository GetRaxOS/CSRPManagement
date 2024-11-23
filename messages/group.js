module.exports = {
    roles: ["1236526332712587318", "1236526332712587314", "1236526332700131413"],
    name: 'group',
    description: "Gets the Tampa Roleplay group link!",
    cooldown: 5,
    async execute(message, client, args) {
        await message.delete();
        message.channel.send({ content: `<:TRP_Roblox:1277338300025274501> The [Tampa Roleplay](<https://www.roblox.com/groups/33102342/Tampa-Roleplay>) group can be found here!\n-# <:TRP_World:1277336783016689706> Join this group for official Tampa giveaways and more.` })
    }
}