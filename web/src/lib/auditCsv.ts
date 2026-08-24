const CSV_HEADERS = ['id', 'action', 'secret_key', 'project', 'actor', 'ip_address', 'created_at', 'hmac'];

const escapeCell = (value: string): string =>
  /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

export const buildAuditCsv = (rows: Record<string, unknown>[]): string => {
  const lines = [CSV_HEADERS.join(',')];
  for (const row of rows) {
    lines.push(CSV_HEADERS.map((h) => escapeCell(String(row[h] ?? ''))).join(','));
  }
  return lines.join('\n');
};

export const downloadCsv = (filename: string, csv: string): void => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
