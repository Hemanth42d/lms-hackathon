const StatsCard = ({ title, value, icon, bgColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        {icon && (
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColor}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
