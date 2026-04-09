import React, { useEffect, useRef } from 'react';

interface PoemAnimationProps {
    poemHTML: string;
    backgroundImageUrl: string;
    boyImageUrl: string;
}

/**
 * Renders the 3D poem animation hero section.
 */
export const PoemAnimation: React.FC<PoemAnimationProps> = ({ poemHTML, backgroundImageUrl, boyImageUrl }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    // This effect handles the responsive scaling of the animation container.
    useEffect(() => {
        function adjustContentSize() {
            if (contentRef.current) {
                const viewportWidth = window.innerWidth;
                const baseWidth = 1000;
                const scaleFactor = viewportWidth < baseWidth ? (viewportWidth / baseWidth) * 0.9 : 1;
                contentRef.current.style.transform = `scale(${scaleFactor})`;
            }
        }

        adjustContentSize();
        window.addEventListener("resize", adjustContentSize);
        return () => window.removeEventListener("resize", adjustContentSize);
    }, []);

    return (
        <header className="hero-section overflow-hidden flex items-center justify-center min-h-[600px] bg-black">
            <div className="container relative flex items-center justify-center w-full max-w-[1000px]">
                <div 
                    ref={contentRef} 
                    className="content origin-center rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black" 
                    style={{ position: 'relative', display: 'block', width: '1000px', height: '562px' }}
                >
                    <div className="container-full relative w-full h-full">
                        <div className="animated hue absolute inset-0 z-30 pointer-events-none opacity-60 mix-blend-overlay"></div>
                        <img className="backgroundImage absolute inset-0 w-full h-full object-cover z-0 opacity-50" src={backgroundImageUrl} alt="An old stone courtyard at dawn" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        <img className="boyImage absolute bottom-0 left-1/2 -translate-x-1/2 w-auto h-[350px] z-40 pointer-events-none drop-shadow-[0_0_20px_rgba(0,0,0,1)]" src={boyImageUrl} alt="A man and woman practicing with swords" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        
                        <div className="container-cube absolute inset-0 flex items-center justify-center z-10 perspective-480">
                            <div className="cube preserve-3d">
                                <div className="face top"></div>
                                <div className="face bottom"></div>
                                <div className="face left text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                                <div className="face right text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                                <div className="face front"></div>
                                <div className="face back text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                            </div>
                        </div>

                        <div className="container-reflect absolute inset-0 flex items-center justify-center z-5 opacity-50 transform-gpu translate-y-[220px] scale-y-[-1] filter-blur-10 perspective-480">
                            <div className="cube preserve-3d">
                                <div className="face top"></div>
                                <div className="face bottom"></div>
                                <div className="face left text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                                <div className="face right text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                                <div className="face front"></div>
                                <div className="face back text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
