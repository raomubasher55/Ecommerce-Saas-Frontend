import { FooterDownLoadApp } from "./DownloadApp/FooterDownLoadApp";
import { FooterSendEmail } from "./EmailSend/FooterSendEmail";
import logo from '../../assets/logo 2.png';

export const FooterPrime = () => {
  return (
    <div className="bg-[#313133] mt-10 shadow-lg py-6 text-white w-full flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-24 px-6 sm:px-16">
      <div className="flex-shrink-0">
          <img src={logo} alt="cebleu" className="w-[100px] h-max m-0 p-0" />
      </div>
      <FooterSendEmail />
      <FooterDownLoadApp />
    </div>
  );
};
