const CourseCard = ({ title, instructor, image, bgColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      <div className={`h-40 ${bgColor} flex items-center justify-center p-6`}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{instructor}</p>
      </div>
    </div>
  );
};

export default CourseCard;
