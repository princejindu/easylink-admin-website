"use client";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils/format.util";
import type { User } from "@/types/user.types";

interface UserTableProps {
  users: User[];
  onRefresh: () => void;
}

export function UserTable({ users }: UserTableProps) {
  if (!users.length) {
    return (
      <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
        No users found.
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                Email
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                Country
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b last:border-0 hover:bg-accent/50 transition-colors"
              >
                <td className="px-4 py-3 font-medium">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {user.email}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                  {user.country || "N/A"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                  {formatDate(user.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
