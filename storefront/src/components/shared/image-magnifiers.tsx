import React, {useState, useRef, useEffect, useCallback} from 'react';
import Image from 'next/image';

// Type definitions for props
interface MagnifierProps {
    src: string;
    alt: string;
    width?: string;
    height?: string;
    zoomLevel?: number;
    magnifierSize?: number;
    largeSrc?: string;

}

// Component 1: Basic Magnifying Glass (Fixed imgSize.height issue)
const GlassMagnifier: React.FC<MagnifierProps> = ({
                                                      src,
                                                      alt,
                                                      width = '100%',
                                                      height = 'auto',
                                                      zoomLevel = 2,
                                                      magnifierSize = 150,
                                                  }) => {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const currentImg = imgRef.current;
        if (!currentImg) return;

        const updateImgSize = () => {
            setImgSize({
                width: currentImg.offsetWidth,
                height: currentImg.offsetHeight,
            });
        };

        if (currentImg.complete) updateImgSize();
        else currentImg.addEventListener('load', updateImgSize);

        window.addEventListener('resize', updateImgSize);

        const interval = setInterval(() => {
            if (currentImg.offsetHeight > 0) {
                updateImgSize();
                clearInterval(interval);
            }
        }, 100);

        return () => {
            window.removeEventListener('resize', updateImgSize);
            currentImg.removeEventListener('load', updateImgSize);
            clearInterval(interval);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
        if (!imgRef.current) return;
        const { left, top } = imgRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        setPosition({
            x: Math.max(0, Math.min(x, imgSize.width)),
            y: Math.max(0, Math.min(y, imgSize.height)),
        });
    };

    return (
        <div className="relative" style={{ width, height }}>
            <Image
                ref={imgRef}
                src={src}
                alt={alt}
                width={imgSize.width || 1000}
                height={imgSize.height || 1000}
                priority
                className="w-full h-auto object-cover cursor-crosshair"
                onLoad={() => {
                    if (imgRef.current) {
                        setImgSize({
                            width: imgRef.current.offsetWidth,
                            height: imgRef.current.offsetHeight,
                        });
                    }
                }}
                onMouseEnter={() => setShowMagnifier(true)}
                onMouseLeave={() => setShowMagnifier(false)}
                onMouseMove={handleMouseMove}
            />
            {showMagnifier && imgSize.width > 0 && imgSize.height > 0 && (
                <div
                    className="absolute border-3 border-black/50 bg-white pointer-events-none rounded-full"
                    style={{
                        width: `${magnifierSize}px`,
                        height: `${magnifierSize}px`,
                        top: `${position.y - magnifierSize / 2}px`,
                        left: `${position.x - magnifierSize / 2}px`,
                        backgroundImage: `url(${src})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: `${imgSize.width * zoomLevel}px ${imgSize.height * zoomLevel}px`,
                        backgroundPositionX: `${-position.x * zoomLevel + magnifierSize / 2}px`,
                        backgroundPositionY: `${-position.y * zoomLevel + magnifierSize / 2}px`,
                    }}
                />
            )}
        </div>
    );
};


// Component 2: Side-by-Side Magnifier (Updated for in-place zoom with sample code styling)
const SideBySideMagnifier: React.FC<MagnifierProps> = ({
                                                           src,
                                                           largeSrc,
                                                           alt,
                                                           zoomLevel = 2,
                                                       }) => {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const currentImg = imgRef.current;
        if (!currentImg) return;

        const updateImgSize = () => {
            setImgSize({
                width: currentImg.offsetWidth,
                height: currentImg.offsetHeight,
            });
        };

        if (currentImg.complete) updateImgSize();
        else currentImg.addEventListener('load', updateImgSize);

        window.addEventListener('resize', updateImgSize);

        const interval = setInterval(() => {
            if (currentImg.offsetHeight > 0) {
                updateImgSize();
                clearInterval(interval);
            }
        }, 100);

        return () => {
            window.removeEventListener('resize', updateImgSize);
            currentImg.removeEventListener('load', updateImgSize);
            clearInterval(interval);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imgRef.current) return;
        const { left, top } = imgRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        setPosition({ x, y });
    };

    const magnifierSize = imgSize.width;
    const magnifierHeight = imgSize.height;
    const zoomedWidth = imgSize.width * zoomLevel;
    const zoomedHeight = imgSize.height * zoomLevel;
    const translateX = position.x * zoomLevel - magnifierSize / 2;
    const translateY = position.y * zoomLevel - magnifierHeight / 2;
    const maxTranslateX = zoomedWidth - magnifierSize;
    const maxTranslateY = zoomedHeight - magnifierHeight;
    const clampedTranslateX = Math.max(0, Math.min(translateX, maxTranslateX));
    const clampedTranslateY = Math.max(0, Math.min(translateY, maxTranslateY));

    return (
        <div className="relative">
            <div className="w-full h-full" style={{ width: imgSize.width || '100%', height: imgSize.height || 'auto' }}>
                <Image
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    width={imgSize.width || 1000}
                    height={imgSize.height || 1000}
                    className="w-full h-auto object-cover"
                    onLoad={() => {
                        if (imgRef.current) {
                            setImgSize({
                                width: imgRef.current.offsetWidth,
                                height: imgRef.current.offsetHeight,
                            });
                        }
                    }}
                    onMouseEnter={() => setShowMagnifier(true)}
                    onMouseLeave={() => setShowMagnifier(false)}
                    onMouseMove={handleMouseMove}
                />
            </div>
            {showMagnifier && imgSize.width > 0 && imgSize.height > 0 && (
                <div
                    className="shadow-lg"
                    style={{
                        position: 'absolute',
                        pointerEvents: 'none',
                        width: `${magnifierSize}px`,
                        height: `${magnifierHeight}px`,
                        top: '0px',
                        left: '0px',
                        zIndex: 100,
                        overflow: 'hidden',
                        border: '1px solid #ddd',
                    }}
                >
                    <Image
                        src={largeSrc || src}
                        alt=""
                        width={zoomedWidth}
                        height={zoomedHeight}
                        style={{
                            position: 'absolute',
                            maxWidth: 'none',
                            display: 'block',
                            top: '0px',
                            left: '0px',
                            transform: `translate(-${clampedTranslateX}px, -${clampedTranslateY}px)`,
                        }}
                    />
                </div>
            )}
        </div>
    );
};


// Component 3: PictureInPictureMagnifier
const PictureInPictureMagnifier: React.FC<MagnifierProps> = ({
                                                                 src,
                                                                 largeSrc,
                                                                 alt,
                                                                 width = '100%',
                                                                 height = 'auto',
                                                                 zoomLevel = 1.5,
                                                             }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const currentImg = imgRef.current;
        if (!currentImg) return;

        const updateImgSize = () => {
            setImgSize({
                width: currentImg.offsetWidth,
                height: currentImg.offsetHeight,
            });
        };

        if (currentImg.complete) updateImgSize();
        else currentImg.addEventListener('load', updateImgSize);

        window.addEventListener('resize', updateImgSize);

        return () => {
            window.removeEventListener('resize', updateImgSize);
            currentImg.removeEventListener('load', updateImgSize);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imgRef.current) return;
        const { left, top } = imgRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        setPosition({ x, y });
    };

    return (
        <div className="relative" style={{ width, height }}>
            <Image
                ref={imgRef}
                src={src}
                alt={alt}
                width={imgSize.width || 1000}
                height={imgSize.height || 1000}
                className="w-full h-auto object-cover"
                onLoad={() => {
                    if (imgRef.current) {
                        setImgSize({
                            width: imgRef.current.offsetWidth,
                            height: imgRef.current.offsetHeight,
                        });
                    }
                }}
                onMouseEnter={() => setShowMagnifier(true)}
                onMouseLeave={() => setShowMagnifier(false)}
                onMouseMove={handleMouseMove}
            />
            {showMagnifier && imgSize.width > 0 && imgSize.height > 0 && (
                <div className="absolute bottom-0 right-0 w-32 h-32 border border-gray-300 bg-white opacity-80">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `url(${largeSrc || src})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: `${imgSize.width * zoomLevel}px ${imgSize.height * zoomLevel}px`,
                            backgroundPositionX: `${-position.x * zoomLevel + 64}px`,
                            backgroundPositionY: `${-position.y * zoomLevel + 64}px`,
                        }}
                    />
                </div>
            )}
        </div>
    );
};

