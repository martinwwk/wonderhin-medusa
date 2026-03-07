import { DashboardApp } from "./dashboard-app"
import { DashboardPlugin } from "./dashboard-app/types"

import ProductBrandWidget from "./custom/widgets/product-brand"
import CategoryMediaWidget from "./custom/widgets/category-media"
import BrandsPage, { BrandsIcon } from "./custom/routes/brands/page"
import customTranslations from "./custom/i18n"

import "./index.css"

/**
 * Custom plugin that registers all Wonderhin-specific extensions:
 * - Widgets: Product brand, Category media
 * - Routes: Brands management page
 * - Menu items: Brands in sidebar
 * - i18n: Custom translations (en, zhTW)
 */
const wonderhinPlugin: DashboardPlugin = {
  widgetModule: {
    widgets: [
      {
        Component: ProductBrandWidget,
        zone: ["product.details.before"],
      },
      {
        Component: CategoryMediaWidget,
        zone: ["product_category.details.after"],
      },
    ],
  },
  routeModule: {
    routes: [
      {
        path: "/brands",
        Component: BrandsPage,
      },
    ],
  },
  displayModule: { displays: {} },
  formModule: { customFields: {} },
  menuItemModule: {
    menuItems: [
      {
        label: "Brands",
        path: "/brands",
        icon: BrandsIcon,
      },
    ],
  },
  i18nModule: {
    resources: customTranslations,
  },
}

function App() {
  const app = new DashboardApp({
    plugins: [wonderhinPlugin],
  })

  return <div>{app.render()}</div>
}

export default App
