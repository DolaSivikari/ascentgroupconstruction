import type { ReactNode } from "react";
import {
  AdminSectionWorkspace,
  AdminSectionScreen,
} from "./AdminSectionWorkspace";
export interface EditorSection {
  id: string;
  title: string;
  content: ReactNode;
}
export function EditorSections({ sections }: { sections: EditorSection[] }) {
  return (
    <AdminSectionWorkspace items={sections}>
      {sections.map((section) => (
        <AdminSectionScreen
          key={section.id}
          id={section.id}
          title={section.title}
        >
          <div className="rounded-lg border bg-card p-4 sm:p-6 space-y-4">
            {section.content}
          </div>
        </AdminSectionScreen>
      ))}
    </AdminSectionWorkspace>
  );
}
