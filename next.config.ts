import type { NextConfig } from "next";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const nextConfig: NextConfig = {
    basePath: baseUrl,
    output: "standalone"
};

console.log("Configs Next.js carregadas")

export default nextConfig;
