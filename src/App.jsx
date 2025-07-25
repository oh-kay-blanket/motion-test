import { useScrollAnimation } from './hooks/useScrollAnimation';
import AnimatedWord from './components/AnimatedWord';
import JumbledImageGrid from './components/JumbledImageGrid';
import DancingImages from './components/DancingImages';
import ScrollVideo from './components/ScrollVideo';
import React from 'react';

function App() {
  const scrollProgress = useScrollAnimation();

  return (
    <main className='bg-neutral-900'>
      <div className='min-h-screen w-screen bg-neutral-900'>
        <div className='flex flex-col justify-center items-center px-4'>
          <div className='mt-[50vh] mb-[40vh] -translate-y-1/2 !z-10'>
            <h1 className='text-3xl mb-8 text-center font-oswald font-medium'>
              <div className='flex flex-col items-center gap-2 max-w-xl mx-auto uppercase'>
                {/* First row */}
                <div className='flex gap-0 justify-center'>
                  <AnimatedWord
                    scrollProgress={scrollProgress}
                    animationType='ulScatter'
                    className='bg-yellow-600'
                  >
                    Office
                  </AnimatedWord>
                  <AnimatedWord
                    scrollProgress={scrollProgress}
                    animationType='upScatter'
                    className='bg-sky-800'
                  >
                    of
                  </AnimatedWord>
                </div>

                {/* Second row - only Collecting */}
                <div className='flex justify-center'>
                  <AnimatedWord
                    scrollProgress={scrollProgress}
                    animationType='rightScatter'
                    className='bg-rose-700'
                  >
                    Collecting
                  </AnimatedWord>
                </div>

                {/* Third row */}
                <div className='flex gap-2 justify-center'>
                  <AnimatedWord
                    scrollProgress={scrollProgress}
                    animationType='dlScatter'
                    className='bg-lime-800'
                  >
                    &
                  </AnimatedWord>
                  <AnimatedWord
                    scrollProgress={scrollProgress}
                    animationType='drScatter'
                    className='bg-orange-700'
                  >
                    Design
                  </AnimatedWord>
                </div>
              </div>
            </h1>
          </div>

          <div className='mt-16 space-y-8 max-w-2xl mx-auto'>
            <div className='space-y-6 text-lg leading-relaxed mb-20 text-gray-300'>
              <p>
                The Office of Collecting & Design is a traveling museum -- part wonderland, part
                library, and part nostalgia machine, devoted to the diminutive, the misplaced, the
                unusual, and the forgotten.
              </p>
              <p>
                The space is an elaborate love letter of leftover fragments from our collective
                memories — meticulously organized and displayed for maximum satisfaction and
                delight.
              </p>
              <p>
                In a world saturated with screens and virtual experiences, the Office of Collecting
                and Design is a sanctuary untethered from technology—an oasis of tactile
                exploration, a testament to the tangible, a manifestation of the multi-sensory
                experience of the analog world.
              </p>
              <p>
                By day, immerse yourself in a world where you can open every drawer, explore every
                box, and discover to your heart's content. Visitors are able to participate in our
                Flatlay Experience, our Scavenger Hunt, or just come in to enjoy the space. By
                night, we host artist workshops, poetry readings, tarot sessions, intimate concerts,
                and unforgettable dinner parties.
              </p>
              <p>
                The result is a living sculptural installation piece and beloved community space in
                one.
              </p>
              <p>Check our Tour Dates for a city near you!</p>
            </div>

            {/* Dancing images */}
            <DancingImages scrollProgress={scrollProgress} />

            <div className='mt-16 space-y-8 text-lg leading-relaxed text-gray-300'>
              <h2 className='text-2xl font-semibold mb-4 font-oswald text-gray-100'>
                Summer Break!
              </h2>
              <p>
                The Office of Collecting & Design is on break for the summer. Join our email list to
                be the first to find out where we will be starting our tour in September!
              </p>
              <p>*The museum is not recommended for children.*</p>
              <p>***</p>
              <p>
                We regret that the museum is not wheelchair accessible. Due to the nature of the
                space, there are multiple stairs, narrow passages, and uneven floors throughout. We
                encourage all visitors to consider their mobility needs before planning a visit.
              </p>
              <p>
                If you have questions or would like help determining if the space is right for you,
              </p>
              <p>feel free to reach out — we're happy to assist however we can.</p>
            </div>

            <JumbledImageGrid scrollProgress={scrollProgress} />

            <div className='mt-16 space-y-8 text-lg leading-relaxed text-gray-300'>
              <h2 className='text-2xl font-semibold mb-4 font-oswald text-gray-100'>
                Flatlay Experience
              </h2>
              <p>
                Familiar with our Instagram account @office.of.collecting? We are known for a
                particular type of photograph called a Flatlay - a collection of objects
                photographed from directly above. In this session you can curate, sort, arrange, and
                photograph your own flatlay and go home with a tiny instant film print of your
                creation.
              </p>
              <p>
                We often describe it as somewhere between play therapy and art practice and it is
                our favorite way of sharing the museum.
              </p>
              <p>​Flatlay Sessions last 2 hours and are $75 per person.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video here - completely outside all containers */}
      <div className='bg-neutral-900 py-20'>
        <ScrollVideo />
      </div>

      <div className='w-screen bg-neutral-900'>
        <div className='flex flex-col justify-center items-center px-4'>
          <div className='mt-16 space-y-8 text-lg leading-relaxed text-gray-300 max-w-2xl mx-auto'>
            <h2 className='text-2xl font-semibold mb-4 font-oswald text-gray-100'>
              Scavenger Hunt
            </h2>
            <p>
              Explore the museum and follow our hand-drawn map to hunt down some of our favorite
              objects in the collections! Go home with a tiny copy of the map, time-stamped with
              your results.
            </p>
            <p>Scavenger Hunts last 1 hour and are $35 per person.</p>

            <h2 className='text-2xl font-semibold mb-4 font-oswald text-gray-100 mt-16'>
              Regular Visit
            </h2>
            <p>
              Spend an hour exploring the space at your own pace. Open every drawer, look in every
              box, find all the hidden details.
            </p>
            <p>Regular Visits last one hour and are $22 per person.</p>
          </div>
        </div>
      </div>
      <div className='w-screen bg-neutral-900'>
        <div className='flex flex-col justify-center items-center px-4'>
          <div className='mt-16 space-y-8 text-lg leading-relaxed text-gray-300 max-w-2xl mx-auto'>
            <h2 className='text-2xl font-semibold mb-4 font-oswald text-gray-100'>
              Scavenger Hunt
            </h2>
            <p>
              Explore the museum and follow our hand-drawn map to hunt down some of our favorite
              objects in the collections! Go home with a tiny copy of the map, time-stamped with
              your results.
            </p>
            <p>Scavenger Hunts last 1 hour and are $35 per person.</p>

            <h2 className='text-2xl font-semibold mb-4 font-oswald text-gray-100 mt-16'>
              Regular Visit
            </h2>
            <p>
              Spend an hour exploring the space at your own pace. Open every drawer, look in every
              box, find all the hidden details.
            </p>
            <p>Regular Visits last one hour and are $22 per person.</p>
          </div>
        </div>
      </div>
      <div className='w-screen bg-neutral-900'>
        <div className='flex flex-col justify-center items-center px-4'>
          <div className='mt-16 space-y-8 text-lg leading-relaxed text-gray-300 max-w-2xl mx-auto'>
            <h2 className='text-2xl font-semibold mb-4 font-oswald text-gray-100'>
              Scavenger Hunt
            </h2>
            <p>
              Explore the museum and follow our hand-drawn map to hunt down some of our favorite
              objects in the collections! Go home with a tiny copy of the map, time-stamped with
              your results.
            </p>
            <p>Scavenger Hunts last 1 hour and are $35 per person.</p>

            <h2 className='text-2xl font-semibold mb-4 font-oswald text-gray-100 mt-16'>
              Regular Visit
            </h2>
            <p>
              Spend an hour exploring the space at your own pace. Open every drawer, look in every
              box, find all the hidden details.
            </p>
            <p>Regular Visits last one hour and are $22 per person.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