// Component 4: ClickToZoomMagnifier
const ClickToZoomMagnifier: React.FC<MagnifierProps> = ({
                                                            src,
                                                            largeSrc,
                                                            alt,
                                                            width = '100%',
                                                            height = 'auto',
                                                            zoomLevel = 2,
                                                        }) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const currentImg = imgRef.current;
        if (!currentImg) return;

        const updateImgSize = () => {
            setImgSize({
                width: currentImg.offsetWidth,
                height: currentImg.offsetHeight,
            });
        };

        if (currentImg.complete) updateImgSize();
        else currentImg.addEventListener('load', updateImgSize);

        window.addEventListener('resize', updateImgSize);

        return () => {
            window.removeEventListener('resize', updateImgSize);
            currentImg.removeEventListener('load', updateImgSize);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imgRef.current) return;
        const { left, top } = imgRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        setPosition({ x, y });
    };

    const handleClick= useCallback(() => {
        setIsZoomed((prev) => !prev);
    },[])

    return (
        <div className="relative" style={{ width, height }}>
            <Image
                ref={imgRef}
                src={src}
                alt={alt}
                width={imgSize.width || 1000}
                height={imgSize.height || 1000}
                className="w-full h-auto object-cover cursor-pointer"
                onLoad={() => {
                    if (imgRef.current) {
                        setImgSize({
                            width: imgRef.current.offsetWidth,
                            height: imgRef.current.offsetHeight,
                        });
                    }
                }}
                onClick={handleClick}
                onMouseMove={handleMouseMove}
            />
            {isZoomed && imgSize.width > 0 && imgSize.height > 0 && (
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${largeSrc || src})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: `${imgSize.width * zoomLevel}px ${imgSize.height * zoomLevel}px`,
                        backgroundPositionX: `${-position.x * zoomLevel + imgSize.width / 2}px`,
                        backgroundPositionY: `${-position.y * zoomLevel + imgSize.height / 2}px`,
                    }}
                />
            )}
        </div>
    );
};

