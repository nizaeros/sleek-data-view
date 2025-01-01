import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ClientTabsProps {
  activeTab: "all" | "active" | "inactive";
  counts: {
    all: number;
    active: number;
    inactive: number;
  };
  onTabChange: (value: "all" | "active" | "inactive") => void;
}

export const ClientTabs = ({ activeTab, counts, onTabChange }: ClientTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mb-3">
      <TabsList>
        <TabsTrigger value="all">
          All ({counts?.all || 0})
        </TabsTrigger>
        <TabsTrigger value="active">
          Active ({counts?.active || 0})
        </TabsTrigger>
        <TabsTrigger value="inactive">
          Inactive ({counts?.inactive || 0})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};