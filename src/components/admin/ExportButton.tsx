import { useState } from 'react';
import { Button } from '@/ui/Button';
import { Download, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface ExportColumn {
  key: string;
  label: string;
  enabled: boolean;
}

interface ExportButtonProps {
  data: any[];
  filename: string;
  columns: ExportColumn[];
  onExport?: (selectedColumns: ExportColumn[], format: 'csv' | 'excel') => void;
}

export const ExportButton = ({ data, filename, columns: initialColumns, onExport }: ExportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [columns, setColumns] = useState<ExportColumn[]>(initialColumns);
  const [format, setFormat] = useState<'csv' | 'excel'>('csv');
  const [isExporting, setIsExporting] = useState(false);

  const toggleColumn = (key: string) => {
    setColumns(columns.map(col => 
      col.key === key ? { ...col, enabled: !col.enabled } : col
    ));
  };

  const selectAll = () => {
    setColumns(columns.map(col => ({ ...col, enabled: true })));
  };

  const deselectAll = () => {
    setColumns(columns.map(col => ({ ...col, enabled: false })));
  };

  const handleExport = async () => {
    const selectedColumns = columns.filter(col => col.enabled);
    
    if (selectedColumns.length === 0) {
      toast.error('Please select at least one column to export');
      return;
    }

    setIsExporting(true);

    try {
      if (onExport) {
        onExport(selectedColumns, format);
      } else {
        // Default export logic
        if (format === 'csv') {
          exportToCSV(data, selectedColumns, filename);
        } else {
          exportToExcel(data, selectedColumns, filename);
        }
      }

      toast.success(`Data exported successfully as ${format.toUpperCase()}`);
      setIsOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Select columns and format for export ({data.length} rows)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={format} onValueChange={(value: 'csv' | 'excel') => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                <SelectItem value="excel">Excel (XLSX)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Column Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Select Columns</Label>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={selectAll} className="h-7 text-xs">
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={deselectAll} className="h-7 text-xs">
                  Deselect All
                </Button>
              </div>
            </div>
            <div className="border rounded-lg p-3 max-h-[300px] overflow-y-auto space-y-2">
              {columns.map((column) => (
                <div key={column.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.key}
                    checked={column.enabled}
                    onCheckedChange={() => toggleColumn(column.key)}
                  />
                  <Label
                    htmlFor={column.key}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {column.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// CSV Export
function exportToCSV(data: any[], columns: ExportColumn[], filename: string) {
  const headers = columns.map(col => col.label);
  const rows = data.map(row => 
    columns.map(col => {
      const value = row[col.key];
      // Handle special cases
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      // Escape commas and quotes
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    })
  );

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  downloadFile(csv, `${filename}.csv`, 'text/csv');
}

// Excel Export (simple XLSX format)
function exportToExcel(data: any[], columns: ExportColumn[], filename: string) {
  // For now, we'll export as CSV with .xlsx extension
  // For full Excel support, we'd need to add the 'xlsx' library
  const headers = columns.map(col => col.label);
  const rows = data.map(row => 
    columns.map(col => row[col.key] ?? '')
  );

  // Create TSV (Tab Separated Values) which Excel can open
  const tsv = [
    headers.join('\t'),
    ...rows.map(row => row.map(cell => 
      typeof cell === 'object' ? JSON.stringify(cell) : String(cell)
    ).join('\t'))
  ].join('\n');

  downloadFile(tsv, `${filename}.xlsx`, 'application/vnd.ms-excel');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
