import { list } from "@vercel/blob";
import Image from "next/image";

export async function Images() {
  const { blobs } = await list();

  return (
    <section>
      {blobs.map((image, i) => (
        <Image
          priority={i < 2}
          key={image.pathname}
          src={image.url}
          alt="My Image"
          width={200}
          height={200}
        />
      ))}
    </section>
  );
}
