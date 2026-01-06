type ExportFormat = 'csv' | 'excel';

interface ExportColumn<T> {
  key: keyof T | string;
  header: string;
  formatter?: (value: any, row: T) => string;
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
  if (value instanceof Date) return value.toLocaleDateString('fr-FR');
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportToCSV<T>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string
): void {
  const headers = columns.map(col => escapeCSV(col.header)).join(',');
  
  const rows = data.map(row => {
    return columns.map(col => {
      const rawValue = getNestedValue(row, col.key as string);
      const formattedValue = col.formatter 
        ? col.formatter(rawValue, row)
        : formatValue(rawValue);
      return escapeCSV(formattedValue);
    }).join(',');
  });
  
  const csvContent = [headers, ...rows].join('\n');
  const BOM = '\uFEFF'; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  downloadBlob(blob, `${filename}.csv`);
}

export function exportToExcel<T>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string
): void {
  // Create XML-based Excel format (simpler than xlsx library)
  const rows = data.map(row => {
    return columns.map(col => {
      const rawValue = getNestedValue(row, col.key as string);
      return col.formatter 
        ? col.formatter(rawValue, row)
        : formatValue(rawValue);
    });
  });

  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Export">
    <Table>
      <Row>
        ${columns.map(col => `<Cell><Data ss:Type="String">${escapeXML(col.header)}</Data></Cell>`).join('')}
      </Row>
      ${rows.map(row => `
      <Row>
        ${row.map(cell => `<Cell><Data ss:Type="String">${escapeXML(cell)}</Data></Cell>`).join('')}
      </Row>`).join('')}
    </Table>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel' });
  downloadBlob(blob, `${filename}.xls`);
}

function escapeXML(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Pre-configured export functions for each module
export const roomsExportColumns = [
  { key: 'number', header: 'Numéro' },
  { key: 'floor', header: 'Étage' },
  { key: 'type', header: 'Type' },
  { key: 'status', header: 'Statut' },
  { key: 'capacity', header: 'Capacité' },
  { key: 'price_per_night', header: 'Prix/nuit (€)' },
  { key: 'amenities', header: 'Équipements' },
];

export const guestsExportColumns = [
  { key: 'first_name', header: 'Prénom' },
  { key: 'last_name', header: 'Nom' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Téléphone' },
  { key: 'nationality', header: 'Nationalité' },
  { key: 'vip', header: 'VIP' },
  { key: 'total_stays', header: 'Séjours' },
  { key: 'loyalty_points', header: 'Points fidélité' },
];

export const reservationsExportColumns = [
  { key: 'reservation_number', header: 'Référence' },
  { key: 'guest.first_name', header: 'Prénom client' },
  { key: 'guest.last_name', header: 'Nom client' },
  { key: 'room.number', header: 'Chambre' },
  { key: 'check_in', header: 'Arrivée' },
  { key: 'check_out', header: 'Départ' },
  { key: 'adults', header: 'Adultes' },
  { key: 'children', header: 'Enfants' },
  { key: 'status', header: 'Statut' },
  { key: 'source', header: 'Source' },
  { key: 'total_amount', header: 'Montant (€)' },
  { key: 'paid_amount', header: 'Payé (€)' },
];

export const invoicesExportColumns = [
  { key: 'invoice_number', header: 'N° Facture' },
  { key: 'guest.first_name', header: 'Prénom client' },
  { key: 'guest.last_name', header: 'Nom client' },
  { key: 'type', header: 'Type' },
  { key: 'status', header: 'Statut' },
  { key: 'subtotal', header: 'Sous-total (€)' },
  { key: 'tax_rate', header: 'TVA (%)' },
  { key: 'tax_amount', header: 'Montant TVA (€)' },
  { key: 'total_amount', header: 'Total (€)' },
  { key: 'paid_amount', header: 'Payé (€)' },
  { key: 'created_at', header: 'Date création', formatter: (v: string) => new Date(v).toLocaleDateString('fr-FR') },
];

export const ordersExportColumns = [
  { key: 'order_number', header: 'N° Commande' },
  { key: 'order_type', header: 'Type' },
  { key: 'table.number', header: 'Table' },
  { key: 'room.number', header: 'Chambre' },
  { key: 'guest.first_name', header: 'Prénom client' },
  { key: 'guest.last_name', header: 'Nom client' },
  { key: 'status', header: 'Statut' },
  { key: 'subtotal', header: 'Sous-total (€)' },
  { key: 'tax_amount', header: 'TVA (€)' },
  { key: 'total_amount', header: 'Total (€)' },
  { key: 'created_at', header: 'Date', formatter: (v: string) => new Date(v).toLocaleDateString('fr-FR') },
];

export const menuItemsExportColumns = [
  { key: 'name', header: 'Nom' },
  { key: 'category', header: 'Catégorie' },
  { key: 'price', header: 'Prix (€)' },
  { key: 'description', header: 'Description' },
  { key: 'available', header: 'Disponible' },
];

export const tablesExportColumns = [
  { key: 'number', header: 'Numéro' },
  { key: 'capacity', header: 'Capacité' },
  { key: 'location', header: 'Emplacement' },
  { key: 'status', header: 'Statut' },
];
