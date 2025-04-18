import Image from "next/image";
import { pageStyles } from "../styles/pageStyles";

import Logo_Crew from "../../public/img/logo/logo_crew.png";
import Background_Image from "../../public/img/login/one_piece.jpg";
import Logo_User from "../../public/img/login/email.svg";
import Logo_Password from "../../public/img/login/password_img.svg";
import Logo_Google from "../../public/img/login/google_img.svg";

const Home: React.FC = () => {
  return (
    <main className="main">
      <div style={pageStyles.container}>
        <div style={pageStyles.imageWrapper}>
          <Image
            src={Background_Image}
            alt="One Piece Background"
            fill
            priority
            quality={100}
            style={pageStyles.image}
          />
          <div style={pageStyles.logoWrapper}>
            <Image
              src={Logo_Crew}
              alt="Logo Crew"
              width={80}
              height={80}
              style={pageStyles.logo}
            />
          </div>
          <div style={pageStyles.textWrapper}>
            <h1 style={pageStyles.title}>Crew</h1>
            <p style={pageStyles.subtitle}>Customer Relationship Management</p>
          </div>
        </div>

        <div style={pageStyles.formContainer}>
          <div style={pageStyles.wrapper}>
            <h2 style={pageStyles.title}>LOGIN</h2>
            <p
              style={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center" }}
            >
              Welcome on Board please connect to use the CRM
            </p>

            <form style={pageStyles.form}>
              <div style={pageStyles.inputContainer}>
                <Image
                  src={Logo_User}
                  alt="Eamil Icon"
                  width={20}
                  height={20}
                  style={pageStyles.logoInput}
                />
                <input
                  type="text"
                  placeholder="Email"
                  style={pageStyles.input}
                />
              </div>

              <div style={pageStyles.inputContainer}>
                <Image
                  src={Logo_Password}
                  alt="Password Icon"
                  width={20}
                  height={20}
                  style={pageStyles.logoInput}
                />
                <input
                  type="password"
                  placeholder="Password"
                  style={pageStyles.input}
                />
              </div>

              <button type="submit" style={pageStyles.primaryButton}>
                START
              </button>
            </form>

            <div style={pageStyles.loginOther}>Login with others</div>

            <button type="button" style={pageStyles.googleButton}>
              <Image
                src={Logo_Google}
                alt="Google Icon"
                width={20}
                height={20}
              />
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
