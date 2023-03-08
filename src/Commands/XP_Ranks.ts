import { Command } from "../utils/command";
import { Embed } from "../Constructors/Embed";

export = {
	data: {
		name: "xp",
		description: "XP > ...",
		type: "ACTION_ROW",
		options: [
			{
				name: "tabela",
				description: "XP > Tabela",
				type: "SUB_COMMAND",
			},
		],
	},
	execute(client, interaction) {
		const embed = new Embed().builder(
			"",
			`<@&729692324845584415> = nível 0 a 4\n
                <@&1006719636659769454> = nível 5 a 14\n
                <@&876576515792461824> = nível 15 a 29\n
                <@&876576366328426587> = nível 30 a 49\n
                <@&876574595409379398> = nível 50 a 69\n
                <@&1006732112138879036> = nível 70 a 99\n
                <@&1009567733710598334> = nível 100+`,
			"ORANGE",
			"Os cargos são atribuídos automaticamente a você."
		);
		interaction.reply({ embeds: [embed], ephemeral: true });
	},
} as Command;