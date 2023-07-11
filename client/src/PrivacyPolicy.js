import "./css/TermsConditions.css";
import {termsTitle, profileBlankspace, termsCard, contactSubtitle, playerNameLink} from "./Constants";

function PrivacyPolicy() {
  return (
    <div className={profileBlankspace}>
      <div>
        <div className={termsCard}>
            <h1 className={termsTitle}>Privacy Policy for Tournzilla</h1>

            <p>At localhost, accessible from localhost, one of our main priorities is the privacy of our visitors. 
                This Privacy Policy document contains types of information that is collected and recorded by localhost 
                and how we use it.

            <br/>If you have additional questions or require more information about our Privacy Policy, do not hesitate to 
                contact us.

            <br/>This Privacy Policy applies only to our online activities and is valid for visitors to our website with 
                regards to the information that they shared and/or collect in localhost. This policy is not applicable 
                to any information collected offline or via channels other than this website. Our Privacy Policy was 
                created with the help of the <a href="https://www.termsfeed.com/privacy-policy-generator/">TermsFeed 
                Free Privacy Policy Generator</a>.</p>

            <h2 className={contactSubtitle}>Consent</h2>

            <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>

            <h2 className={contactSubtitle}>Information we collect</h2>

            <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will 
                be made clear to you at the point we ask you to provide your personal information.
            <br/>If you contact us directly, we may receive additional information about you such as your name, email address, 
                phone number, the contents of the message and/or attachments you may send us, and any other information you may 
                choose to provide.
            <br/>When you register for an Account, we may ask for your contact information, including items such as name, company 
                name, address, email address, and telephone number.</p>

            <h2 className={contactSubtitle}>How we use your information</h2>

            <p>We use the information we collect in various ways, including to:</p>

            <ul>
            <li className={`${playerNameLink} requires-default`}>Provide, operate, and maintain our website</li>
            <li className={`${playerNameLink} requires-default`}>Improve, personalize, and expand our website</li>
            <li className={`${playerNameLink} requires-default`}>Understand and analyze how you use our website</li>
            <li className={`${playerNameLink} requires-default`}>Develop new products, services, features, and functionality</li>
            <li className={`${playerNameLink} requires-default`}>Communicate with you, either directly or through one of our partners, including for customer service, to provide 
                you with updates and other information relating to the website, and for marketing and promotional purposes</li>
            <li className={`${playerNameLink} requires-default`}>Send you emails</li>
            <li className={`${playerNameLink} requires-default`}>Find and prevent fraud</li>
            </ul>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
