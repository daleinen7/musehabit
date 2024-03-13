import Image from 'next/image';
import { SideBySide } from '../components/SideBySide';

const About = () => {
  return (
    <>
      <div>
        <Image
          src={'https://picsum.photos/1512/355'}
          width={1512}
          height={355}
          alt={'about image'}
        />
      </div>
      <div className="width-wrapper flex items-center gap-12 py-[4.375rem] max-w-[65.9375rem]">
        <div className="flex flex-col gap-4 max-w-[44.875rem]">
          <h2 className="font-hepta font-bold text-5xl">about musehabit</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
            dicta in quos molestias! Sint iste saepe esse tempore, explicabo
            quam vel dicta repellat ad quibusdam veniam, nemo exercitationem
            odit quidem!
          </p>
        </div>
        <Image
          src={'https://picsum.photos/300/263'}
          alt="placeholder"
          width={300}
          height={263}
          className="rounded"
        />
      </div>
      <section className="width-wrapper flex flex-col gap-[2.25rem] max-w-[65.9375rem] mb-12">
        <h3 className="font-satoshi text-4xl font-bold">the history</h3>
        <SideBySide
          reverse
          headline={'first date'}
          text={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit dicta in quos molestias! Sint iste saepe esse tempore, explicabo quam vel dicta repellat ad quibusdam veniam, nemo exercitationem odit quidem!'
          }
          image={'https://picsum.photos/504/350'}
          alt={'placeholder'}
        />
        <SideBySide
          headline={'second date'}
          text={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit dicta in quos molestias! Sint iste saepe esse tempore, explicabo quam vel dicta repellat ad quibusdam veniam, nemo exercitationem  odit quidem!'
          }
          image={'https://picsum.photos/504/350'}
          alt={'placeholder'}
        />
        <SideBySide
          reverse
          headline={'third date'}
          text={
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit dicta in quos molestias! Sint iste saepe esse tempore, explicabo quam vel dicta repellat ad quibusdam veniam, nemo exercitationem odit quidem!'
          }
          image={'https://picsum.photos/504/350'}
          alt={'placeholder'}
        />
      </section>
      <section className="width-wrapper font-hepta flex flex-col gap-[2.25rem] max-w-[65.9375rem] mb-12">
        <h3>the team</h3>
        <ul className="grid grid-cols-3 gap-2">
          <li>
            <TeamMember name={'Doug'} role={'code placer'} />
          </li>
          <li>
            <TeamMember name={'Cassidy'} role={'prettifier'} />
          </li>
          <li>
            <TeamMember name={'Mark'} role={'project manager ftw'} />
          </li>
        </ul>
      </section>
    </>
  );
};

const TeamMember = ({ name, role }: { name: string; role: string }) => {
  return (
    <div className="flex flex-col items-center gap-[3rem]">
      <Image
        src={'https://picsum.photos/337/333'}
        alt={'whatever'}
        width={337}
        height={333}
        className="w-[31.5rem] h-[21.875rem] rounded"
      />
      <div className="flex flex-col items-center">
        <h2 className="text-2xl mb-2">{name}</h2>
        <p className="text-xl font-normal font-satoshi">{role}</p>
      </div>
    </div>
  );
};

export default About;
