import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientSearch } from "./components/ClientSearch";
import { ClientTable } from "./components/ClientTable";
import { ClientTabs } from "./components/ClientTabs";
import { NewClientDrawer } from "./components/NewClientDrawer";

type TabType = "all" | "active" | "inactive";

const ITEMS_PER_PAGE = 20;

export const ClientAccounts = () => {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: counts, isLoading: isCountsLoading } = useQuery({
    queryKey: ["client-counts", searchQuery],
    queryFn: async () => {
      console.log("Fetching counts with search:", searchQuery);
      const createBaseQuery = () => {
        let query = supabase.from("client_accounts").select("*", { count: "exact", head: true });
        if (searchQuery) {
          query = query.ilike("display_name", `%${searchQuery}%`);
        }
        return query;
      };

      const [{ count: totalCount }, { count: activeCount }, { count: inactiveCount }] = await Promise.all([
        createBaseQuery(),
        createBaseQuery().eq("is_active", true),
        createBaseQuery().eq("is_active", false)
      ]);

      return {
        all: totalCount || 0,
        active: activeCount || 0,
        inactive: inactiveCount || 0,
      };
    },
    staleTime: 30000,
  });

  const fetchClients = async ({ pageParam = 0 }) => {
    console.log("Fetching clients with search:", searchQuery);
    let query = supabase
      .from("client_accounts")
      .select(`
        *,
        industry:industries(industry_name)
      `);

    if (searchQuery) {
      query = query.ilike("display_name", `%${searchQuery}%`);
    }

    if (activeTab === "active") {
      query = query.eq("is_active", true);
    } else if (activeTab === "inactive") {
      query = query.eq("is_active", false);
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

    if (error) throw error;
    return { data, nextPage: pageParam + 1, count };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["clients", activeTab, searchQuery],
    queryFn: fetchClients,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.count) return undefined;
      return pages.length * ITEMS_PER_PAGE < lastPage.count
        ? pages.length
        : undefined;
    },
    staleTime: 30000,
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const formatLocation = (client: any) => {
    const parts = [client.city, client.state, client.country]
      .filter(Boolean)
      .join(", ");
    return parts || "-";
  };

  const handleEditClient = (client: any) => {
    console.log("Edit client:", client);
    setIsDrawerOpen(true);
    // Add edit logic here
  };

  return (
    <div className="px-4 sm:px-6 lg:px-6 py-3">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-base font-semibold text-[#1034A6]">Client Accounts</h1>
        <div className="flex items-center gap-4">
          <ClientSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery("")}
          />
          <Button onClick={() => setIsDrawerOpen(true)} size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ClientTabs
        activeTab={activeTab}
        counts={counts || { all: 0, active: 0, inactive: 0 }}
        onTabChange={(value) => setActiveTab(value as TabType)}
      />

      <div className="border rounded-md">
        <ScrollArea className="h-[calc(100vh-220px)]" onScroll={handleScroll}>
          <ClientTable
            clients={data?.pages.flatMap(page => page.data || []) || []}
            formatLocation={formatLocation}
            isFetchingNextPage={isFetchingNextPage}
            onEdit={handleEditClient}
          />
        </ScrollArea>
      </div>

      <NewClientDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </div>
  );
};