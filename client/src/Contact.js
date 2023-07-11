import "./css/TermsConditions.css";
import "./css/ContentCard.css";
import "./css/Profile.css";
import {profileBlankspace, termsCard, termsTitle, contactSubtitle, circule} from "./Constants";

function Contact() {
  return (
    <div className={profileBlankspace}>
      <div>
        <div className={termsCard}>
            <h2 className={termsTitle}>Contact us</h2>
              <hr />
                <div className="content">
                  <span className="contact-span">
                    <div className="profile-grid">
                      <button className={circule}>
                        <i className="fa fa-map-marker profile-fa"></i>
                      </button>
                      <h2 className={contactSubtitle}>Address</h2>
                      <p className="contact-info">4036 Terry Lane, Orlando<br/>
                      FL - 32801<br/>
                      Florida, US</p>
                    </div>
                    <div className="profile-grid">
                      <button className={circule}>
                        <i className="fa fa-phone profile-fa"></i>
                      </button>
                      <h2 className={contactSubtitle}>Phone</h2>
                      <p className="contact-info">Telephone: 321-221-4257<br/>
                      Mobile: 407-230-9946<br/>
                      Timezone: UTC-5<br/>
                      Eastern Standard Time (EST)</p>
                    </div>
                    <div className="profile-grid">
                      <button className={circule}>
                      <i className="fa fa-comment profile-fa"></i>
                      </button>
                      <h2 className={contactSubtitle}>Email</h2>
                      <p className="contact-info">tournzilla@gmail.com</p>
                      <button className="card-button-goto" onClick={() => window.open('mailto:tournzilla@gmail.com')}>Send email</button>
                    </div>
                  </span>
                </div>
                <hr />
                <h1 className={contactSubtitle}>How can we help?</h1>
                <p className='contact-paragraph'>Have any info? We would love to hear from you. Email us with any
                question or call 321-221-4257. We would be happy to answer your questions. We usually answer
                within an hour. Tell us your opinion. We care. </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
