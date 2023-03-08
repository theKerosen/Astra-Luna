import { Message } from "discord.js";
import { User } from "mee6-levels-api";

interface ICargo {
	role: string;
	nivel: number;
}

const cargos: Array<ICargo> = [
	{ role: "1006719636659769454", nivel: 5 }, // ativo
	{ role: "876576515792461824", nivel: 15 }, // junior
	{ role: "876576366328426587", nivel: 30 }, // pleno
	{ role: "876574595409379398", nivel: 50 }, // senior
	{ role: "1006732112138879036", nivel: 70 }, // lendario
	{ role: "1009567733710598334", nivel: 100 }, // centenario
];

const _apply = (message: Message, roleID: string, userID: string) =>
	message.guild?.members.fetch(userID).then((user) => user.roles.add(roleID));

export default function applyRole(message: Message, user: User) {
	cargos.forEach((cargo) => {
		if (user.level >= cargo.nivel) _apply(message, cargo.role, user.id);
	});
}