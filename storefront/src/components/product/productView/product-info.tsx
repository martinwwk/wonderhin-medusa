import React from "react";
import { Product } from "@/types/template";
import { useI18n } from "@lib/hooks/use-i18n";

interface ProductInfoProps {
    data: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ data }) => {
    const { t } = useI18n();
    return (
        <dl className="productView-info text-[14px] leading-8 pb-5 mb-5 border-b border-border-base">
            <dt className="productView-info-name w-40 float-start">{t('brand')}</dt>
            <dd className="productView-info-value">{data.brand}</dd>
            <dt className="productView-info-name w-40 float-start">Operating System:</dt>
            <dd className="productView-info-value">iOS 17</dd>
            <dt className="productView-info-name w-40 float-start">Screen Size:</dt>
            <dd className="productView-info-value" data-product-weight="">
                6.1 Inches
            </dd>
            <dt className="productView-info-name w-40 float-start">Model Name:</dt>
            <dd className="productView-info-value">iPhone 16</dd>
        </dl>
    );
};

export default ProductInfo;