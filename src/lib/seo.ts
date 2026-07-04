import { Metadata } from "next";

interface MetadataProps {
    title: string;
    description?: string;
    image?: string;
    icons?: string;
    noIndex?: boolean;
}

export function constructMetadata({
      title,
      description = "Take full control of your transport business — fully digital, fully profitable.",
      image = "/og/default.png",
      icons = "/favicon.ico",
      noIndex = false
  }: MetadataProps): Metadata {
    return {
        title: {
            default: title,
            template: `%s | Admin` // Autosuffixes your site name
        },
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: image,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
            creator: "@democompany" // Optional: Add your handle if you have one
        },
        icons,
        metadataBase: new URL('https://democompany.com'),
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    };
}