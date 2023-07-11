import "./css/TermsConditions.css";
import {profileBlankspace, termsCard, termsTitle, contactSubtitle} from "./Constants";

function AboutUs() {
  return (
    <div className={profileBlankspace}>
      <div>
        <div className={termsCard}>
            <h2 className={termsTitle}>About Us</h2>
            <br></br>
            <h3 className={contactSubtitle}>Welcome To Tournzilla</h3>
            <p>
                Tournzilla 
                is a Professional <span>sports</span> Platform. 
                Here we will provide you only interesting content, which you will like very much. 
                We're dedicated to providing you the best of <span id="W_Type2">sports</span>, with a 
                focus on dependability and <span id="W_Spec">tournament manager</span>. We're working 
                o turn our passion for <span id="W_Type3">sports</span> into a booming <a href="https://www.blogearns.com" 
                rel="do-follow">online website</a>. We hope you enjoy our <span>sports</span> as much as we enjoy offering 
                them to you.
            </p>
            <p>I will keep posting more important posts on my Website for all of you. Please give your support and love.</p>
            <p>Thanks For Visiting Our Site<br></br>
            <span>Have a nice day !</span></p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