// Component 5: TouchFriendlyMagnifier
const TouchFriendlyMagnifier: React.FC<MagnifierProps> = ({
                                                              src,
                                                              alt,
                                                              width = '100%',
                                                              height = 'auto',
                                                              zoomLevel = 2,
                                                              magnifierSize = 150,
                                                          }) => {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const currentImg = imgRef.current;
        if (!currentImg) return;

        const updateImgSize = () => {
            setImgSize({
                width: currentImg.offsetWidth,
                height: currentImg.offsetHeight,
            });
        };

        if (currentImg.complete) updateImgSize();
        else currentImg.addEventListener('load', updateImgSize);

        window.addEventListener('resize', updateImgSize);

        return () => {
            window.removeEventListener('resize', updateImgSize);
            currentImg.removeEventListener('load', updateImgSize);
        };
    }, []);

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        if (!imgRef.current) return;
        const { left, top } = imgRef.current.getBoundingClientRect();
        const x = touch.clientX - left;
        const y = touch.clientY - top;
        setPosition({ x, y });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imgRef.current) return;
        const { left, top } = imgRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        setPosition({ x, y });
    };

    return (
        <div className="relative" style={{ width, height }}>
            <Image
                ref={imgRef}
                src={src}
                alt={alt}
                width={imgSize.width || 1000}
                height={imgSize.height || 1000}
                className="w-full h-auto object-cover cursor-crosshair"
                onLoad={() => {
                    if (imgRef.current) {
                        setImgSize({
                            width: imgRef.current.offsetWidth,
                            height: imgRef.current.offsetHeight,
                        });
                    }
                }}
                onTouchStart={() => setShowMagnifier(true)}
                onTouchEnd={() => setShowMagnifier(false)}
                onTouchMove={handleTouchMove}
                onMouseEnter={() => setShowMagnifier(true)}
                onMouseLeave={() => setShowMagnifier(false)}
                onMouseMove={handleMouseMove}
            />
            {showMagnifier && imgSize.width > 0 && imgSize.height > 0 && (
                <div
                    className="absolute border-3 border-black/50 bg-white pointer-events-none rounded-full"
                    style={{
                        width: `${magnifierSize}px`,
                        height: `${magnifierSize}px`,
                        top: `${position.y - magnifierSize / 2}px`,
                        left: `${position.x - magnifierSize / 2}px`,
                        backgroundImage: `url(${src})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: `${imgSize.width * zoomLevel}px ${imgSize.height * zoomLevel}px`,
                        backgroundPositionX: `${-position.x * zoomLevel + magnifierSize / 2}px`,
                        backgroundPositionY: `${-position.y * zoomLevel + magnifierSize / 2}px`,
                    }}
                />
            )}
        </div>
    );
};

export {
    GlassMagnifier,
    SideBySideMagnifier,
    PictureInPictureMagnifier,
    ClickToZoomMagnifier,
    TouchFriendlyMagnifier,
};