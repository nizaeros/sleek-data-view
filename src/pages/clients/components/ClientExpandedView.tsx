interface ClientAccount {
  display_name: string;
  registered_name: string;
  client_code: string;
  is_active: boolean;
  is_client: boolean;
  location_type: string;
  relationship_type?: string;
  website?: string;
  linkedin?: string;
  registration_number?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  industry?: { industry_name: string } | null;
  entity_type?: { type_name: string } | null;
}

interface ClientExpandedViewProps {
  client: ClientAccount;
}

export const ClientExpandedView = ({ client }: ClientExpandedViewProps) => {
  const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-[#1034A6] border-b pb-2">{title}</h3>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">{children}</div>
    </div>
  );

  const InfoItem = ({ label, value }: { label: string; value: string | null | undefined }) => (
    <div className="flex items-start gap-2">
      <span className="text-sm font-medium text-gray-500 min-w-32">{label}:</span>
      <span className="text-sm text-gray-900">{value || "-"}</span>
    </div>
  );

  return (
    <div className="px-6 py-4 bg-gray-50/50 space-y-6">
      <InfoSection title="General Information">
        <InfoItem label="Display Name" value={client.display_name} />
        <InfoItem label="Registered Name" value={client.registered_name} />
        <InfoItem label="Client Code" value={client.client_code} />
        <InfoItem label="Industry" value={client.industry?.industry_name} />
        <InfoItem label="Entity Type" value={client.entity_type?.type_name} />
      </InfoSection>

      <InfoSection title="Status Information">
        <InfoItem 
          label="Active Status" 
          value={client.is_active ? "Active" : "Inactive"} 
        />
        <InfoItem 
          label="Client Type" 
          value={client.is_client ? "Client" : "Non-Client"} 
        />
        <InfoItem label="Location Type" value={client.location_type} />
        <InfoItem label="Relationship Type" value={client.relationship_type} />
      </InfoSection>

      <InfoSection title="Contact Information">
        <InfoItem label="Website" value={client.website} />
        <InfoItem label="LinkedIn" value={client.linkedin} />
        <InfoItem label="Registration Number" value={client.registration_number} />
      </InfoSection>

      <InfoSection title="Address Information">
        <InfoItem label="Address Line 1" value={client.address_line1} />
        <InfoItem label="Address Line 2" value={client.address_line2} />
        <InfoItem label="City" value={client.city} />
        <InfoItem label="State" value={client.state} />
        <InfoItem label="Country" value={client.country} />
        <InfoItem label="Postal Code" value={client.postal_code} />
      </InfoSection>
    </div>
  );
};