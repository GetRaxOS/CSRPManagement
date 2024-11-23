require("./utils/ProcessHandlers.js")();

const PREFIX = "-";

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField: { Flags: Permissions },
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

client.config = require("./config.json");
client.logs = require("./utils/Logs.js");
client.cooldowns = new Map();

require("./utils/ComponentLoader.js")(client);
require("./utils/EventLoader.js")(client);
require("./utils/RegisterCommands.js")(client);




client.logs.info(`Logging in...`);
client.login(client.config.TOKEN);
client.on("ready", function () {
  client.logs.custom(`Logged in as ${client.user.tag}!`, 0x7946ff);

  // It's a weird place but I am assuming by the time it logs in you are finished adding events
  // Adding events after it runs this function will not get checked
  require("./utils/CheckIntents.js")(client);
});

client.on("guildCreate", () => {});

function CheckAccess(requiredRoles, userIDs, member, user) {
  if (member && requiredRoles) {
    const hasRole = requiredRoles.some((roleID) =>
      member._roles.includes(roleID)
    );
    if (!hasRole && !member.permissions.has("Administrator")) {
      throw ["You don't have permission to use this command!", "Missing roles"];
    }
  }

  if (Array.isArray(userIDs) && !userIDs.includes(user.id)) {
    throw [
      "You don't have permission to use this command!",
      "User not whitelisted",
    ];
  }
}

function CheckPermissions(permissionsArray, member) {
  if (!Array.isArray(permissionsArray) || !member) return;

  const prefix = member.user.id === client.id ? "I am" : "You are";

  const missingPermissions = [];
  if (permissionsArray.length === 0) return;
  for (const permission of permissionsArray) {
    if (member.permissions.has(Permissions[permission])) continue;
    missingPermissions.push(permission);
  }

  if (missingPermissions.length > 0) {
    throw [
      `${prefix} missing the following permissions: \`${missingPermissions.join(
        "`, `"
      )}\``,
      "Missing permissions",
    ];
  }
}

function CheckCooldown(userID, command, cooldown) {
  const timeRemaining = client.cooldowns.get(`${userID}-${command}`) ?? 0;
  const remaining = (timeRemaining - Date.now()) / 1000;
  if (remaining > 0) {
    throw [
      `Please wait ${remaining.toFixed(
        1
      )} more seconds before reusing the \`${command}\` command!`,
      "On cooldown",
    ];
  }
  client.cooldowns.set(`${userID}-${command}`, Date.now() + cooldown * 1000);
}

async function InteractionHandler(interaction, type) {
  const args = interaction.customId?.split("_") ?? [];
  const name = args.shift();

  interaction.deferUpdate ??= interaction.deferReply;

  const component = client[type].get(name ?? interaction.commandName);
  if (!component) {
    await interaction
      .reply({
        content: `There was an error while executing this command!\n\`\`\`Command not found\`\`\``,
        ephemeral: true,
      })
      .catch(() => {});
    client.logs.error(`${type} not found: ${interaction.customId}`);
    return;
  }

  try {
    CheckAccess(
      component.roles,
      component.users,
      interaction.member,
      interaction.user
    );
    CheckCooldown(
      interaction.user.id,
      component.customID ?? interaction.commandName,
      component.cooldown
    );

    const botMember =
      interaction.guild?.members.cache.get(client.user.id) ??
      (await interaction.guild?.members
        .fetch(client.user.id)
        .catch(() => null));
    if (botMember !== null) {
      // This code will only trigger if
      // 1) Bot is in the guild (always will)
      // 2) Command not being run in DMs
      // 3) Client has GuildMembers intent
      // 4) Not actively rate limited
      CheckPermissions(component.clientPerms, botMember); // bot
      CheckPermissions(component.userPerms, interaction.member); // user
    }
  } catch ([response, reason]) {
    await interaction
      .reply({
        content: response,
        ephemeral: true,
      })
      .catch(() => {});
    client.logs.error(`Blocked user from ${type}: ${reason}`);
    return;
  }

  try {
    if (interaction.isAutocomplete()) {
      await component.autocomplete(
        interaction,
        client,
        type === "commands" ? undefined : args
      );
    } else {
      await component.execute(
        interaction,
        client,
        type === "commands" ? undefined : args
      );
    }
  } catch (error) {
    client.logs.error(error.stack);
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    await interaction
      .editReply({
        content: `There was an error while executing this command!\n\`\`\`${error}\`\`\``,
        embeds: [],
        components: [],
        files: [],
        ephemeral: true,
      })
      .catch(() => {});
  }
}

