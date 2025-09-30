"use client";

import React, { createContext, useContext, useState } from "react";

type Group = {
  value: string;
  name: string;
  role: string;
};

type GroupContextType = {
  selectedGroup: Group | null;
  setSelectedGroup: (g: Group | null) => void;
};

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  return (
    <GroupContext.Provider value={{ selectedGroup, setSelectedGroup }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  const ctx = useContext(GroupContext);
  if (!ctx) throw new Error("useGroup must be used within a GroupProvider");
  return ctx;
}

export type { Group };
