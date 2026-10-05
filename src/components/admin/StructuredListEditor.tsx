import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
export function StructuredListEditor({
  label,
  fields,
  rows,
  onChange,
  limit = 30,
}: {
  label: string;
  fields: { key: string; label: string; multiline?: boolean }[];
  rows: Record<string, string | number>[];
  onChange: (rows: Record<string, string | number>[]) => void;
  limit?: number;
}) {
  const move = (index: number, direction: number) => {
    const next = [...rows];
    [next[index], next[index + direction]] = [
      next[index + direction],
      next[index],
    ];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">{label}</h3>
      {rows.map((row, index) => (
        <div key={index} className="rounded-lg border p-3 space-y-3">
          {fields.map((field) => (
            <div key={field.key} className="space-y-1">
              <Label htmlFor={`${label}-${index}-${field.key}`}>
                {field.label}
              </Label>
              {field.multiline ? (
                <Textarea
                  id={`${label}-${index}-${field.key}`}
                  value={String(row[field.key] || "")}
                  onChange={(event) =>
                    onChange(
                      rows.map((value, position) =>
                        position === index
                          ? { ...value, [field.key]: event.target.value }
                          : value,
                      ),
                    )
                  }
                />
              ) : (
                <Input
                  id={`${label}-${index}-${field.key}`}
                  value={String(row[field.key] || "")}
                  onChange={(event) =>
                    onChange(
                      rows.map((value, position) =>
                        position === index
                          ? { ...value, [field.key]: event.target.value }
                          : value,
                      ),
                    )
                  }
                />
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!index}
              onClick={() => move(index, -1)}
            >
              Up
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={index === rows.length - 1}
              onClick={() => move(index, 1)}
            >
              Down
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onChange(rows.filter((_, position) => position !== index))
              }
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        disabled={rows.length >= limit}
        onClick={() =>
          onChange([
            ...rows,
            Object.fromEntries(fields.map((field) => [field.key, ""])),
          ])
        }
      >
        Add {label.toLowerCase()} item
      </Button>
    </div>
  );
}
