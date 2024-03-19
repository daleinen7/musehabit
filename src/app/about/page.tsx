import Image from 'next/image';
import { SideBySide } from '../components/SideBySide';

const About = () => {
  return (
    <>
      <div className="w-full">
        <Image
          src={'https://picsum.photos/1512/355'}
          width={1512}
          height={355}
          alt={'about image'}
          className="w-full h-[20.625rem] object-cover"
        />
      </div>
      <div className="width-wrapper flex justify-start items-center gap-12 text-balance py-[4.375rem]">
        <div className="flex flex-col gap-4">
          <h2 className="font-hepta font-bold text-5xl">about musehabit</h2>
          <p>
            Musehabit is an online open-mic platform for artists of multiple
            disciplines to share their work and connect with other creatives. We
            want to capture the essence and community feeling of an open-mic but
            utilize the advantages and accessibility of the internet.
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
        <h3 className="font-satoshi text-4xl font-bold">how it works</h3>
        <SideBySide
          reverse
          headline={'share your art'}
          image={'https://picsum.photos/504/350'}
          alt={'placeholder'}
        >
          <p>
            As an artist, you sign up and share one post per month. Musehabit
            isn&apos;t about showcasing polished masterpieces – it&apos;s a
            place to share works in progress, experiments, and ideas in their
            raw form. Try something you would interest you and challenge others
            with your unique perspective.
          </p>
        </SideBySide>
        <SideBySide
          headline={'community and connection'}
          image={'https://picsum.photos/504/350'}
          alt={'placeholder'}
        >
          <div className="flex flex-col gap-4">
            <p>
              Musehabit is a unique social platform in that users can only post
              once per month. This helps all users have an equal chance to be
              seen and heard. It also encourages users to be more thoughtful
              about what they share. What represents where you are as an artist
              this month?
            </p>
            <p>
              It also harkens back to a time when the internet was more about
              staying connected with your friends and artistic peers than
              curated content.
            </p>
          </div>
        </SideBySide>
        <SideBySide
          reverse
          headline={'accountability'}
          image={'https://picsum.photos/504/350'}
          alt={'placeholder'}
        >
          <div className="flex flex-col gap-4">
            <p>
              In addition to only being able to post once per month, Musehabit
              offers an optional &quot;accountability&quot; feature. This
              feature allows you to set a goal of creating and sharing something
              once per month.
            </p>
            <p>
              Upon signing up, you&apos;ll have until the same date next month
              to post. If you miss the deadline, Musehabit will automatically
              post for you. Your feed will replace what would have been your
              post with a customizable automated message, gently reminding you
              that you missed your deadline. It&apos;s a playful way to keep
              yourself accountable.
            </p>
            <p>
              This feature is entirely optional and can be turned off at any
              time. Its purpose is not to shame or guilt anyone but to assist
              users who wish to stay on track with their creative goals.
            </p>
          </div>
        </SideBySide>
      </section>
      <section className="bg-slate-100 flex flex-col items-center w-full py-8">
        <div className="width-wrapper">
          <h3 className="font-satoshi text-4xl font-bold">the roadmap</h3>
          <ul className="max-w-[40rem] py-4 flex flex-col gap-2">
            <li>
              <span className="font-bold">April:</span> MVP
            </li>
            <li>
              <span className="font-bold">May:</span> Email Notifications |
              Audience account (commenting, saving posts to a list, no
              posting/sharing)
            </li>
            <li>
              <span className="font-bold">June:</span> ???
            </li>
          </ul>
        </div>
      </section>
      <section className="width-wrapper font-hepta flex flex-col gap-[2.25rem] max-w-[65.9375rem] mb-12 py-12">
        <h3 className="font-satoshi text-4xl font-bold">the team</h3>
        <ul className="grid grid-cols-3 gap-2">
          <li>
            <TeamMember name={'Doug'} role={'Developer/Founder'} />
          </li>
          <li>
            <TeamMember name={'Cassidy'} role={'Designer'} />
          </li>
          <li>
            <TeamMember name={'Mark'} role={'Product Manager'} />
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
