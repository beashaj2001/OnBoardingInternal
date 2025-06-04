import React, { useEffect, useRef } from 'react';

interface ThreeDModuleViewerProps {
  isPlaying: boolean;
}

const ThreeDModuleViewer: React.FC<ThreeDModuleViewerProps> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIdRef = useRef<number | null>(null);
  
  // This is a simple placeholder for what would normally be a full 3D scene
  // using Three.js or a similar library
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let rotation = 0;
    let hue = 0;
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set canvas dimensions to match display size
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const size = Math.min(canvas.width, canvas.height) * 0.3;
      
      // Draw a simple animated cube to simulate 3D content
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      
      // Gradient background
      const gradient = ctx.createLinearGradient(-size, -size, size, size);
      gradient.addColorStop(0, `hsl(${hue}, 70%, 60%)`);
      gradient.addColorStop(1, `hsl(${hue + 60}, 70%, 60%)`);
      
      // Front face
      ctx.fillStyle = gradient;
      ctx.fillRect(-size / 2, -size / 2, size, size);
      
      // Top face
      ctx.beginPath();
      ctx.moveTo(-size / 2, -size / 2);
      ctx.lineTo(0, -size);
      ctx.lineTo(size / 2, -size / 2);
      ctx.closePath();
      ctx.fillStyle = `hsl(${hue + 30}, 70%, 70%)`;
      ctx.fill();
      
      // Right face
      ctx.beginPath();
      ctx.moveTo(size / 2, -size / 2);
      ctx.lineTo(size, 0);
      ctx.lineTo(size / 2, size / 2);
      ctx.closePath();
      ctx.fillStyle = `hsl(${hue + 90}, 70%, 50%)`;
      ctx.fill();
      
      // Draw wireframe
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      
      // Front face outline
      ctx.strokeRect(-size / 2, -size / 2, size, size);
      
      // Top face outline
      ctx.beginPath();
      ctx.moveTo(-size / 2, -size / 2);
      ctx.lineTo(0, -size);
      ctx.lineTo(size / 2, -size / 2);
      ctx.closePath();
      ctx.stroke();
      
      // Right face outline
      ctx.beginPath();
      ctx.moveTo(size / 2, -size / 2);
      ctx.lineTo(size, 0);
      ctx.lineTo(size / 2, size / 2);
      ctx.closePath();
      ctx.stroke();
      
      // Hidden edges (dashed)
      ctx.setLineDash([5, 5]);
      
      ctx.beginPath();
      ctx.moveTo(-size / 2, size / 2);
      ctx.lineTo(0, size);
      ctx.lineTo(size / 2, size / 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(-size / 2, -size / 2);
      ctx.lineTo(-size, 0);
      ctx.lineTo(-size / 2, size / 2);
      ctx.stroke();
      
      ctx.restore();
      
      // Update animation variables if playing
      if (isPlaying) {
        rotation += 0.01;
        hue = (hue + 0.5) % 360;
      }
      
      frameIdRef.current = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [isPlaying]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full bg-gray-900"
      style={{ touchAction: 'none' }} // Prevents touch actions for better interaction
    />
  );
};

export default ThreeDModuleViewer;