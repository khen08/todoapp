import React from "react";
import { User } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ArrowDown, ArrowUp } from "lucide-react";
import { SearchParams } from "./page";

interface Props {
  users: User[];
  searchParams: SearchParams;
}

const UserTable = ({ users, searchParams }: Props) => {
  const getNextOrder = (field: keyof User) => {
    if (searchParams.orderBy === field && searchParams.order === "asc") {
      return "desc";
    }
    return "asc";
  };

  const renderSortIcon = (field: keyof User) => {
    if (searchParams.orderBy === field) {
      return searchParams.order === "asc" ? (
        <ArrowUp className="inline p-1" />
      ) : (
        <ArrowDown className="inline p-1" />
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="rounded-md sm:border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead>
                <Link
                  href={{
                    query: {
                      ...searchParams,
                      orderBy: "name",
                      order: getNextOrder("name"),
                    },
                  }}
                >
                  Name
                </Link>
                {renderSortIcon("name")}
              </TableHead>
              <TableHead>
                <Link
                  href={{
                    query: {
                      ...searchParams,
                      orderBy: "username",
                      order: getNextOrder("username"),
                    },
                  }}
                >
                  Username
                </Link>
                {renderSortIcon("username")}
              </TableHead>
              <TableHead>
                <Link
                  href={{
                    query: {
                      ...searchParams,
                      orderBy: "role",
                      order: getNextOrder("role"),
                    },
                  }}
                >
                  Role
                </Link>
                {renderSortIcon("role")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users
              ? users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Link href={`/users/${user.id}`}>{user.name}</Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/users/${user.id}`}>{user.username}</Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/users/${user.id}`}>{user.role}</Link>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserTable;
