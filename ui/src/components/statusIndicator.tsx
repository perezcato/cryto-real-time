type StatusIndicatorProps = {
    status: string;
  };
  
  export const StatusIndicator = ({ status }: StatusIndicatorProps) => {
    const getStatusColor = () => {
      switch (status) {
        case "Connected":
          return "bg-green-500";
        case "Connecting...":
          return "bg-yellow-500";
        case "Disconnected":
          return "bg-red-500";
        default:
          return "bg-gray-500";
      }
    };
  
    return (
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
        <span className="text-sm text-gray-400">{status}</span>
      </div>
    );
  };
  
  
  