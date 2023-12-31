import { blankspace, playerNameLink, termsCard, termsTitle } from "./Constants";
import "./css/TermsConditions.css";

function TermsConditions() {
  return (
    <div className={blankspace}>
      <div>
        <div className={termsCard}>
        <h2 className={termsTitle}><strong>Terms and Conditions</strong></h2>
            <p>Welcome to localhost! <br></br>These terms and conditions outline the rules and regulations for the use of Tournzilla's Website, located at localhost.</p>

            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use localhost if you do not
                agree to take all of the terms and conditions stated on this page.</p>

            <p>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all 
                Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company
                terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties",
                or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment
                necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express
                    purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with
                    and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular,
                    plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.</p>

            <h3><strong>Cookies</strong></h3>

            <p>We employ the use of cookies. By accessing localhost, you agreed to use cookies in agreement with the Tournzilla's
                Privacy Policy. </p>

            <p>Most interactive websites use cookies to let us retrieve the user details for each visit. Cookies are used by our 
                website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our 
                affiliate/advertising partners may also use cookies.</p>

            <h3><strong>License</strong></h3>

            <p>Unless otherwise stated, Tournzilla and/or its licensors own the intellectual property rights for all material on
                localhost. All intellectual property rights are reserved. You may access this from localhost for your own personal
                use subjected to restrictions set in these terms and conditions.</p>

            <p>You must not:</p>
            <ul>
                <li className={`${playerNameLink} requires-default`}>Republish material from localhost</li>
                <li className={`${playerNameLink} requires-default`}>Sell, rent or sub-license material from localhost</li>
                <li className={`${playerNameLink} requires-default`}>Reproduce, duplicate or copy material from localhost</li>
                <li className={`${playerNameLink} requires-default`}>Redistribute content from localhost</li>
            </ul>

            <p>This Agreement shall begin on the date hereof. Our Terms and Conditions were created with the help of the 
                &nbsp;<a href="https://www.termsfeed.com/terms-conditions-generator/">TermsFeed Free Terms and Conditions Generator</a>.
            </p>
        </div>
      </div>
    </div>
  );
}

export default TermsConditions;
