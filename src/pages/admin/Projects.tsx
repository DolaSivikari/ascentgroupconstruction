import { ContentRowActions } from "@/components/admin/ContentRowActions";
import { ListPagination } from "@/components/admin/ListControls";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Plus, Edit, Trash2, Eye, ArrowUpDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { generatePreviewToken } from "@/utils/previewToken";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { PreviewModal } from "@/components/admin/PreviewModal";
import { BulkActionsBar } from "@/components/admin/BulkActionsBar";
import { useBulkSelection } from "@/hooks/useBulkSelection";
import { useTableFilters } from "@/hooks/useTableFilters";
import { useTableSort } from "@/hooks/useTableSort";
import { useTablePagination } from "@/hooks/useTablePagination";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import type { Database } from "@/integrations/supabase/types";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ServiceSummary = Pick<
  Database["public"]["Tables"]["services"]["Row"],
  "id" | "name" | "category"
>;
type ProjectWithServices = ProjectRow & { services: ServiceSummary[] };

const Projects = () => {
  const navigate = useNavigate();
  const { isLoading: authLoading, isAdmin } = useAdminAuth();
  const [projects, setProjects] = useState<ProjectWithServices[]>([]);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<ServiceSummary[]>([]);
  const [selectedService, setSelectedService] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewProject, setPreviewProject] =
    useState<ProjectWithServices | null>(null);

  // Filtering, sorting, pagination
  const {
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    applyFilters,
  } = useTableFilters();
  const { sortConfig, requestSort, sortData } =
    useTableSort<ProjectWithServices>();

  // Apply filters and sort
  const filteredByService =
    selectedService === "all"
      ? projects
      : projects.filter((project) =>
          project.services?.some((s) => s.id === selectedService),
        );
  const filteredProjects = applyFilters(
    filteredByService,
    ["title", "client_name"],
    "created_at",
    "publish_state",
  );
  const sortedProjects = sortData(filteredProjects);

  // Pagination
  const {
    paginatedData,
    currentPage,
    totalPages,
    itemsPerPage,
    changeItemsPerPage,
    goToPage,
    totalItems,
    startIndex,
    endIndex,
  } = useTablePagination(sortedProjects, [25, 50, 100]);

  // Bulk selection
  const {
    selectedIds,
    selectedCount,
    toggleItem,
    toggleAll,
    clearSelection,
    isSelected,
    isAllSelected,
  } = useBulkSelection(paginatedData);

  useEffect(() => {
    if (!isAdmin) return;
    loadProjects();
    loadServices();
  }, [isAdmin]);

  const loadServices = async () => {
    const { data } = await supabase
      .from("services")
      .select("id, name, category")
      .eq("publish_state", "published")
      .order("name");

    if (data) {
      setServices(data);
    }
  };

  const loadProjects = async () => {
    setIsLoading(true);
    setLoadError("");
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setLoadError("Could not load projects. " + error.message);
      toast.error("Failed to load projects");
    } else {
      const projectsWithServices = await Promise.all(
        (data || []).map(async (project) => {
          const { data: projectServices } = await supabase
            .from("project_services")
            .select("service_id, services(id, name, category)")
            .eq("project_id", project.id);

          return {
            ...project,
            services:
              projectServices
                ?.map((ps) => ps.services)
                .filter((service): service is ServiceSummary => !!service) ||
              [],
          };
        }),
      );

      setProjects(projectsWithServices);
    }
    setIsLoading(false);
  };

  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectToDelete);

    if (error) {
      toast.error("Failed to delete project");
    } else {
      toast.success("Project deleted successfully");
      loadProjects();
    }
    setProjectToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleViewProject = (project: ProjectWithServices) => {
    setPreviewProject(project);
    setPreviewModalOpen(true);
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    const { error } = await supabase.from("projects").delete().in("id", ids);

    if (error) {
      toast.error("Failed to delete projects");
      throw error;
    } else {
      toast.success(`${ids.length} projects deleted`);
      clearSelection();
      loadProjects();
    }
  };

  const handleBulkStatusChange = async (status: string) => {
    const ids = Array.from(selectedIds);
    const { error } = await supabase
      .from("projects")
      .update({
        publish_state: status as
          | "published"
          | "draft"
          | "archived"
          | "scheduled",
      })
      .in("id", ids);

    if (error) {
      toast.error("Failed to update projects");
      throw error;
    } else {
      toast.success(`${ids.length} projects updated to ${status}`);
      clearSelection();
      loadProjects();
    }
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="h-4 w-4 ml-2 opacity-50" />;
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const getStatusColor = (status: ProjectRow["publish_state"]) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "secondary";
      default:
        return "secondary";
    }
  };

  if (authLoading) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminPageLayout
      error={loadError}
      title="Projects"
      description="Manage your portfolio projects"
      actions={
        <button
          className="business-btn business-btn-primary"
          onClick={() => navigate("/admin/projects/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </button>
      }
    >
      <div className="flex flex-wrap gap-3">
        <Input
          className="max-w-sm"
          aria-label="Search projects"
          placeholder="Search projects or clients"
          value={filters.search}
          onChange={(event) => {
            updateFilter("search", event.target.value);
            goToPage(1);
          }}
        />
        <select
          className="border rounded-lg bg-background px-3 py-2"
          aria-label="Filter projects by status"
          value={filters.status[0] || "all"}
          onChange={(event) => {
            updateFilter(
              "status",
              event.target.value === "all" ? [] : [event.target.value],
            );
            goToPage(1);
          }}
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <Button variant="outline" onClick={() => requestSort("title")}>
          Sort title {getSortIcon("title")}
        </Button>
        <Button variant="outline" onClick={() => requestSort("updated_at")}>
          Sort updated {getSortIcon("updated_at")}
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={() => {
              clearFilters();
              goToPage(1);
            }}
          >
            Clear filters
          </Button>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={() => toggleAll()}
          aria-label="Select projects on this page"
        />
        <span className="text-sm">Select this page</span>
      </div>
      <BulkActionsBar
        selectedCount={selectedCount}
        onClearSelection={clearSelection}
        onDelete={handleBulkDelete}
        onStatusChange={handleBulkStatusChange}
        statusOptions={[
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" },
          { label: "Archived", value: "archived" },
        ]}
      />
      {/* Service Filter */}
      {services.length > 0 && (
        <div className="business-glass-card p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="font-medium text-foreground">
              Filter by Service:
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="business-input max-w-xs"
            >
              <option value="all">All Services ({projects.length})</option>
              {services.map((service) => {
                const count = projects.filter((p) =>
                  p.services?.some((s) => s.id === service.id),
                ).length;
                return (
                  <option key={service.id} value={service.id}>
                    {service.name} ({count})
                  </option>
                );
              })}
            </select>
            {selectedService !== "all" && (
              <Badge variant="secondary">
                {filteredProjects.length} project
                {filteredProjects.length !== 1 ? "s" : ""} found
              </Badge>
            )}
          </div>
        </div>
      )}

      <div>
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading projects...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="business-glass-card p-8 text-center">
            <p className="text-muted-foreground mb-4">
              {selectedService === "all"
                ? "No projects yet. Create your first project to get started."
                : "No projects found with this service. Try a different filter."}
            </p>
            {selectedService === "all" ? (
              <button
                className="business-btn business-btn-primary"
                onClick={() => navigate("/admin/projects/new")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </button>
            ) : (
              <button
                className="business-btn business-btn-secondary"
                onClick={() => setSelectedService("all")}
              >
                Clear Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedData.map((project) => (
              <div key={project.id} className="business-glass-card p-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={getStatusColor(project.publish_state)}>
                    {project.publish_state}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={isSelected(project.id)}
                      onCheckedChange={() => toggleItem(project.id)}
                      aria-label={`Select ${project.title}`}
                    />
                    <ContentRowActions
                      table="projects"
                      id={project.id}
                      title={project.title}
                      slug={project.slug}
                      state={project.publish_state || "draft"}
                      onDelete={() => handleDeleteClick(project.id)}
                      onDone={() => void loadProjects()}
                    />
                  </div>
                </div>
                {project.featured_image && (
                  <img
                    src={project.featured_image}
                    alt=""
                    className="w-full h-32 rounded-lg object-cover mb-3"
                    loading="lazy"
                  />
                )}
                <p className="text-xs text-muted-foreground mb-2">
                  Updated{" "}
                  {project.updated_at
                    ? new Date(project.updated_at).toLocaleDateString()
                    : "date not recorded"}
                </p>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {project.title}
                </h3>
                {project.subtitle && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {project.subtitle}
                  </p>
                )}
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  {project.client_name && (
                    <div>Client: {project.client_name}</div>
                  )}
                  {project.location && <div>Location: {project.location}</div>}
                  {project.category && (
                    <Badge variant="info">{project.category}</Badge>
                  )}
                  {project.services && project.services.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.services.map((service) => (
                        <Badge
                          key={service.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {service.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ListPagination
        page={currentPage}
        pages={totalPages}
        count={totalItems}
        onPage={goToPage}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone and will remove all associated data."
        confirmText="Delete"
        variant="destructive"
      />
    </AdminPageLayout>
  );
};

export default Projects;
