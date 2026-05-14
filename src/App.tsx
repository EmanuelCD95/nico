import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import './App.css';

interface GalleryItem {
  id: number;
  photo: string;
  music?: string;
}

function App() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetch('/data.csv')
      .then(res => res.text())
      .then(text => {
        const rows = text.split('\n').slice(1);
        const data = rows
          .filter(row => row.trim() !== '')
          .map(row => {
            const [id, photo, music] = row.split(',');
            return { 
              id: parseInt(id), 
              photo: photo.trim(), 
              music: music?.trim() || undefined 
            };
          });
        setGalleryItems(data);
      });
  }, []);

  const currentItem = galleryItems[currentIndex];

  useEffect(() => {
    if (started && audioRef.current && currentItem) {
      if (currentItem.music) {
        const newUrl = new URL(currentItem.music, window.location.origin).href;
        
        if (audioRef.current.src !== newUrl) {
          audioRef.current.src = currentItem.music;
          audioRef.current.load();
          audioRef.current.play().catch(e => console.error("Playback failed", e));
        }
      }
    }
  }, [currentIndex, started, currentItem]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventScrollOnSwipe: true,
  });

  if (galleryItems.length === 0) return null;

  if (!started) {
    return (
      <div className="splash">
        <button onClick={() => setStarted(true)}>Start Experience</button>
      </div>
    );
  }

  return (
    <div {...swipeHandlers} className="gallery-container">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentItem.id}
          src={currentItem.photo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fullscreen-image"
        />
      </AnimatePresence>
      
      <button className="nav-arrow left" onClick={handlePrev}>&lt;</button>
      <button className="nav-arrow right" onClick={handleNext}>&gt;</button>

      <audio ref={audioRef} />
    </div>
  );
}

export default App;
