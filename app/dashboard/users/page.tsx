"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Pagination } from "@/components/shared/pagination";
import { UserTable } from "@/components/users/user-table";
import { UserFilters } from "@/components/users/user-filters";
import { usersApi } from "@/lib/api/users.api";
import { showError } from "@/lib/utils/toast.util";
import { UserStatus } from "@/enums/user-status.enum";
import type { User } from "@/types/user.types";

const PAGE_SIZE = 20;

export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "">("");

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await usersApi.list({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setUsers(response.users);
      setTotal(response.total);
    } catch {
      showError("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilter = (value: UserStatus | "") => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Manage EasyLink user accounts" />

      <UserFilters
        search={search}
        onSearch={handleSearch}
        statusFilter={statusFilter}
        onStatusFilter={handleStatusFilter}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <UserTable users={users} onRefresh={fetchUsers} />
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
