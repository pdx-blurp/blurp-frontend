import FooterProp from '../components/footer';
import NavbarProp from '../components/navbar';
import PSU_IMG from '../assets/PSU.jpg';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';

/* 
Fixed background following this stackoverflow post
https://stackoverflow.com/questions/66025707/how-do-you-set-a-full-page-background-color-in-tailwind-css
*/
const ContactPage = () => {
  return (
    <div className="landing-background min-w-screen min-h-screen">
      <NavbarProp />
      <div className="m-4 md:grid md:grid-cols-6 lg:m-8 lg:grid-cols-8">
        <div className="col-span-3">
          <h1 className="contact-page-label">Let us know your thoughts!</h1>
          <p className="text-2xl text-neutral-300">
            Want to make a comment about our app? Or found a bug while using our app? Let us know by
            filling out the form below!
          </p>
          <form className="my-4 md:grid md:grid-cols-2">
            <label className="contact-page-label" htmlFor="sender-name">
              Name
            </label>
            <input type="text" id="sender-name" placeholder="Name" className="contact-page-text" />
            <label className="contact-page-label" htmlFor="sender-email">
              Email
            </label>
            <input
              type="text"
              placeholder="Email"
              className="contact-page-text"
              id="sender-email"
            />
            <label className="contact-page-label" htmlFor="sender-msg">
              Message
            </label>
            <textarea
              className="contact-page-text col-span-2"
              placeholder="Write your thoughts here"
              id="sender-msg"
              rows="10"
            />
            <button className="contact-page-button">Submit</button>
          </form>
        </div>
        <div className="md:col-span-1 lg:col-span-3" />
        <div className="col-span-2">
          <img
            className="scale-95 rounded-lg"
            src={PSU_IMG}
            alt="An image of the PSU park blocks"></img>
          <div className="mx-4 text-right text-2xl text-neutral-300">
            <p>
              Portland State University
              <br />
              1825 SW Broadway
              <br />
              Portland, OR 97201
            </p>
            <br />
            <a href="mailto:blurp.mgmt@gmail.com" className="mx-4">
              <EmailIcon className="scale-[2.0]" />
            </a>
            <a href="https://github.com/pdx-blurp" className="mx-4">
              <GitHubIcon className="scale-[2.0]" />
            </a>
          </div>
        </div>
      </div>
      <FooterProp />
    </div>
  );
};

export default ContactPage;
