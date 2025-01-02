import { type ClientAccount } from "../client-form.schema";
import { cn } from "@/lib/utils";

interface ClientExpandedViewProps {
  client: ClientAccount & {
    industry?: { industry_name: string } | null;
    entity_type?: { type_name: string } | null;
    parent?: { display_name: string } | null;
  };
}

export const ClientExpandedView = ({ client }: ClientExpandedViewProps) => {
  const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-[#1034A6] border-b pb-1">{title}</h3>
      <div className="grid grid-cols-3 gap-4">{children}</div>
    </div>
  );

  const InfoItem = ({ label, value }: { label: string; value: string | null | undefined }) => (
    <div className="flex items-start gap-1">
      <span className="text-xs font-medium text-gray-500 min-w-24">{label}:</span>
      <span className="text-xs text-gray-900">{value || "-"}</span>
    </div>
  );

  const formatAddress = () => {
    const parts = [
      client.address_line1,
      client.address_line2,
      client.city,
      client.state,
      client.country,
      client.postal_code
    ].filter(Boolean);
    return parts.join(", ") || "-";
  };

  return (
    <div className="px-4 py-3 bg-gray-50/50 space-y-4">
      <div className="grid grid-cols-2 gap-6">
        <InfoSection title="Basic Information">
          <InfoItem label="Display Name" value={client.display_name} />
          <InfoItem label="Registered Name" value={client.registered_name} />
          <InfoItem label="Client Code" value={client.client_code} />
          <InfoItem label="Industry" value={client.industry?.industry_name} />
          <InfoItem label="Entity Type" value={client.entity_type?.type_name} />
          <InfoItem label="Parent Client" value={client.parent?.display_name} />
        </InfoSection>

        <InfoSection title="Status & Type">
          <InfoItem 
            label="Status" 
            value={client.is_active ? "Active" : "Inactive"} 
          />
          <InfoItem 
            label="Client Type" 
            value={client.is_client ? "Client" : "Non-Client"} 
          />
          <InfoItem label="Location Type" value={client.location_type} />
          <InfoItem label="Relationship" value={client.relationship_type} />
          <InfoItem label="Registration #" value={client.registration_number} />
        </InfoSection>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <InfoSection title="Contact Information">
          <InfoItem label="Website" value={client.website} />
          <InfoItem label="LinkedIn" value={client.linkedin} />
          <InfoItem label="GSTIN" value={client.gstin} />
          <InfoItem label="TAN" value={client.tan} />
          <InfoItem label="ICN" value={client.icn} />
        </InfoSection>

        <InfoSection title="Address">
          <div className="col-span-3">
            <InfoItem label="Full Address" value={formatAddress()} />
          </div>
        </InfoSection>
      </div>
    </div>
  );
};