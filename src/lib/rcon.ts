import { Rcon } from "rcon-client";

// product id → LuckPerms group name
const GROUP_MAP: Record<string, string> = {
  vip:       "vip",
  dragon:    "dragon",
  diamond:   "diamond",
  emerald:   "emerald",
  netherite: "netherite",
  custom:    "custom",
};

// tier duration → LuckPerms duration string
const DURATION_MAP: Record<string, string | null> = {
  "14d":     "14d",
  "30d":     "30d",
  "forever": null, // null = permanent
};

export async function givePrivilege(
  nick: string,
  productId: string,
  tierDuration: string
): Promise<{ success: boolean; command: string; response: string }> {
  const host     = process.env.RCON_HOST;
  const port     = Number(process.env.RCON_PORT ?? 25575);
  const password = process.env.RCON_PASSWORD;

  if (!host || !password) {
    return { success: false, command: "", response: "RCON not configured" };
  }

  const group    = GROUP_MAP[productId] ?? productId;
  const duration = DURATION_MAP[tierDuration] ?? null;

  const command = duration
    ? `lp user ${nick} parent addtemp ${group} ${duration} rebase`
    : `lp user ${nick} parent add ${group}`;

  const rcon = new Rcon({ host, port, password, timeout: 5000 });

  try {
    await rcon.connect();
    const response = await rcon.send(command);
    await rcon.end();
    return { success: true, command, response };
  } catch (err) {
    try { await rcon.end(); } catch {}
    return { success: false, command, response: String(err) };
  }
}
