"use client";
import Heading from '@/components/shared/heading';
import Link from '@/components/shared/link';
import cn from 'classnames';
import { useI18n, useLocale } from '@/lib/hooks/use-i18n';
import { translateCategoryName } from '@/lib/util/translate-category';

interface Props {
  className?: string;
  variant?: string;
  data: {
      id: number;
      widgetTitle: string;
        lists?: {
          id: number | undefined;
          path: string| undefined;
          title: string| undefined;
        }[];
  };
}

const WidgetLink: React.FC<Props> = ({  className, data,variant }) => {
    const { t } = useI18n();
    const locale = useLocale();
    const { widgetTitle, lists } = data;
    
  return (
      <div className={cn(
          className
      )}
      >
          <Heading variant="title" className={cn(' mb-4 lg:mb-5', {
                  'text-white': variant === 'dark' ,
              })}>
              {t(widgetTitle)}
          </Heading>
          <ul className="text-15px flex flex-col space-y-3">
              {lists?.map((list) => {
                  // For Shop Categories (dynamic from Medusa), use translateCategoryName
                  // For other widgets (static), use t() for translation keys
                  const displayTitle = widgetTitle === 'shopCategories' && list.title
                      ? translateCategoryName(list.title, locale)
                      : list.title && t(list.title);
                  
                  return (
                      <li key={`widget-list--key${list.id}`}>
                            <Link variant={'reversed'} href={`${list.path ? list.path : ''}`}>
                                {displayTitle}
                            </Link>
                      </li>
                  );
              })}
          </ul>
      </div>
  );
};

export default WidgetLink;
