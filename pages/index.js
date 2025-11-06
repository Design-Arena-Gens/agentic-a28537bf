import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let frame = 0;
    let dogX = 50;
    let dogDirection = 1;

    const drawDog = (x, y, tailWag) => {
      // Body
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x, y, 80, 50);

      // Head
      ctx.beginPath();
      ctx.arc(x + 90, y + 15, 25, 0, Math.PI * 2);
      ctx.fill();

      // Ears
      ctx.fillStyle = '#654321';
      ctx.beginPath();
      ctx.ellipse(x + 75, y + 5, 10, 15, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + 105, y + 5, 10, 15, 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(x + 82, y + 12, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 98, y + 12, 3, 0, Math.PI * 2);
      ctx.fill();

      // Nose
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(x + 105, y + 20, 4, 0, Math.PI * 2);
      ctx.fill();

      // Mouth
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + 105, y + 22, 6, 0, Math.PI);
      ctx.stroke();

      // Legs
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x + 10, y + 50, 12, 30);
      ctx.fillRect(x + 35, y + 50, 12, 30);
      ctx.fillRect(x + 60, y + 50, 12, 30);

      // Tail (wagging)
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x, y + 20);
      ctx.quadraticCurveTo(x - 20, y + 10 + tailWag, x - 30, y + 30);
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ground
      ctx.fillStyle = '#90EE90';
      ctx.fillRect(0, 300, canvas.width, 200);

      // Sun
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(700, 80, 40, 0, Math.PI * 2);
      ctx.fill();

      // Clouds
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.arc(150, 100, 30, 0, Math.PI * 2);
      ctx.arc(180, 100, 35, 0, Math.PI * 2);
      ctx.arc(210, 100, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(450, 120, 25, 0, Math.PI * 2);
      ctx.arc(475, 120, 30, 0, Math.PI * 2);
      ctx.arc(500, 120, 25, 0, Math.PI * 2);
      ctx.fill();

      // Tree
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(600, 200, 40, 100);
      ctx.fillStyle = '#228B22';
      ctx.beginPath();
      ctx.arc(620, 180, 50, 0, Math.PI * 2);
      ctx.fill();

      // Dog
      const tailWag = Math.sin(frame * 0.3) * 10;
      drawDog(dogX, 220, tailWag);

      // Move dog back and forth
      dogX += dogDirection * 2;
      if (dogX > 600 || dogX < 50) {
        dogDirection *= -1;
      }

      frame++;
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const playVoice = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(context);

    const phrases = [
      { text: "Woof woof!", freq: 200, duration: 0.3 },
      { text: "I'm a happy dog!", freq: 250, duration: 0.4 },
      { text: "Running in the park!", freq: 220, duration: 0.4 },
      { text: "Chasing my tail!", freq: 280, duration: 0.3 },
      { text: "Bark bark bark!", freq: 200, duration: 0.5 }
    ];

    let currentTime = context.currentTime;

    phrases.forEach((phrase, index) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.value = phrase.freq;
      oscillator.type = 'sawtooth';

      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, currentTime + phrase.duration);

      oscillator.start(currentTime);
      oscillator.stop(currentTime + phrase.duration);

      currentTime += phrase.duration + 0.5;
    });

    setTimeout(() => {
      setIsPlaying(false);
    }, currentTime * 1000);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    playVoice();
  };

  const handleStop = () => {
    setIsPlaying(false);
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
  };

  return (
    <>
      <Head>
        <title>Dog Video with Voice</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
        fontFamily: 'Arial, sans-serif',
        padding: '20px'
      }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>🐕 Happy Dog Animation</h1>
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          style={{
            border: '3px solid #333',
            borderRadius: '10px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        />
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: isPlaying ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isPlaying ? 'not-allowed' : 'pointer',
              marginRight: '10px',
              fontWeight: 'bold'
            }}
          >
            ▶️ Play Video & Voice
          </button>
          <button
            onClick={handleStop}
            disabled={!isPlaying}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: !isPlaying ? '#ccc' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: !isPlaying ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            ⏹️ Stop
          </button>
        </div>
        <p style={{ marginTop: '20px', color: '#666', textAlign: 'center', maxWidth: '600px' }}>
          Watch the happy dog walk back and forth in the park with synchronized voice narration!
        </p>
      </div>
    </>
  );
}
