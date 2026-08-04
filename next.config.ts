import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "api.smarty.roberto-riera.com",
				pathname: "/media/**",
			},
			{
				protocol: "http",
				hostname: "dev.api.smarty.roberto-riera.com",
				pathname: "/media/**",
			},
			{
				protocol: "https",
				hostname: "dev.api.smarty.roberto-riera.com",
				pathname: "/media/**",
			},
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
