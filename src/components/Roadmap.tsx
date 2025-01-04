import { CheckCircle2, Circle } from "lucide-react";

interface RoadmapItem {
  title: string;
  status: "completed" | "in-progress" | "planned";
  quarter: string;
}

const roadmapData: RoadmapItem[] = [
  {
    title: "User Authentication & Authorization",
    status: "completed",
    quarter: "Q1 2024",
  },
  {
    title: "Client Account Management",
    status: "completed",
    quarter: "Q1 2024",
  },
  {
    title: "Advanced Analytics Dashboard",
    status: "in-progress",
    quarter: "Q2 2024",
  },
  {
    title: "Document Management System",
    status: "planned",
    quarter: "Q2 2024",
  },
  {
    title: "Automated Reporting",
    status: "planned",
    quarter: "Q3 2024",
  },
];

export const Roadmap = () => {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold text-[#1034A6] mb-4">Product Roadmap</h2>
      <div className="space-y-4">
        {roadmapData.map((item, index) => (
          <div key={index} className="flex items-start gap-3 group">
            {item.status === "completed" ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
            ) : (
              <Circle className={`w-5 h-5 mt-0.5 ${
                item.status === "in-progress" 
                  ? "text-[#1034A6]" 
                  : "text-gray-400"
              }`} />
            )}
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <span className="text-sm text-gray-500">{item.quarter}</span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full mt-2">
                <div 
                  className={`h-full rounded-full transition-all ${
                    item.status === "completed" 
                      ? "bg-green-500 w-full" 
                      : item.status === "in-progress" 
                        ? "bg-[#1034A6] w-1/2" 
                        : "w-0"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};