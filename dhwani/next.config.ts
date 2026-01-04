import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig : NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com', // Allow Google Profile Images
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com', // For Background Image
            },
        ],
    },
};

export default nextConfig;