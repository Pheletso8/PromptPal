import React from 'react';

// Define the interface for props
interface VideoPlayerProps {
  videoUrl: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  return (
    <section className="mb-20 rounded-[2.5rem] overflow-hidden border border-white/5 aspect-video bg-black/60 shadow-2xl group">
       <iframe 
         className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-700" 
         src={videoUrl} 
         title="Lesson Video" 
         frameBorder="0" 
         referrerPolicy="strict-origin-when-cross-origin"
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
         allowFullScreen
       ></iframe>
    </section>
  );
};