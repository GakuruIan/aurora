let extractor: any = null;

export async function getEmbeddings(text: string): Promise<number[]> {
  const { pipeline, env } = await import("@xenova/transformers");

  // ✅ Force WASM backend before loading any model
  env.backends.onnx.backend = "wasm";
  env.backends.onnx.wasm.numThreads = 1;

  if (!extractor) {
    try {
      extractor = await pipeline(
        "feature-extraction",
        "Xenova/bge-small-en-v1.5"
      );
    } catch (error) {
      console.error("[Model loading error]:", error);
    }
  }

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  if (output.length === 0) {
    throw new Error("No output from model");
  }

  return Array.from(output[0].data);
}
