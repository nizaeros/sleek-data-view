import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabCounts {
  all: number;
  active: number;
  inactive: number;
}

interface ClientTabsProps {
  activeTab: "all" | "active" | "inactive";
  onTabChange: (value: "all" | "active" | "inactive") => void;
  counts: TabCounts;
}

export const ClientTabs = ({ activeTab, onTabChange, counts }: ClientTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mb-3">
      <TabsList>
        <TabsTrigger value="all">
          All ({counts.all})
        </TabsTrigger>
        <TabsTrigger value="active">
          Active ({counts.active})
        </TabsTrigger>
        <TabsTrigger value="inactive">
          Inactive ({counts.inactive})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};