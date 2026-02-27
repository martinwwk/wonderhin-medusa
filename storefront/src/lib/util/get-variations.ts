import groupBy from 'lodash/groupBy';
import {Variation, VariationsType} from "@/types/template";


export function getVariations(variations: Variation[] = []): VariationsType {
  // Flatten all attribute values from variations
  const allAttributes = variations.flatMap((variation) => {
    if (!variation?.attribute?.values) return [];
    return variation.attribute.values.map((val) => ({
      id: val.id,
      attribute_id: val.attribute_id,
      value: val.value,
      image: val.image ?? '', // Provide fallback for undefined image
      attributeSlug: variation.attribute.slug,
      attributeType: variation.attribute.type,
    }));
  });
  
  // Group by attributeSlug (example: color, memory-storage)
  const grouped = groupBy(allAttributes, 'attributeSlug');

  // Clean up grouped result
  return Object.keys(grouped).reduce((acc: VariationsType, key) => {
    acc[key] = {
      type: grouped[key][0].attributeType,
      options: grouped[key].map(({id, attribute_id, value, image}) => ({
        id,
        attribute_id,
        value,
        image: image ?? '', // Ensure image is string
      })),
    };
    return acc;
  }, {});
}
