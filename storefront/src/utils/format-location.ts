import {shippingAddress} from "@/types/template";


export function formatLocation(address: shippingAddress): string {
    const { street_address, city, state, zip, country } = address;

    return [street_address, city, state, zip, country]
        .filter((part) => Boolean(part))
        .join(', ');
}