"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { showError } from "@/lib/utils/toast.util";
import { getErrorMessage } from "@/lib/utils/error.util";
import type { PagedItems, UserPageParams } from "@/types/user.types";

export const USER_TAB_PAGE_SIZE = 10;

type Fetcher<T> = (userId: string, params: UserPageParams) => Promise<PagedItems<T>>;

/** Loads one page of a user tab, ignoring stale responses when the page changes quickly. */
export function useUserPage<T>(
  userId: string,
  fetcher: Fetcher<T>,
  errorMessage: string,
  filters?: { status?: string; type?: string }
) {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const requestId = useRef(0);
  const status = filters?.status;
  const type = filters?.type;

  const load = useCallback(async () => {
    const id = ++requestId.current;
    setIsLoading(true);
    setFailed(false);
    try {
      const result = await fetcher(userId, {
        page,
        limit: USER_TAB_PAGE_SIZE,
        status: status || undefined,
        type: type || undefined,
      });
      if (id !== requestId.current) return;
      setItems(result.items);
      setTotal(result.total);
    } catch (error) {
      if (id !== requestId.current) return;
      setItems([]);
      setTotal(0);
      setFailed(true);
      showError(getErrorMessage(error, errorMessage));
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  }, [userId, fetcher, errorMessage, page, status, type]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [status, type]);

  return { items, total, page, setPage, isLoading, failed };
}
