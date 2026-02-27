import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import { IoExpandOutline } from 'react-icons/io5';
import {useState} from "react";
import cn from "classnames";
import {Attachment} from "@/types/template";

interface ImgGalleryProps {
    gallery: Attachment[];
    className?: string;
}

const ImageLightBox: React.FC<ImgGalleryProps> = ({gallery,className}) => {
    const [isOpen, setIsOpen] = useState(false);

    const slidesGallery = gallery?.map((image) => {
        return {
            src: image.original
        }
    });

    return (
        <div className={cn(
            "absolute end-3 top-1  z-10 bg-brand-light w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border border-black/10",
            "hover:bg-black hover:text-white",
            className
            )}>
            <button type="button" onClick={() => setIsOpen(true)}>
                <IoExpandOutline className="text-xl"  />
            </button>

            {isOpen && (
                <Lightbox
                    open={isOpen}
                    close={() => setIsOpen(false)}
                    slides={slidesGallery}
                    plugins={[Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom]}
                />
            )}
        </div>
    );
};

export default ImageLightBox;
