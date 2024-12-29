import { Denops } from "https://deno.land/x/denops_std@v1.0.0/mod.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async send(): Promise<void> {
      const currentLine = await denops.call("line", ".");
      const startLine = await denops.call("line", "'<");
      const endLine = await denops.call("line", "'>");
      const selectedLines: string[] = await denops.call("getline", startLine, endLine);
      const aboveLine = await denops.call("getline", startLine - 1);
      const baseIndent = aboveLine.match(/^\s*/)?.[0] || "";
      const deeperIndent = baseIndent + "  ";

      const tryCatchBlock = [
        `${deeperIndent}try {`,
        ...selectedLines.map(line => `${baseIndent}  ${line}`),
        `${deeperIndent}} catch (error) {`,
        `${deeperIndent}  console.error(error);`,
        `${deeperIndent}}`
      ];

      await denops.call("deletebufline", "%", currentLine, endLine);
      for (const [index, line] of tryCatchBlock.entries()) {
        await denops.call("append", currentLine - 1 + index, line);
      }
    }
  }

  await denops.cmd(
    `command! TcSend call denops#request('${denops.name}', 'send', [])`
  );
}
