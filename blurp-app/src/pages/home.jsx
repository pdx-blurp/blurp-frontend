import { Link } from 'react-router-dom';
import BrandName from '../assets/ecomap_transparent_name.png'
import NavbarProp from '../components/navbar'

const Home = () => {
  return (
    <>
      <div class="background">
        <NavbarProp/>
        <div class="flex justify-center grid grid-cols-1 mx-24 px-6/12 py-10 w-5/12">
          <div class="my-5">
            <div class="grid justify-center">
              <img class="m-4 h-40 w-96" src={BrandName} alt="Ecomapper the Greatest" />
              {/* <h1 class="text-center main-title">Ecomapper</h1> */}
              <h2 class="text-center main-subtitle">
                A tool for you to map your relationships
              </h2>
            </div>
          </div>
          <div class="my-5">
            <div class="flex flex-row flex-1 justify-end items-center gap-8">
              <button class="btn-start px-8 ">Start (Local)</button>
              <button class="btn-start px-8">Start (Log In)</button>
            </div>
            <div class="flex grid lg:grid-cols-2">
            </div>
            <div class="grid">
              <h3 class="text-center text-lg">
                You can get started without needing an account!
              </h3>
              <h3 class="text-center text-lg">
                If you want to access your ecomaps on multiple computers,
              </h3>
            </div>
          </div>
          <div class="grid justify-center my-5">
            <h1 class="text-center section-title">What is an Ecomap?</h1>
            <p class="text-2xl">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor
              veritatis, illum velit quasi, sed tenetur ipsa recusandae assumenda
              distinctio asperiores, a non rerum repellat. Nulla quae velit harum
              quisquam aspernatur. Lorem ipsum dolor, sit amet consectetur
              adipisicing elit. Nostrum, labore quisquam aperiam quibusdam
              expedita numquam quaerat omnis nihil ratione aliquid ex quos veniam
              commodi. Soluta perferendis sit placeat iure minima.
            </p>
          </div>
          <div class="grid justify-center my-5">
            <h1 class="text-center section-title">How it can help you</h1>
            <p class="text-2xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              labore facilis assumenda, laborum quae rerum beatae non magni ipsam
              quasi doloremque omnis facere ab quos officiis ipsum saepe quo
              molestias. Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Fuga natus iusto exercitationem explicabo incidunt molestias
              accusantium doloremque! Fugiat amet, reiciendis exercitationem sed,
              perspiciatis veniam recusandae nesciunt quasi hic ea eligendi.
            </p>
          </div>
          <div class="grid justify-center my-5">
            <h1 class="text-center section-title">How to make an ecomap</h1>
            <p class="text-2xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, rem
              eaque culpa reiciendis nostrum suscipit exercitationem magni eum
              ratione, mollitia itaque voluptatibus vero consequatur consectetur
              optio officiis harum facilis repellat?
            </p>
          </div>
          <div>
            <h3 class="my-5 text-2xl">Video on how to make an ecomap:</h3>
            <div class="youtube-placeholder flex items-center justify-center">
              <div class="relative bg-red-600 rounded-xl w-1/5 h-1/5 flex items-center justify-center">
                <div class="youtube-triangle"></div>
              </div>
            </div>
          </div>
        </div>
        <footer class="text-center">Made in 2022 by Team Ecomap</footer>
      </div>
    </>
    );
};

export default Home;
