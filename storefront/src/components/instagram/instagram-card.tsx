'use client';

import Image from '@/components/shared/image';
import { collectionPlaceholder } from '@/assets/placeholders';
import { PropsInstagram} from "@/components/instagram/data";
import React, {useCallback, useMemo} from "react";
import {ShoppingBag} from "lucide-react";
import { useModal } from '@/hooks/use-modal';
import cn from "classnames";

interface Props {
  collection: PropsInstagram;
  variant?: string;
   rounded?: string;
}

const CollectionCard: React.FC<Props> = ({
  collection,
  variant,
  rounded,
}) => {
  const { image,video, title } = collection;
    const { openModal } = useModal();
    const handlePopupView = useCallback(() => {
        openModal("INSTAGRAM_VIEW", collection);
    },[collection, openModal])

    const imgSize = useMemo(() => {
        switch (variant) {
            case 'caleste':
                return {width:300, height:300};
            default:
                return {width:260, height:260};
        }
    }, [variant]);

  return (
      <>
          <div className={cn("flex h-full overflow-hidden relative cursor-pointer",rounded)}
               onClick={handlePopupView}
          >
              {video !=='' ?
                  <video className="absolute z-0  w-full h-full object-cover " src={video} autoPlay loop muted
                         width={imgSize.width}
                         height={imgSize.height}
                  />
                  : <Image
                      src={image ?? collectionPlaceholder}
                      alt={title || 'card-thumbnail'}
                      width={imgSize.width}
                      height={imgSize.height}
                      className={"duration-500 ease-out hover:scale-106"}
                  />
              }
          </div>

          <div className="absolute w-7.5 h-7.5 top-0 end-0 m-3   rounded-full bg-brand-dark flex justify-center items-center">
              <ShoppingBag size={13} strokeWidth={2} className=" text-white " />
          </div>
      </>
  );
};

export default CollectionCard;
