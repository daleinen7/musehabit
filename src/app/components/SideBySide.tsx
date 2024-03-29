import Image from 'next/image';

type SideBySideProps = {
  headline: string;
  image: string;
  alt: string;
  reverse?: boolean;
  children?: React.ReactNode;
};

export const SideBySide = ({
  headline,
  children,
  image,
  alt,
  reverse,
}: SideBySideProps) => {
  return (
    <div>
      <div
        className={`flex items-center gap-[3rem] ${
          reverse ? 'flex-row-reverse' : ''
        }`}
      >
        <div className="flex flex-col">
          <h2 className="text-2xl mb-2">{headline}</h2>
          {children}
        </div>
        <Image
          src={image}
          alt={alt}
          width={504}
          height={350}
          className="w-[31.5rem] h-[21.875rem] rounded"
        />
      </div>
    </div>
  );
};
