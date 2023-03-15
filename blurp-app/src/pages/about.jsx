import NavbarProp from "../components/navbar"
import FooterProp from "../components/footer"

//Fun Spline3D page
const AboutPage = () => {
    return (
        <div className="landing-background h-screen w-screen">
            <NavbarProp/>
            <div className="grid xl:grid-cols-2 grid-cols-1 justify-items-center">
                <div className="relative grid justify-center grid-cols-1 mx-20 px-6/12 py-10 text-neutral-75 lg:w-5/6 order-last xl:order-first">
                    <div className="grid justify-center my-5">
                        <h1 className="text-center section-title">about blurp</h1>
                        <p className="text-2xl text-neutral-300">
                            Blurp was designed as a Computer Science Capstone Project at Portland State University from
                            Fall 2022 to Winter 2023, with the goal of providing anyone the ability to easily map out the
                            connections and relationships of their lives. Whether you’re wanting to visualize it personally,
                            map something for friends and family, or share your life with your therapist, Blurp gives
                            you the freedom to do so.
                        </p>
                        <p>&nbsp;</p>
                        <p className="text-2xl text-neutral-300">
                            The concept of Blurp was based on a mix of the concepts of ecomaps and sociograms. Both types
                            let you visually represent relationships with different people, organizations, ideas, and more,
                            to understand one’s social network and its strengths and weaknesses. An ecomap is focused more
                            on an individual’s network, with a sociogram focusing more on the bigger picture. Either way,
                            these tools aren’t very easy to understand, nor are they accessible to the average person.
                        </p>
                        <p>&nbsp;</p>
                        <p className="text-2xl text-neutral-300">
                            With Blurp, you have the freedom to map as much or little as you want. With the ability to save
                            your maps locally or in the cloud, you have the flexibility to work from anywhere or keep your
                            information just to yourself.
                        </p>
                    </div>
                </div>
            </div>
            <FooterProp/>
        </div>
    )
} 

export default AboutPage