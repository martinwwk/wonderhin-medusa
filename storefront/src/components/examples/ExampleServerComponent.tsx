// Example: Server Component with i18n
import { getServerTranslations, normalizeLocale } from '@/lib/i18n-server';

type ServerComponentProps = {
  params: Promise<{ countryCode: string }>;
};

/**
 * Example server component using SSR translations
 * Translations are loaded on the server for optimal performance
 */
export default async function ExampleServerComponent({ params }: ServerComponentProps) {
  const { countryCode } = await params;
  const locale = normalizeLocale(countryCode);
  
  // Get translation function for server component
  const { t } = await getServerTranslations(locale, ['common']);
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
