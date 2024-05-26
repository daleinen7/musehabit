import Image from 'next/image';

type SideBySideProps = {
  headline: string;
  image?: string;
  video?: string;
  alt: string;
  reverse?: boolean;
  children?: React.ReactNode;
};

export const SideBySide = ({
  headline,
  children,
  image,
  video,
  alt,
  reverse,
}: SideBySideProps) => {
  return (
    <div
      className={`flex flex-col mb-12 md:mb-0 items-center gap-[3rem] ${
        reverse ? 'md:flex-row-reverse' : 'md:flex-row'
      }`}
    >
      <div className="flex flex-col">
        <h2 className="text-2xl mb-2">{headline}</h2>
        {children}
      </div>
      {image ? (
        <Image
          src={image}
          alt={alt}
          width={504}
          height={350}
          className="w-[31.5rem] h-[21.875rem] rounded-3xl"
        />
      ) : (
        <video
          autoPlay
          loop
          muted
          className="rounded-3xl w-[31.5rem] h-[21.875rem]"
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};
