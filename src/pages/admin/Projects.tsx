import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Plus, Edit, Trash2, Eye, ArrowUpDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { generatePreviewToken } from '@/utils/previewToken';
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { PreviewModal } from '@/components/admin/PreviewModal';
import { BulkActionsBar } from '@/components/admin/BulkActionsBar';
import { useBulkSelection } from '@/hooks/useBulkSelection';
import { useTableFilters } from '@/hooks/useTableFilters';
import { useTableSort } from '@/hooks/useTableSort';
import { useTablePagination } from '@/hooks/useTablePagination';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const Projects = () => {
  const navigate = useNavigate();
  const { isLoading: authLoading, isAdmin } = useAdminAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState<any>(null);
  
  // Filtering, sorting, pagination
  const { filters, updateFilter, clearFilters, hasActiveFilters, applyFilters } = useTableFilters();
  const { sortConfig, requestSort, sortData } = useTableSort<any>();
  
  // Apply filters and sort
  const filteredByService = selectedService === 'all' ? projects : projects.filter(project => 
    project.services?.some((s: any) => s.id === selectedService)
  );
  const filteredProjects = applyFilters(filteredByService, ['title', 'client_name'], 'created_at', 'publish_state');
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
    endIndex
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
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
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
            services: projectServices?.map((ps: any) => ps.services) || []
          };
        })
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

  const handleViewProject = (project: any) => {
    setPreviewProject(project);
    setPreviewModalOpen(true);
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    const { error } = await supabase
      .from("projects")
      .delete()
      .in("id", ids);

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
      .update({ publish_state: status as 'published' | 'draft' | 'archived' | 'scheduled' })
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
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4 ml-2 opacity-50" />;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "success";
      case "draft": return "warning";
      case "archived": return "secondary";
      default: return "secondary";
    }
  };

  if (authLoading) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="business-page-title">Projects</h1>
          <p className="business-page-subtitle">Manage your portfolio projects</p>
        </div>
        <button className="business-btn business-btn-primary" onClick={() => navigate("/admin/projects/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </button>
      </div>

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
              {services.map(service => {
                const count = projects.filter(p => 
                  p.services?.some((s: any) => s.id === service.id)
                ).length;
                return (
                  <option key={service.id} value={service.id}>
                    {service.name} ({count})
                  </option>
                );
              })}
            </select>
            {selectedService !== 'all' && (
              <Badge variant="secondary">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
              </Badge>
            )}
          </div>
        </div>
      )}

      <div>
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="business-glass-card p-8 text-center">
            <p className="text-muted-foreground mb-4">
              {selectedService === 'all' 
                ? 'No projects yet. Create your first project to get started.'
                : 'No projects found with this service. Try a different filter.'}
            </p>
            {selectedService === 'all' ? (
              <button className="business-btn business-btn-primary" onClick={() => navigate("/admin/projects/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </button>
            ) : (
              <button className="business-btn business-btn-secondary" onClick={() => setSelectedService('all')}>
                Clear Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div key={project.id} className="business-glass-card p-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={getStatusColor(project.publish_state)}>
                    {project.publish_state}
                  </Badge>
                  <div className="flex gap-2">
                    <button 
                      className="business-btn business-btn-ghost p-2"
                      onClick={() => navigate(`/admin/projects/${project.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      className="business-btn business-btn-ghost p-2"
                      onClick={() => {
                        setProjectToDelete(project.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{project.title}</h3>
                {project.subtitle && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {project.subtitle}
                  </p>
                )}
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  {project.client_name && (
                    <div>Client: {project.client_name}</div>
                  )}
                  {project.location && (
                    <div>Location: {project.location}</div>
                  )}
                  {project.category && (
                    <Badge variant="info">{project.category}</Badge>
                  )}
                  {project.services && project.services.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.services.map((service: any) => (
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

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone and will remove all associated data."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
};

export default Projects;
