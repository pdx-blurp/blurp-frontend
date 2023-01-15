import { Link } from 'react-router-dom';
import BrandName from '../assets/ecomap_transparent_name.png';
import NavbarProp from '../components/navbar';
import Spline from '@splinetool/react-spline';
import SplineModel from '../assets/scene.splinecode';

const Home = () => {
  return (
    <>
      <div className="relative landing-background">
        <NavbarProp />
        <Spline
          className="h-full w-full md:absolute sticky md:scale-100 scale-10"
          scene={SplineModel}
        />
        <div className="relative grid justify-center grid-cols-1 mx-24 px-6/12 py-10 lg:w-5/12 text-white">
          <div className="my-5">
            <div className="grid justify-center">
              <img
                className="m-4 h-40 w-96"
                src={BrandName}
                alt="Ecomapper the Greatest"
              />
              <h2 className="text-center main-subtitle text-white">
                A tool for you to map your relationships
              </h2>
            </div>
          </div>
          <div className="my-5">
            <div className="xl:flex xl:flex-row xl:flex-1 xl:justify-between items-center gap-8">
              <Link to="/blurpmap" className="xl:w-1/2 w-4/5">
                <button className="btn-start">Start (Local)</button>
              </Link>
              <button className="btn-start xl:w-1/2 w-4/5">
                Start (Log In)
              </button>
            </div>
            <div className="grid lg:grid-cols-2"></div>
            <div className="grid">
              <h3 className="text-center text-lg">
                You can get started without needing an account!
              </h3>
              <h3 className="text-center text-lg">
                If you want to access your ecomaps on multiple computers,
              </h3>
              <h3 className="text-center text-lg">
                <a href="">Create an account</a>
              </h3>
            </div>
          </div>
          <div className="grid justify-center my-5">
            <h1 className="text-center section-title">What is an Ecomap?</h1>
            <p className="text-2xl">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor
              veritatis, illum velit quasi, sed tenetur ipsa recusandae
              assumenda distinctio asperiores, a non rerum repellat. Nulla quae
              velit harum quisquam aspernatur. Lorem ipsum dolor, sit amet
              consectetur adipisicing elit. Nostrum, labore quisquam aperiam
              quibusdam expedita numquam quaerat omnis nihil ratione aliquid ex
              quos veniam commodi. Soluta perferendis sit placeat iure minima.
            </p>
          </div>
          <div className="grid justify-center my-5">
            <h1 className="text-center section-title">How it can help you</h1>
            <p className="text-2xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              labore facilis assumenda, laborum quae rerum beatae non magni
              ipsam quasi doloremque omnis facere ab quos officiis ipsum saepe
              quo molestias. Lorem ipsum, dolor sit amet consectetur adipisicing
              elit. Fuga natus iusto exercitationem explicabo incidunt molestias
              accusantium doloremque! Fugiat amet, reiciendis exercitationem
              sed, perspiciatis veniam recusandae nesciunt quasi hic ea
              eligendi.
            </p>
          </div>
          <div className="grid justify-center my-5">
            <h1 className="text-center section-title">How to make an ecomap</h1>
            <p className="text-2xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor,
              rem eaque culpa reiciendis nostrum suscipit exercitationem magni
              eum ratione, mollitia itaque voluptatibus vero consequatur
              consectetur optio officiis harum facilis repellat?
            </p>
          </div>
          <div>
            <h3 className="my-5 text-2xl">Video on how to make an ecomap:</h3>
            <div className="youtube-placeholder flex items-center justify-center">
              <div className="relative bg-red-600 rounded-xl w-1/5 h-1/5 flex items-center justify-center">
                <div className="youtube-triangle"></div>
              </div>
            </div>
          </div>
        </div>
        <footer className="text-center">Made in 2022 by PDX Blurp</footer>
      </div>
    </>
  );
};

export default Home;