client.on("interactionCreate", async function (interaction) {
  if (!interaction.isCommand() && !interaction.isAutocomplete()) return;

  const subcommand = interaction.options._subcommand ?? "";
  const subcommandGroup = interaction.options._subcommandGroup ?? "";
  const commandArgs = interaction.options._hoistedOptions ?? [];
  const args = `${subcommandGroup} ${subcommand} ${commandArgs
    .map((arg) => arg.value)
    .join(" ")}`.trim();
  // client.logs.info(
  //   `${interaction.user.tag} (${interaction.user.id}) > /${interaction.commandName} ${args}`
  // );

  await InteractionHandler(interaction, "commands");
});

client.on("interactionCreate", async function (interaction) {
  if (!interaction.isButton()) return;
  // client.logs.info(
  //   `${interaction.user.tag} (${interaction.user.id}) > [${interaction.customId}]`
  // );
  await InteractionHandler(interaction, "buttons");
});

client.on("interactionCreate", async function (interaction) {
  if (!interaction.isStringSelectMenu()) return;
  // client.logs.info(
  //   `${interaction.user.tag} (${interaction.user.id}) > <${interaction.customId}>`
  // );
  await InteractionHandler(interaction, "menus");
});

client.on("interactionCreate", async function (interaction) {
  if (!interaction.isModalSubmit()) return;
  // client.logs.info(
  //   `${interaction.user.tag} (${interaction.user.id}) > {${interaction.customId}}`
  // );
  await InteractionHandler(interaction, "modals");
});

client.on("messageCreate", async function (message) {
  if (message.author.bot) return;
  if (!message.content?.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).split(/\s+/);
  const name = args.shift().toLowerCase();

  const command = client.messages.get(name);
  if (!command) {
    client.logs.error(`Command not found: ${name}`);
    const errorMsg = await message
      .reply(
        `There was an error while executing this command!\n\`\`\`Command not found\`\`\``
      )
      .catch(() => {});
    // Delete message after 5 seconds to simulate ephemeral behavior
    setTimeout(() => errorMsg.delete().catch(() => {}), 5000);
    return;
  }

  try {
    CheckAccess(command.roles, command.users, message.member, message.author);
    CheckCooldown(message.author.id, name, command.cooldown);

    const botMember =
      message.guild?.members.cache.get(client.user.id) ??
      (await message.guild?.members.fetch(client.user.id).catch(() => null));
    if (botMember !== null) {
      CheckPermissions(command.clientPerms, botMember); // bot
      CheckPermissions(command.userPerms, message.member); // user
    }
  } catch ([response, reason]) {
    const reply = await message.reply(response).catch(() => {});
    // Delete the error response after 5 seconds
    setTimeout(() => reply.delete().catch(() => {}), 5000);
    client.logs.error(`Blocked user from message: ${reason}`);
    return;
  }

  try {
    await command.execute(message, client, args);
  } catch (error) {
    client.logs.error(error.stack);
    const errorMsg = await message
      .reply(
        `There was an error while executing this command!\n\`\`\`${error}\`\`\``
      )
      .catch(() => {});
    // Delete message after 5 seconds to simulate ephemeral behavior
    setTimeout(() => errorMsg.delete().catch(() => {}), 5000);
  } finally {
    client.cooldowns.set(
      message.author.id,
      Date.now() + command.cooldown * 1000
    );
    setTimeout(
      client.cooldowns.delete.bind(client.cooldowns, message.author.id),
      command.cooldown * 1000
    );
  }
});
