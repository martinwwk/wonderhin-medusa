// ProductCountdownTimer.tsx
import React, { JSX } from 'react';
import Countdown, { zeroPad,CountdownRenderProps } from 'react-countdown';
import cn from "classnames";

const getTimerRenderer = (variant?: string,className?:string) => {
    const renderer = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps): JSX.Element | null => {
        if (completed) return null;

        const times = [
            { value: days, label: 'days' },
            { value: hours, label: 'hours' },
            { value: minutes, label: 'mins' },
            { value: seconds, label: 'secs' },
        ];

        return (
            <div className={cn("flex items-center justify-center gap-1 lg:gap-2 mb-5 lg:mb-12.5",className)}>
                {times.map((time, idx) => (
                    <React.Fragment key={idx}>
                        <div
                            key={idx}
                            className={cn({
                                    "flex flex-col gap-0.5 lg:min-w-[62px] xl:min-w-[72px] lg:min-h-[85px] p-1.5 rounded items-center justify-center bg-brand-light/20 border border-brand-light/20 backdrop-blur-xs": variant === "default",
                                    "space-x-1 min-w-22": variant === "line"
                                }

                            )}
                        >
                        <span className={cn({
                            "text-xl lg:text-2xl font-medium leading-6": variant === "default",
                            "text-xl lg:text-4xl font-medium leading-8": variant === "line",
                        })}>{zeroPad(time.value)}</span>
                            <span className="text-sm leading-4">{time.label}</span>
                        </div>
                        {variant === "line" && time.label!='secs' && (
                            <div className={"text-3xl"}>:</div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    renderer.displayName = "CountdownRenderer";
    return renderer;
};

const CountdownTimer = ({
    date,
    variant = 'default',
    className=''
      }: {
    date: string | number | Date;
    variant?: string;
    className?: string;
}) => (
    <Countdown date={date} intervalDelay={1000} renderer={getTimerRenderer(variant, className)}  />
);

export default CountdownTimer;
