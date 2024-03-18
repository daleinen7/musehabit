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
            As an artist, you sign up and share one post per month. Other
            artists can see and favorite your posts, or follow you as an artist
            and you are encouraged to do the same! Artists on Musehabit should
            know that this isn&apos;t a platform that requires fully realized
            art pieces. Share failed experiments. Share incomplete ideas.
            Challenge others with your vision.
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
          <p>
            In addition to <i>only</i> being able to post once per month,
            Musehabit has an optional &quot;accountability&quot; feature that
            allows you to set the goal of creating something and sharing it once
            per month.
          </p>
          <p>
            From the date that you sign up, you have until that date next month
            to post. If you don&apos;t share, Musehabit will post for you and
            your feed will replace what would have been your post with a
            (customizable) automated post pointing out that you missed your
            deadline. This is a playful way to keep yourself accountable.
          </p>
          <p>
            This feature is optional and can be turned off at any time. It is
            not meant to shame or guilt anyone, but to help users who want to
            stay on track with their creative goals.
          </p>
        </SideBySide>
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
