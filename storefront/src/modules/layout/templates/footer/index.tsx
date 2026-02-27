import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text } from "@medusajs/ui"
import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Twitter from "@modules/common/icons/twitter"
import Facebook from "@modules/common/icons/facebook"
import Instagram from "@modules/common/icons/instagram"
import Youtube from "@modules/common/icons/youtube"

export default async function Footer() {
  const productCategories = await listCategories()

  return (
    <footer className="bg-[#1e293b] text-gray-300 w-full">
      <div className="content-container">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Logo and Description */}
            <div className="lg:col-span-1">
              <LocalizedClientLink
                href="/"
                className="inline-block mb-4 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/wonderhin-logo.png"
                  alt="Wonderhin"
                  width={140}
                  height={28}
                  className="h-7 w-auto invert opacity-60"
                />
              </LocalizedClientLink>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                Bringing you quality products and exceptional service. Your satisfaction is our priority.
              </p>
            </div>

            {/* About Us */}
            <div>
              <h3 className="text-white font-semibold text-base mb-4">About Us</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <LocalizedClientLink href="/store" className="hover:text-white transition-colors">
                    Our Stores
                  </LocalizedClientLink>
                </li>
                {productCategories?.slice(0, 4).map((category) => {
                  if (category.parent_category) return null
                  return (
                    <li key={category.id}>
                      <LocalizedClientLink
                        href={`/categories/${category.handle}`}
                        className="hover:text-white transition-colors"
                      >
                        {category.name}
                      </LocalizedClientLink>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h3 className="text-white font-semibold text-base mb-4">Customer Care</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <LocalizedClientLink href="/account" className="hover:text-white transition-colors">
                    Track Your Order
                  </LocalizedClientLink>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Corporate &amp; Bulk Purchasing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Returns &amp; Refunds
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-white font-semibold text-base mb-4">Contact Us</h3>
              <ul className="space-y-2.5 text-sm">
                <li className="text-gray-400">
                  70 Washington Square South, New York, NY 10012, United States
                </li>
                <li>
                  <a href="mailto:hello@wonderhin.com" className="hover:text-white transition-colors">
                    Email: hello@wonderhin.com
                  </a>
                </li>
                <li>
                  <a href="tel:+11234567890" className="hover:text-white transition-colors">
                    Phone: +1 123 456 7890
                  </a>
                </li>
              </ul>

              {/* Social Media Icons */}
              <div className="flex gap-4 mt-6">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size="20" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size="20" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size="20" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube size="20" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex justify-center items-center gap-2 text-sm text-gray-400">
            <Text className="txt-compact-small">
              © {new Date().getFullYear()} Wonderhin. All rights reserved.
            </Text>
          </div>
        </div>
      </div>
    </footer>
  )
}
