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
  const [hasSwiped, setHasSwiped] = useState(false);
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

        // Check for 'start' query parameter
        const params = new URLSearchParams(window.location.search);
        const startParam = params.get('start');
        if (startParam) {
          const startId = parseInt(startParam, 10);
          const startIndex = data.findIndex(item => item.id === startId);
          if (startIndex !== -1) {
            setCurrentIndex(startIndex);
          } else if (startId > 0 && startId <= data.length) {
            // Fallback: use as 1-based index if ID not exactly found
            setCurrentIndex(startId - 1);
          }
        }
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
    setCurrentIndex((prev) => Math.min(prev + 1, galleryItems.length - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setHasSwiped(true);
      handleNext();
    },
    onSwipedRight: () => {
      setHasSwiped(true);
      handlePrev();
    },
    preventScrollOnSwipe: true,
  });

  if (galleryItems.length === 0) return null;

  if (!started) {
    return (
      <div className="splash">
        <img src="/nicodreia.png" alt="Nicodreia" className="splash-logo" />
        <button onClick={() => setStarted(true)}>07.06.2026</button>
      </div>
    );
  }

  const isVideo = currentItem?.photo?.toLowerCase().match(/\.(mp4|mov)$/);

  return (
    <div {...swipeHandlers} className="gallery-container">
      <AnimatePresence mode="wait">
        {isVideo ? (
          <motion.video
            key={currentItem.id}
            src={currentItem.photo}
            autoPlay
            loop
            playsInline
            muted
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fullscreen-image"
          />
        ) : (
          <motion.img
            key={currentItem.id}
            src={currentItem.photo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fullscreen-image"
          />
        )}
      </AnimatePresence>
      
      {!hasSwiped && (
        <>
          <button className="nav-arrow left" onClick={handlePrev}>&lt;</button>
          <button className="nav-arrow right" onClick={handleNext}>&gt;</button>
        </>
      )}

      {currentIndex === 0 && !hasSwiped && (
        <div className="swipe-instruction">
          swipe left
        </div>
      )}

      <audio ref={audioRef} loop />
    </div>
  );
}

export default App;
