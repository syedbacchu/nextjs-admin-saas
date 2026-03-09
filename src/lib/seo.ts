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
      description = "Keep track of your games with ease, anytime, anywhere.",
      image = "/og/default.png",
      icons = "/favicon.ico",
      noIndex = false
  }: MetadataProps): Metadata {
    return {
        title: {
            default: title,
            template: `%s | SetMyScore` // Autosuffixes your site name
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
            creator: "@setmyscore" // Optional: Add your handle if you have one
        },
        icons,
        metadataBase: new URL('https://setmyscore.com'),
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    };
}