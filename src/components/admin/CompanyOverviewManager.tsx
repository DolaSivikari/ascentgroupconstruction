import { useState } from "react";
import { useCompanyOverviewAdmin } from "@/hooks/useCompanyOverviewAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const CompanyOverviewManager = () => {
  const { sections, items, isLoading, createSection, updateSection, deleteSection, createItem, updateItem, deleteItem } = useCompanyOverviewAdmin();
  const [activeTab, setActiveTab] = useState<string>("approach");
  const [editingSection, setEditingSection] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [sectionForm, setSectionForm] = useState({ title: "", section_type: "", description: "" });
  const [itemForm, setItemForm] = useState({ title: "", content: "", icon_name: "" });

  const sectionTypes = [
    { value: "approach", label: "Our Approach" },
    { value: "values", label: "Our Values" },
    { value: "promise", label: "Our Promise" },
  ];

  const getSectionsByType = (type: string) => sections.filter((s: any) => s.section_type === type);
  const getItemsBySection = (sectionId: string) => items.filter((i: any) => i.section_id === sectionId);

  const handleSectionSubmit = async () => {
    if (!sectionForm.title || !sectionForm.section_type) return;
    
    if (editingSection) {
      await updateSection.mutateAsync({ id: editingSection.id, ...sectionForm });
      setEditingSection(null);
    } else {
      await createSection.mutateAsync({ ...sectionForm, display_order: sections.length });
    }
    setSectionForm({ title: "", section_type: "", description: "" });
  };

  const handleItemSubmit = async (sectionId: string) => {
    if (!itemForm.content) return;
    
    if (editingItem) {
      await updateItem.mutateAsync({ id: editingItem.id, ...itemForm });
      setEditingItem(null);
    } else {
      await createItem.mutateAsync({ 
        ...itemForm, 
        section_id: sectionId,
        display_order: getItemsBySection(sectionId).length 
      });
    }
    setItemForm({ title: "", content: "", icon_name: "" });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {sectionTypes.map((type) => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {sectionTypes.map((type) => (
          <TabsContent key={type.value} value={type.value} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Section Title</Label>
                  <Input
                    value={sectionForm.title}
                    onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value, section_type: type.value })}
                    placeholder="e.g., Quality First"
                  />
                </div>
                <div>
                  <Label>Description (optional)</Label>
                  <Textarea
                    value={sectionForm.description}
                    onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                    placeholder="Brief description..."
                  />
                </div>
                <Button onClick={handleSectionSubmit}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {getSectionsByType(type.value).map((section: any) => (
                <Card key={section.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingSection(section)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { if (confirm("Delete section?")) deleteSection.mutate(section.id); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {section.description && <p className="text-sm text-muted-foreground">{section.description}</p>}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Add Item to Section</Label>
                      <div className="space-y-2 mt-2">
                        <Input
                          placeholder="Item title (optional)"
                          value={itemForm.title}
                          onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                        />
                        <Textarea
                          placeholder="Item content..."
                          value={itemForm.content}
                          onChange={(e) => setItemForm({ ...itemForm, content: e.target.value })}
                          rows={2}
                        />
                        <Input
                          placeholder="Icon name (optional)"
                          value={itemForm.icon_name}
                          onChange={(e) => setItemForm({ ...itemForm, icon_name: e.target.value })}
                        />
                        <Button size="sm" onClick={() => handleItemSubmit(section.id)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {getItemsBySection(section.id).map((item: any) => (
                        <div key={item.id} className="flex items-start justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            {item.title && <h5 className="font-medium">{item.title}</h5>}
                            <p className="text-sm text-muted-foreground">{item.content}</p>
                            {item.icon_name && <Badge variant="outline" className="mt-1">{item.icon_name}</Badge>}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); setItemForm({ title: item.title || "", content: item.content, icon_name: item.icon_name || "" }); }}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { if (confirm("Delete item?")) deleteItem.mutate(item.id); }}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
