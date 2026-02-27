import { useUIStore } from '@/stores/useUIStore';
import {HeroItemImage} from "@/types/template";

export const useUI = () => {

    const getImage =(deviceWidth: number, imgObj: HeroItemImage)=> {
        return deviceWidth < 480 ? imgObj.mobile : imgObj.desktop;
    }


    return {
        ...useUIStore(),
        getImage,
    };
};
