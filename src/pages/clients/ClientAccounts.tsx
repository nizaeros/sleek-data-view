import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientAccountDialog } from "./ClientAccountDialog";
import type { Database } from "@/integrations/supabase/types";
import { Plus, Pencil, ArrowRightCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientSearch } from "./components/ClientSearch";
import { ClientTabs } from "./components/ClientTabs";

type ClientAccount = Database["public"]["Tables"]["client_accounts"]["Row"];
type TabType = "all" | "active" | "inactive";

const ITEMS_PER_PAGE = 10;

export const ClientAccounts = () => {
  const [selectedClient, setSelectedClient] = useState<ClientAccount | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch counts for all categories with search filter
  const { data: counts } = useQuery({
    queryKey: ["client-counts", searchQuery],
    queryFn: async () => {
      let baseQuery = supabase.from("client_accounts").select("*", { count: "exact", head: true });
      
      // Apply search filter if exists
      if (searchQuery) {
        baseQuery = baseQuery.or(
          `display_name.ilike.%${searchQuery}%,` +
          `client_code.ilike.%${searchQuery}%,` +
          `city.ilike.%${searchQuery}%,` +
          `state.ilike.%${searchQuery}%,` +
          `country.ilike.%${searchQuery}%`
        );
      }

      const [totalCount, activeCount, inactiveCount] = await Promise.all([
        baseQuery,
        baseQuery.eq("is_active", true),
        baseQuery.eq("is_active", false),
      ]);

      return {
        all: totalCount.count || 0,
        active: activeCount.count || 0,
        inactive: inactiveCount.count || 0,
      };
    },
  });

  const fetchClients = async ({ pageParam = 0 }) => {
    let query = supabase
      .from("client_accounts")
      .select("*", { count: "exact" });

    // Apply search filter if exists
    if (searchQuery) {
      query = query.or(
        `display_name.ilike.%${searchQuery}%,` +
        `client_code.ilike.%${searchQuery}%,` +
        `city.ilike.%${searchQuery}%,` +
        `state.ilike.%${searchQuery}%,` +
        `country.ilike.%${searchQuery}%`
      );
    }

    // Apply filter based on active tab
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
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleEdit = (client: ClientAccount) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedClient(null);
    setIsDialogOpen(true);
  };

  const formatLocation = (client: ClientAccount) => {
    const parts = [client.city, client.state, client.country]
      .filter(Boolean)
      .join(", ");
    return parts || "-";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-6 py-3">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-base font-semibold text-[#1034A6]">Client Accounts</h1>
        <Button onClick={handleCreate} size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <ClientTabs
          activeTab={activeTab}
          onTabChange={(value) => setActiveTab(value as TabType)}
          counts={counts || { all: 0, active: 0, inactive: 0 }}
        />
        <ClientSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />
      </div>

      <div className="border rounded-md">
        <ScrollArea className="h-[calc(100vh-220px)]" onScroll={handleScroll}>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="py-1.5">Display Name</TableHead>
                <TableHead className="py-1.5">Client Code</TableHead>
                <TableHead className="py-1.5">Location</TableHead>
                <TableHead className="py-1.5">Location Type</TableHead>
                <TableHead className="py-1.5">Status</TableHead>
                <TableHead className="py-1.5 w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.pages.map((page) =>
                page.data?.map((client) => (
                  <TableRow key={client.client_account_id} className="hover:bg-muted/50">
                    <TableCell className="py-1.5">{client.display_name}</TableCell>
                    <TableCell className="py-1.5">{client.client_code}</TableCell>
                    <TableCell className="py-1.5">{formatLocation(client)}</TableCell>
                    <TableCell className="py-1.5">{client.location_type}</TableCell>
                    <TableCell className="py-1.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        client.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {client.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="py-1.5">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(client)}
                          className="h-7 w-7 text-gray-400 hover:text-[#1034A6] transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 text-gray-400 hover:text-[#1034A6] transition-colors"
                          // TODO: Implement dashboard navigation
                          onClick={() => console.log('Navigate to dashboard', client.client_account_id)}
                        >
                          <ArrowRightCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {isFetchingNextPage && (
            <div className="py-4 text-center text-sm text-muted-foreground">
              Loading more...
            </div>
          )}
        </ScrollArea>
      </div>
      <ClientAccountDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        client={selectedClient}
      />
    </div>
  );
};