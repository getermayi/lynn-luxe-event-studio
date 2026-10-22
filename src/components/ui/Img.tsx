import Image, { type ImageProps } from "next/image";

/** next/image that also handles uploaded (/media) and external URLs gracefully. */
export function Img({ src, alt, ...rest }: Omit<ImageProps, "src"> & { src?: string | null }) {
  if (!src) return <div className={`bg-forest-700 ${rest.className ?? ""}`} aria-hidden />;
  const local = src.startsWith("/images/") || src.startsWith("/brand/");
  return <Image src={src} alt={alt} unoptimized={!local} {...rest} />;
}
