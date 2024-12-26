import { Denops } from "https://deno.land/x/denops_std@v1.0.0/mod.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async send(): Promise<void> {
      const currentLine = await denops.call("line", ".");
      const lineText = await denops.call("getline", ".");

      const tryCatchBlock = [
        "try {",
        `  ${lineText}`,
        "} catch (error) {",
        "  console.error(error);",
        "}"
      ];

      await denops.call("deletebufline", "%", currentLine);
      for (const [index, line] of tryCatchBlock.entries()) {
        await denops.call("append", currentLine - 1 + index, line);
      }
    }
  }

  await denops.cmd(
    `command! TcSend call denops#request('${denops.name}', 'send', [])`
  );
}
