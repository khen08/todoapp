"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const roles = [
  { label: "All", value: "ALL" },
  { label: "Admin", value: "ADMIN" },
  { label: "User", value: "USER" },
];

const RoleFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select
      defaultValue={searchParams.get("role") || ""}
      onValueChange={(role) => {
        const params = new URLSearchParams();

        if (role) params.append("role", role);

        const query = params.size ? `?${params.toString()}` : "0";
        router.push(`?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by Role..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default RoleFilter;
