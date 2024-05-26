import Image from 'next/image';
import { SideBySide } from '../components/SideBySide';
import dal from '../images/dal.jpg';
import cassidy from '../images/cassidy.jpg';
import mark from '../images/mark.jpg';
import arthur from '../images/arthur.png';

const About = () => {
  return (
    <>
      <div className="width-wrapper flex justify-start items-center gap-12 text-balance py-[4.375rem]">
        <div className="flex flex-col gap-4">
          <h2 className="font-hepta font-bold text-5xl">about the project</h2>
          <p>
            Musehabit is an online open-mic platform for artists of multiple
            disciplines to share their work and connect with other creatives. We
            want to capture the essence and community feeling of an open-mic
            while utilizing the advantages and accessibility of the internet.
          </p>
        </div>
        <video autoPlay loop muted className="rounded-3xl">
          <source src="/CRTV.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <section className="width-wrapper flex flex-col gap-[2.25rem] max-w-[65.9375rem] mb-12">
        <h3 className="font-satoshi text-4xl font-bold">how it works</h3>
        <SideBySide
          reverse
          headline={'share your art'}
          image={'/Share_your_Art.jpg'}
          alt={'Octopus with a paintbrush and art supplies'}
        >
          <p>
            As an artist, you sign up and share one post per month. Musehabit
            isn&apos;t about showcasing polished masterpieces – it&apos;s a
            place to share works in progress, experiments, and explore ideas in
            their raw form. Try something that would interest you, and you
            alone. Challenge others with your unique perspective. Follow your
            muse.
          </p>
        </SideBySide>
        <SideBySide
          headline={'community and connection'}
          video={'/community_conection.mp4'}
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
          video={'/Accountability.mp4'}
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
              Your post is due every 30 days. With a helpful reminder at the top
              right to show how many days you have left (or how many days until
              you can post again).
            </p>
          </div>
        </SideBySide>
      </section>
      <section className="bg-light-gray text-dark flex flex-col items-center w-full py-8">
        <div className="width-wrapper">
          <h3 className="font-satoshi text-4xl font-bold">the roadmap</h3>
          <ul className="max-w-[40rem] py-4 flex flex-col gap-2">
            <li>
              <span className="font-bold">May:</span> Email Reminders of your
              due date to post
            </li>
            <li>
              <span className="font-bold">June:</span> Updated UI for audio
              player | Notification when a user you follow posts
            </li>
            <li>
              <span className="font-bold">July:</span> Playfull accountability
              functionality (optionally share a public automated post pointing
              out you neglected to post this month)
            </li>
          </ul>

          <p>
            We are a small team and are working hard to make Musehabit the best
            platform it can be. We are always open to feedback and suggestions.
            Please feel free to reach out to us at{' '}
            <a href="mailto:doug@musehabit.com">doug at musehabit dot com</a>.
          </p>
        </div>
      </section>
      <section className="width-wrapper flex flex-col py-8 gap-6 [&>p]:text-balance ">
        <h3 className="font-satoshi text-4xl font-bold">History</h3>
        <p>
          Musehabit was a passion project I started in 2014 and ran for almost a
          year. It was audio only and had around 20 participants. I started it
          because I had already felt social media was failing at helping me keep
          up with my friends.
        </p>
        <p>
          More than that, I found that surrounding myself with art was inspiring
          and made me want to create. I envisioned a platform that would
          constantly remind me that it&apos;s okay to share incomplete ideas. Or
          things that aren&apos;t perfect. For the most part I feel it was a
          success, but 2014 was a different time for the internet and me than
          2024.
        </p>
        <p>
          Ten years later, I have more knowledge of creating on the web, and I
          think even more we need a place to express ourselves that embraces
          distortion, noise, tangents, and all manner of things that do not fit
          in a nice neat package.
        </p>
        <p>I hope you enjoy your time here.</p>
        <p>- Doug Leinen</p>
      </section>
      <section className="width-wrapper font-hepta flex flex-col gap-[2.25rem] max-w-[65.9375rem] mb-12 py-12">
        <h3 className="font-satoshi text-4xl font-bold">the team</h3>
        <ul className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:grid-cols-2">
          <li>
            <TeamMember name={'Doug'} role={'Developer/Founder'} pic={dal} />
          </li>
          <li>
            <TeamMember name={'Cassidy'} role={'Designer'} pic={cassidy} />
          </li>
          <li>
            <TeamMember name={'Mark'} role={'Product Manager'} pic={mark} />
          </li>
          <li>
            <TeamMember name={'Arthur'} role={'Logo Design'} pic={arthur} />
          </li>
        </ul>
      </section>
    </>
  );
};

const TeamMember = ({
  name,
  role,
  pic,
}: {
  name: string;
  role: string;
  pic: any;
}) => {
  return (
    <div className="flex flex-col items-center gap-[1.25rem]">
      <Image
        src={pic}
        alt={`${name} | ${role}`}
        width={337}
        height={333}
        className="w-[31.5rem] h-[21.875rem] rounded-3xl object-cover"
      />
      <div className="flex flex-col items-center mb-5">
        <h2 className="text-2xl mb-2">{name}</h2>
        <p className="text-xl font-normal font-satoshi">{role}</p>
      </div>
    </div>
  );
};

export default About;
