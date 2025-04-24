import Image from "next/image";
import { pageStyles } from "@/styles/pageStyles";
import Logo_Crew from "@public/img/logo/logo_crew.png";
import Background_Image from "@public/img/login/one_piece.jpg";

import LoginForm from "@/components/forms/auth/LoginForm";

const Login: React.FC = () => {
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
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
