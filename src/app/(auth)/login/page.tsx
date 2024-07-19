import LoginForm from "@/components/login-form";
import Link from "next/link";
import React from "react";

interface Props {}

const LoginPage = ({}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="font-SpaceGrotesk text-neutral-950 text-5xl font-bold italic mb-10 u">
        Get Started...
      </h2>
      <LoginForm />
      <div className="mt-5">
        <p className="text-neutral-700 ">
          By continuing on the above you are agreeing to our{" "}
          <Link href="/terms">terms and privacy</Link>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
