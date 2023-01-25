import { Link } from 'react-router-dom';
import BrandName from '../assets/blurp_noslogan_dark.png';
import NavbarProp from '../components/navbar';
import Spline from '@splinetool/react-spline';
import SplineModel from '../assets/scene.splinecode';

const Home = () => {
  return (
    <div className="landing-background">
      <NavbarProp />
      <div className="grid xl:grid-cols-2 grid-cols-1 justify-items-center">
        <div className="relative grid justify-center grid-cols-1 mx-20 px-6/12 py-10 text-neutral-75 lg:w-5/6 order-last xl:order-first">
          <div className="my-5">
            <div className="grid justify-center">
              <img className="m-4" src={BrandName} alt="Blurp the Greatest" />
              <h2 className="text-center main-subtitle text-white">
                A tool for you to map your relationships
              </h2>
            </div>
          </div>
          <div className="my-5">
            <div className="grid xl:grid-cols-2 grid-cols-1 gap-8 justify-items-center">
              <Link to="/blurp-map" className="btn-start" role="button">
                Start (Local)
              </Link>
              <Link to="/blurp-map" className="btn-start" role="button">
                Start (Log In)
              </Link>
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
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor veritatis, illum velit
              quasi, sed tenetur ipsa recusandae assumenda distinctio asperiores, a non rerum
              repellat. Nulla quae velit harum quisquam aspernatur. Lorem ipsum dolor, sit amet
              consectetur adipisicing elit. Nostrum, labore quisquam aperiam quibusdam expedita
              numquam quaerat omnis nihil ratione aliquid ex quos veniam commodi. Soluta perferendis
              sit placeat iure minima.
            </p>
          </div>
          <div className="grid justify-center my-5">
            <h1 className="text-center section-title">How it can help you</h1>
            <p className="text-2xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur labore facilis
              assumenda, laborum quae rerum beatae non magni ipsam quasi doloremque omnis facere ab
              quos officiis ipsum saepe quo molestias. Lorem ipsum, dolor sit amet consectetur
              adipisicing elit. Fuga natus iusto exercitationem explicabo incidunt molestias
              accusantium doloremque! Fugiat amet, reiciendis exercitationem sed, perspiciatis
              veniam recusandae nesciunt quasi hic ea eligendi.
            </p>
          </div>
          <div className="grid justify-center my-5">
            <h1 className="text-center section-title">How to make an ecomap</h1>
            <p className="text-2xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, rem eaque culpa
              reiciendis nostrum suscipit exercitationem magni eum ratione, mollitia itaque
              voluptatibus vero consequatur consectetur optio officiis harum facilis repellat?
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
        <Spline className="order-first xl:order-last lg:scale-100 scale-75" scene={SplineModel} />
      </div>
      <footer className="text-center">Made in 2022 by PDX Blurp</footer>
    </div>
  );
};

export default Home;
