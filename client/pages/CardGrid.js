import { motion } from 'framer-motion';

const images = [
  '/card1.jpg',
  '/card2.jpg',
  '/card3.jpg',
  '/card4.jpg',
  '/card5.jpg',
  '/card6.jpg',
  '/card7.jpg',
  '/card8.jpg',
  '/card9.jpg',
  '/card10.jpg',
];

function CardGrid() {
    return (
      <div className="overflow-hidden h-screen">
        <div className="grid grid-cols-2 gap-4 p-4 mt-4 hover:animate-paused">
          {[...Array(20)].map((_, i) => (
            <motion.div 
              key={i}
              className={`w-64 h-80 rounded-lg p-1 bg-gray-900 text-white dark:bg-gray-900 dark:text-white shadow-lg ${i % 2 === 0 ? 'animate-marquee-up' : 'animate-marquee-down'}`}
            >
              <img src={images[i % 2 === 0 ? i % images.length : images.length - 1 - i % images.length]} alt={`Card ${i + 1}`} className="w-full h-full object-cover rounded-lg" />
            </motion.div>
          ))}
        </div>
      </div>
    );
}

export default CardGrid;