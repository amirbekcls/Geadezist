import { Image } from "antd";

export default function Test() {
  return (
    <div className="flex gap-10 justify-center items-center min-h-screen bg-gradient-to-r from-green-300 via-green-400 to-green-500">
      <div className="relative w-80 h-80 transition-transform transform hover:scale-105 duration-300 ease-in-out">
        {/* Hexagon */}
        <div className="absolute inset-0 clip-hexagon shadow-lg bg-gray-100">
          <Image  
            src="/restaurant.jpg"
            alt="Restaurant"
            className="object-cover rounded-lg"
          />
        </div>
        {/* Text */}
        <div className="text-center mt-6">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            Restaurants
          </h1>
          <p className="text-sm text-white opacity-90">
            Discover your next favorite place to eat!
          </p>
        </div>
      </div>
      <div className="relative w-80 h-80 transition-transform transform hover:scale-105 duration-300 ease-in-out">
        {/* Hexagon */}
        <div className="absolute inset-0 clip-hexagon shadow-lg bg-gray-100">
          <Image  
            src="/restaurant.jpg"
            alt="Restaurant"
            className="object-cover rounded-lg"
          />
        </div>
        {/* Text */}
        <div className="text-center mt-6">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            Restaurants
          </h1>
          <p className="text-sm text-white opacity-90">
            Discover your next favorite place to eat!
          </p>
        </div>
      </div> 
      <div className="relative w-80 h-80 transition-transform transform hover:scale-105 duration-300 ease-in-out">
        {/* Hexagon */}
        <div className="absolute inset-0 clip-hexagon shadow-lg bg-gray-100">
          <Image  
            src="/restaurant.jpg"
            alt="Restaurant"
            className="object-cover rounded-lg"
          />
        </div>
        {/* Text */}
        <div className="text-center mt-6">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            Restaurants
          </h1>
          <p className="text-sm text-white opacity-90">
            Discover your next favorite place to eat!
          </p>
        </div>
      </div>
    </div>
  );
}
