import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export interface ActiveSettingsFetchResult<T> {
  data: T | null;
  warning?: string;
}

type SettingsTableName = keyof Database['public']['Tables'];

export const fetchActiveSettingsRow = async <T>(
  tableName: SettingsTableName,
  selectQuery: string = '*'
): Promise<ActiveSettingsFetchResult<T>> => {
  const { data: result, error } = await supabase
    .from(tableName)
    .select(selectQuery)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (result) {
    return { data: result as T };
  }

  const { data: latestResult, error: latestError } = await supabase
    .from(tableName)
    .select(selectQuery)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestError) {
    throw latestError;
  }

  if (latestResult) {
    return {
      data: latestResult as T,
      warning: `Multiple active rows found in ${tableName}, using latest updated.`,
    };
  }

  return {
    data: null,
    warning: `No active settings found in ${tableName}`,
  };
};
