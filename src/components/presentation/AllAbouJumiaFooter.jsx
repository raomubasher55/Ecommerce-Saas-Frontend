import {
	help,
	aboutJumia,
	sales,
	paymentMethod,
} from "../../utils/footerMenuLinks";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";



export const AllAbouJumiaFooter = () => {
	const { selectedLanguage, translateText } = useLanguage();
	const [translatedContent, setTranslatedContent] = useState({
		helpTitle: "Let Us Help You",
		aboutTitle: "About Cebleu",
		salesTitle: "Make Money with Cebleu",
		joinTitle: "Join Us On",
		paymentTitle: "Payment Methods",
		developerText: "Made with ❤️ by Zahid Ghotia",
		developer: "🚀 Visit Developer"
	});

	const [translatedLinks, setTranslatedLinks] = useState({
		help: [],
		about: [],
		sales: [],
	});

	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const translateContent = async () => {
			const titles = await Promise.all([
				translateText("Let Us Help You"),
				translateText("About Cebleu"),
				translateText("Make Money with Cebleu"),
				translateText("Join Us On"),
				translateText("Payment Methods"),
				translateText("Made with ❤️ by Zahid Ghotia"),
				translateText("🚀 Visit Developer")
			]);

			const helpTranslated = await Promise.all(help.map(text => translateText(text)));
			const aboutTranslated = await Promise.all(aboutJumia.map(text => translateText(text)));
			const salesTranslated = await Promise.all(sales.map(text => translateText(text)));

			setTranslatedContent({
				helpTitle: titles[0],
				aboutTitle: titles[1],
				salesTitle: titles[2],
				joinTitle: titles[3],
				paymentTitle: titles[4],
				developerText: titles[5],
				developer: titles[6]
			});

			setTranslatedLinks({
				help: helpTranslated,
				about: aboutTranslated,
				sales: salesTranslated,
			});
		};

		translateContent();
	}, [selectedLanguage, translateText]);

	const generateSlug = (text) => text.toLowerCase().replace(/\s+/g, "-");

	const helpLinks = (translatedLinks.help.length ? translatedLinks.help : help).map((link, index) => (
		<Link
			to={`/${generateSlug(help[index] || link)}`}
			className="links-texts"
			key={help[index] || link}
		>
			{link}
		</Link>
	));

	const aboutLinks = (translatedLinks.about.length ? translatedLinks.about : aboutJumia).map((link, index) => (
		<Link
			to={`/${generateSlug(aboutJumia[index] || link)}`}
			className="links-texts"
			key={aboutJumia[index] || link}
		>
			{link}
		</Link>
	));

	const salesLinks = (translatedLinks.sales.length ? translatedLinks.sales : sales).map((link, index) => (
		<Link
			to={`/${generateSlug(sales[index] || link)}`}
			className="links-texts"
			key={sales[index] || link}
		>
			{link}
		</Link>
	));


	// const socilaMediaLink = socilaMedia.map((link) => (
	// 	<a
	// 		href={link.link}
	// 		target="_blank"
	// 		rel="noopener noreferrer"
	// 		key={link.icon}
	// 		className="mr-4 cursor-pointer"
	// 	>
	// 		<Icon icon={link.icon} width="25" />
	// 	</a>
	// ));

	const paymentMethodLink = paymentMethod.map((link, index) => (
		<div key={index} className="mr-4 cursor-pointer">
			<Icon icon={link} width="25" />
		</div>
	));


	return (
		<>
			<div className="bg-[#535357] w-full shadow-lg py-6 text-white uppercase">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						<div className="flex flex-col text-white">
							<h1 className="text-lg font-bold mb-3">{translatedContent.helpTitle}</h1>
							{helpLinks}
						</div>
						<div className="flex flex-col text-white">
							<h1 className="text-lg font-bold mb-3">{translatedContent.aboutTitle}</h1>
							{aboutLinks}
						</div>
						<div className="flex flex-col text-white">
							<h1 className="text-lg font-bold mb-3">{translatedContent.salesTitle}</h1>
							{salesLinks}
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-2 sm:gap-48 mt-10 w-full m-auto">
						{/* <div className="flex flex-col text-white">
							<h1 className="text-lg font-bold mb-3">{translatedContent.joinTitle}</h1>
							<div className="flex flex-wrap">{socilaMediaLink}</div>
						</div> */}
						<div className="font-styling">
							<h1 className="text-lg font-bold mb-3">{translatedContent.paymentTitle}</h1>
							<div className="flex flex-wrap">{paymentMethodLink}</div>
						</div>

						{/* <p
							className="py-4 text-white font-medium hover:text-[#8A7CD5] text-center cursor-pointer"
							onClick={() => setShowModal(true)}
						>
							{translatedContent.developerText}
						</p> */}
					</div>
				</div>
			</div>

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-end z-50">
					<div className="bg-gradient-to-br from-white to-gray-100 w-full sm:w-[400px] rounded-t-3xl p-1 shadow-2xl animate-slide-up text-center">
						<h2 className="text-2xl font-extrabold mb-4 text-gray-800 tracking-wide animate-fade-in">
							{translatedContent.developer}
						</h2>
						<div className="flex justify-around text-3xl text-[#8A7CD5] mb-1 animate-fade-in delay-200">
							<a
								href="https://facebook.com/zahidghotia"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:scale-110 transition transform duration-300 hover:text-[#1877f2] drop-shadow-md"
							>
								<FaFacebook />
							</a>
							<a
								href="https://www.linkedin.com/in/zahid-ghotia/"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:scale-110 transition transform duration-300 hover:text-[#0A66C2] drop-shadow-md"
							>
								<FaLinkedin />
							</a>
							<a
								href="https://wa.me/923082769473"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:scale-110 transition transform duration-300 hover:text-[#25D366] drop-shadow-md"
							>
								<FaWhatsapp />
							</a>
							<a
								href="https://fiverr.com/zahidghotia"
								target="_blank"
								rel="noopener noreferrer"
								className="bg-[#1DBF73] text-white w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold shadow-md hover:scale-110 hover:shadow-xl transition-all duration-300"
							>
								f
							</a>

						</div>
						<button
							className="mt-2 text-sm text-gray-500 hover:text-gray-700 transition duration-200 underline animate-fade-in delay-300"
							onClick={() => setShowModal(false)}
						>
							✖ Close
						</button>
					</div>
				</div>
			)}


			{/* Tailwind animation class */}
			<style>
				{`
			@keyframes slideUp {
			  from {
				transform: translateY(100%);
			  }
			  to {
				transform: translateY(0);
			  }
			}
			.animate-slide-up {
			  animation: slideUp 0.3s ease-out;
			}
		  `}
			</style>
		</>
	);
};
