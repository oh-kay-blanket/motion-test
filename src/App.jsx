import { useScrollAnimation } from './hooks/useScrollAnimation';
import AnimatedWord from './components/AnimatedWord';

function App() {
  const scrollProgress = useScrollAnimation();

  return (
    <div className='min-h-screen w-screen flex flex-col justify-center items-center px-4 bg-neutral-700'>
      <div className='mt-[35vh]'>
        <h1 className='text-3xl mb-8 text-center font-oswald font-medium'>
          <div className='flex flex-col items-center gap-2 max-w-xl mx-auto uppercase'>
            {/* First row */}
            <div className='flex gap-0 justify-center'>
              <AnimatedWord
                scrollProgress={scrollProgress}
                animationType='leftScatter'
                className='bg-yellow-600'
              >
                Office
              </AnimatedWord>
              <AnimatedWord
                scrollProgress={scrollProgress}
                animationType='upScatter'
                className='bg-sky-700'
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
                className='bg-lime-700'
              >
                &
              </AnimatedWord>
              <AnimatedWord
                scrollProgress={scrollProgress}
                animationType='drScatter'
                className='bg-orange-600'
              >
                Design
              </AnimatedWord>
            </div>
          </div>
        </h1>
      </div>
      <div className='max-w-4xl space-y-6 text-lg leading-relaxed mb-20 text-gray-300'>
        <p>
          The Office of Collecting & Design is a traveling museum -- part wonderland, part library,
          and part nostalgia machine, devoted to the diminutive, the misplaced, the unusual, and the
          forgotten.
        </p>
        <p>
          The space is an elaborate love letter of leftover fragments from our collective memories —
          meticulously organized and displayed for maximum satisfaction and delight.
        </p>
        <p>
          In a world saturated with screens and virtual experiences, the Office of Collecting and
          Design is a sanctuary untethered from technology—an oasis of tactile exploration, a
          testament to the tangible, a manifestation of the multi-sensory experience of the analog
          world.
        </p>
        <p>
          By day, immerse yourself in a world where you can open every drawer, explore every box,
          and discover to your heart's content. Visitors are able to participate in our Flatlay
          Experience, our Scavenger Hunt, or just come in to enjoy the space. By night, we host
          artist workshops, poetry readings, tarot sessions, intimate concerts, and unforgettable
          dinner parties.
        </p>
        <p>
          The result is a living sculptural installation piece and beloved community space in one.
        </p>
        <p>Check our Tour Dates for a city near you!</p>

        <div className='mt-16 space-y-8'>
          <h2 className='text-2xl font-semibold mb-4 font-oswald text-gray-100'>Experience More</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur.
          </p>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </p>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
            laudantium.
          </p>
          <p>
            Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
            beatae vitae dicta sunt.
          </p>
          <p>
            Explicabo nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
          </p>
          <p>
            Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque
            porro quisquam.
          </p>
          <p>
            Est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia non
            numquam.
          </p>
          <p>
            Eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem ut
            enim.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
