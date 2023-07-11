import "./css/TermsConditions.css";
import { termsTitle, mainTitle, blankspace } from "./Constants";
import { navigate } from "@reach/router";

function ErrorPage() {
  return (
    <div className={blankspace}>
        <div>
            &nbsp;&nbsp;&nbsp;&nbsp;<h2 align='center' className={mainTitle}>ERROR: Page not found</h2>
            <br></br>
            <h3 className={termsTitle}>The page you requested is either removed from this server or the route is incorrect.</h3>
            <br/>
            <button className='confirm-button card-button-goto' onClick={() => navigate('/')}>Homepage</button>
        </div>
    </div>
  );
}

export default ErrorPage;
