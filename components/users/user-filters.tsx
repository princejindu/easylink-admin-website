"use client";

import { Search } from "lucide-react";
import { UserStatus } from "@/enums/user-status.enum";

interface UserFiltersProps {
  search: string;
  onSearch: (value: string) => void;
  statusFilter: UserStatus | "";
  onStatusFilter: (value: UserStatus | "") => void;
}

export function UserFilters({
  search,
  onSearch,
  statusFilter,
  onStatusFilter,
}: UserFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilter(e.target.value as UserStatus | "")}
        className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Statuses</option>
        <option value={UserStatus.ACTIVE}>Active</option>
        <option value={UserStatus.SUSPENDED}>Suspended</option>
        <option value={UserStatus.PENDING}>Pending</option>
      </select>
    </div>
  );
}
