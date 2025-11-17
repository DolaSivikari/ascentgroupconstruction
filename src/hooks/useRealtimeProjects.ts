import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Project {
  id: string;
  title: string;
  slug: string;
  featured_image: string | null;
  category: string | null;
  publish_state: string;
  created_at: string;
}

export const useRealtimeProjects = (initialProjects: Project[]) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupRealtimeSubscription = async () => {
      channel = supabase
        .channel('public-projects-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'projects',
            filter: 'publish_state=eq.published'
          },
          (payload) => {
            console.log('Realtime update:', payload);

            if (payload.eventType === 'INSERT') {
              setProjects((current) => [payload.new as Project, ...current]);
            } else if (payload.eventType === 'UPDATE') {
              setProjects((current) =>
                current.map((project) =>
                  project.id === payload.new.id ? (payload.new as Project) : project
                )
              );
            } else if (payload.eventType === 'DELETE') {
              setProjects((current) =>
                current.filter((project) => project.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
        });
    };

    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return projects;
};
