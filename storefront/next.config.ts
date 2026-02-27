const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * Medusa backend URL — extract hostname/port/protocol for image optimization
 */
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
let medusaHostname = "localhost"
let medusaProtocol = "http"
let medusaPort = ""
try {
  const url = new URL(MEDUSA_BACKEND_URL)
  medusaHostname = url.hostname
  medusaProtocol = url.protocol.replace(":", "")
  medusaPort = url.port
} catch (e) {
  // fallback to defaults
}

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  logging: {
	fetches: {
	  fullUrl: true,
	},
  },
  eslint: {
	ignoreDuringBuilds: true,
  },
  typescript: {
	ignoreBuildErrors: true,
  },
  images: {
	// loader: "default",
	unoptimized: process.env.NODE_ENV === 'development',
	localPatterns: [
	  {
		pathname: '/api/image-proxy/**',
	  },
	],
	remotePatterns: [
	  {
		protocol: medusaProtocol,
		hostname: medusaHostname,
		...(medusaPort ? { port: medusaPort } : {}),
	  },
	  {
		protocol: "http",
		hostname: "localhost",
	  },
	  {
		protocol: "https",
		hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
	  },
	  {
		protocol: "https",
		hostname: "medusa-server-testing.s3.amazonaws.com",
	  },
	  {
		protocol: "https",
		hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
	  },
	  {
		protocol: "https",
		hostname: "**.amazonaws.com",
	  },
	  {
		protocol: "https",
		hostname: "**.s3.amazonaws.com",
	  },
	  ...(S3_HOSTNAME && S3_PATHNAME
		? [
			{
			  protocol: "https",
			  hostname: S3_HOSTNAME,
			  pathname: S3_PATHNAME,
			},
		  ]
		: []),
	],
  },
  devIndicators: false,
}

module.exports = nextConfig


// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {

// 	reactStrictMode: true,
// 	...(process.env.NODE_ENV === 'production' && {
// 		typescript: {
// 			ignoreBuildErrors: true,
// 		},
// 		eslint: {
// 			ignoreDuringBuilds: true,
// 		},
// 	}),

// };

// // Type assertion to bypass i18n.domains type mismatch
// /*export default withPWA({
// 	dest: 'public',
// 	register: true,
// 	skipWaiting: true,
// 	disable: process.env.NODE_ENV === 'development',
// })(nextConfig as any);*/
// export default nextConfig;