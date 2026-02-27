"use client";

import React, {useState, useRef, useEffect, CSSProperties} from "react"
import cn from "classnames"
import { motion } from "motion/react"

interface TooltipProps {
    content: React.ReactNode
    children: React.ReactNode
    position?: "top" | "right" | "bottom" | "left"
    className?: string
    rootclassName?: string
    delay?: number
    variant?: string;
    style?: CSSProperties
}

export function Tooltip({
                            content,
                            children,
                            position = "top",
                            className,
                            rootclassName,
                            delay = 300,
                            style,
                            variant='default',
                        }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        setIsMounted(true)
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])
    
    const showTooltip = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => setIsVisible(true), delay)
    }
    
    const hideTooltip = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsVisible(false)
    }
    
    // Position classes based on the position prop
    const positionClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        right: "start-full top-1/2 -translate-y-1/2  mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "end-full top-1/2 -translate-y-1/2  me-2",
    }
    
    // Arrow classes based on the position prop
    const arrowClasses = {
        top:    "bottom-[-10px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent",
        right:  "start-[-10px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent ltr:border-l-transparent rtl:border-r-transparent",
        bottom: "top-[-10px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent",
        left:   "end-[-10px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent ltr:border-r-transparent rtl:border-l-transparent",
    }
    

  
    // Define animation variants inside useMemo to ensure stability
    const animationVariants = React.useMemo(() => {
        const animationLeft = {
            hidden: { opacity: 0, x: -10 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
            exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
        };
        const animationTop = {
            hidden: { opacity: 0, y: -5 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
            exit: { opacity: 0,y: -5, transition: { duration: 0.2 } },
        };
        return position === "left" ? animationLeft : animationTop;
    }, [position]);
    
    if (!isMounted) return <>{children}</>

    return (
        <div
            className={cn("relative inline-block", rootclassName)}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
        >
            {React.cloneElement(children as React.ReactElement, {
                "aria-describedby": isVisible ? "tooltip" : undefined,
            } as { "aria-describedby"?: string | undefined })}
            
            {isVisible && (
                <motion.div
                    id="tooltip"
                    role="tooltip"
                    ref={tooltipRef}
                    className={cn(
                        "absolute z-50 px-3 py-1.5 text-xs rounded capitalize   max-w-xs text-center",
                        " shadow-md pointer-events-none",{
                            "text-brand-dark bg-white": variant ==="dark",
                            "text-white bg-brand-dark": variant ==="default"
                        },
                        positionClasses[position],
                        className,
                    )}
                    style={style}
                    variants={animationVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={(e) => e.stopPropagation()}
                >
                    {content}
                    <div className={cn("absolute border-5 ",{
                            "border-white": variant ==="dark",
                            "border-brand-dark": variant ==="default"
                        },
                        arrowClasses[position])} />
                </motion.div>
            )}
        </div>
    )
}