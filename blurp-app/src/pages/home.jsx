import { Link } from 'react-router-dom';
import BrandName from '../assets/blurp_full_logo_white.png';
import NavbarProp from '../components/navbar';
import Spline from '@splinetool/react-spline';
import SplineModel from '../assets/scene.splinecode';
import TempMessage from '../components/temp_msg_display';
import { useRef } from 'react';
import { useCookies } from 'react-cookie';

const Home = () => {
  const welcomeMsgRef = useRef(false);
  const [cookies, setCookie, removeCookie] = useCookies();

  // If there's a userName, the user is logged in. Welcome msg:
  let msgToDisplayOnLoad = '';
  if (cookies['userName']) {
    msgToDisplayOnLoad = "Hello, " + cookies['userName'];
  }
  
  return (
    <div className="landing-background">
      <NavbarProp />
      <div className="grid xl:grid-cols-2 grid-cols-1 justify-items-center">
        <div className="relative grid justify-center grid-cols-1 mx-20 px-6/12 py-10 text-neutral-75 lg:w-5/6 order-last xl:order-first">
          <div className="my-5">
            <div className="grid justify-center">
              <img className="mx-24" src={BrandName} alt="Blurp the Greatest" />
              <h2 className="text-center main-subtitle text-slate-400">
                Bridging <p className='sugar-text1'>Lives</p>. Understanding <p className='sugar-text1'>Relationships</p> & <p className='sugar-text1'>People</p>.
              </h2>
            </div>
          </div>
          <div className="my-5">
            <div className="grid grid-cols-1 gap-8 justify-items-center">
              <Link to="/blurp-map" className="btn-start" role="button">
                Open App
              </Link>
            </div>
            <div className="grid lg:grid-cols-2"></div>
          </div>
          <div className="grid justify-center my-5">
            <h1 className="text-center section-title">what is blurp?</h1>
            <p className="text-2xl text-neutral-300">
              Blurp is a creative visualization tool for mapping relationships in one's life.
              These relationships include anything from work relationships with your tyrant boss, to relationships
              you have with an idea about the existence of rubber ducks. With Blurp, anything goes – it’s your map.
            </p>
          </div>
          <div className="grid justify-center my-5">
            <h1 className="text-center section-title">how it can help you</h1>
            <p className="text-2xl text-neutral-300">
              Mapping relationships is an important aspect of our lives. We are constantly interacting with the world
              around us, forming connections and building relationships with everything from family and friends to
              ideas and interests. However, it can be difficult to keep track of these connections and understand how
              they all fit together. Blurp lets you safely spill the beans, mapping out these connections to understand
              the world around you.
            </p>
          </div>
          <div className="grid justify-center my-5">
            <h1 className="text-center section-title">how to make a blurp map</h1>
            <p className="text-2xl text-neutral-300">
              We understand that mapping out your relationships can be very personal and complex, which is why we offer
              flexibility in organizing and visualizing your connections. You can create entities of different types and
              sizes, as well as add relationships with different properties, allowing you to view a more detailed and
              interconnected view of your relationships. Additionally, you have the ability to save your maps locally
              or in the cloud, giving you the flexibility to work from anywhere or keep your information just to yourself.
              With Blurp, you have the freedom.
            </p>
          </div>
        </div>
        <Spline className="order-first xl:order-last xl:scale-[0.9] lg:scale-[0.88] md:scale-[0.72] scale-[0.55]" scene={SplineModel} />
      </div>
      <div className="absolute inset-y-1/2 inset-x-1/2">
	      <TempMessage ref={welcomeMsgRef} message={msgToDisplayOnLoad} duration={1000}/>
      </div>
      <footer className="text-center text-white">Made with <div className="inline text-red-500">love</div> in 2022 by PDX Blurp</footer>
    </div>
  );
};

export default Home;
