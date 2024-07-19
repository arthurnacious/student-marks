import React, { FC } from "react";

interface Props {
  children: React.ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="p-20 h-screen bg-[url('/auth-bg.jpg')]">
      <div className="flex gap-10 bg-white/15 backdrop-blur-sm h-full max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-black/50 shadow-lg p-10">
        <div className="bg-gradient-to-r from-teal-500/80 to-blue-500/80 backdrop-grayscale-0 h-full w-1/2 max-w-2xl rounded-2xl overflow-hidden">
          <div className="flex flex-col space-y-5 items-center justify-center pt-10 p-10 text-center">
            <h3 className="text-2xl text-white font-extrabold mt-10 font-poppins">
              Welcome back to{" "}
              <span className="font-graduate">
                <span className="text-teal-500">M</span>arkus
              </span>
            </h3>
            <p className="text-gray-200 text-5xl">
              Start with something beautiful.
            </p>
          </div>
          <div className=" bg-[url('/woman-with-tablet.png')] bg-no-repeat w-full h-full bg-right-top" />
        </div>
        <div className="bg-gradient-to-r from-slate-100/80 to-neutral-400/80 backdrop-grayscale-0 w-1/2 rounded-2xl p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
