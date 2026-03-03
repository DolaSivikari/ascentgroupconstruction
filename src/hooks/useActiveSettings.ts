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
  const { data: activeRows, error } = await supabase
    .from(tableName)
    .select(selectQuery)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(2);
  const { data: result, error } = await supabase
    .from(tableName)
    .select(selectQuery)
    .eq('is_active', true)
    .maybeSingle();
export const fetchActiveSettingsRow = async <T>(
  tableName: string,
  selectQuery: string = '*'
): Promise<ActiveSettingsFetchResult<T>> => {
  const { data: result, error } = await (supabase
    .from(tableName as any)
    .select(selectQuery)
    .eq('is_active', true)
    .maybeSingle());

  if (error) {
    throw error;
  }

  if (!activeRows || activeRows.length === 0) {
    return {
      data: null,
      warning: `No active settings found in ${tableName}`,
    };
  }

  const [latestRow] = activeRows;

  if (activeRows.length > 1) {
    return {
      data: latestRow as T,
  if (result) {
    return { data: result as T };
  }

  const { data: latestResult, error: latestError } = await supabase
    .from(tableName)
  const { data: latestResult, error: latestError } = await (supabase
    .from(tableName as any)
    .select(selectQuery)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
    .maybeSingle());

  if (latestError) {
    throw latestError;
  }

  if (latestResult) {
    return {
      data: latestResult as T,
      warning: `Multiple active rows found in ${tableName}, using latest updated.`,
    };
  }

  return { data: latestRow as T };
  return {
    data: null,
    warning: `No active settings found in ${tableName}`,
  };
};
