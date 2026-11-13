export function decodeCsvBytes(
  bytes: Uint8Array,
  encoding = "windows-1252"
): string {
  try {
    return new TextDecoder(encoding, { fatal: true }).decode(bytes);
  } catch (error) {
    const detail = error instanceof Error ? `: ${error.message}` : "";
    throw new Error(`Could not decode CSV using ${encoding}${detail}`);
  }
}

export function createUtf8CsvBlob(csv: string): Blob {
  return new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });
}
