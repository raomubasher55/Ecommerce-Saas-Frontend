import {
	help,
	aboutJumia,
	sales,
	countries,
	socilaMedia,
	paymentMethod,
} from "../../utils/footerMenuLinks";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export const AllAbouJumiaFooter = () => {
	// Utility function to convert text to a URL-friendly format
	const generateSlug = (text) => text.toLowerCase().replace(/\s+/g, "-");

	// Map help links
	const helpLinks = help.map((link) => (
		<Link
			to={`/${generateSlug(link)}`}
			className="links-texts"
			key={link}
		>
			{link}
		</Link>
	));

	// Map about links
	const aboutLinks = aboutJumia.map((link) => (
		<Link
			to={`/${generateSlug(link)}`}
			className="links-texts"
			key={link}
		>
			{link}
		</Link>
	));

	// Map sales links
	const salesLinks = sales.map((link) => (
		<Link
			to={`/${generateSlug(link)}`}
			className="links-texts"
			key={link}
		>
			{link}
		</Link>
	));

	// Map countries links
	const countriestLinks = countries.map((link) => (
		<Link
			to={`/${generateSlug(link)}`}
			className="links-texts"
			key={link}
		>
			{link}
		</Link>
	));

	// Map social media links
	const socilaMediaLink = socilaMedia.map((link) => (
		<a
			href={link.link}
			target="_blank"
			rel="noopener noreferrer"
			key={link.icon}
			className="mr-4 cursor-pointer"
		>
			<Icon icon={link.icon} width="25" />
		</a>
	));

	// Map payment method links
	const paymentMethodLink = paymentMethod.map((link, index) => (
		<div key={index} className="mr-4 cursor-pointer">
			<Icon icon={link} width="25" />
		</div>
	));

	return (
		<div className="bg-[#535357] w-full shadow-lg py-6 text-white uppercase">
			<div className="container mx-auto px-4">
				{/* Main Links Section */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="flex flex-col text-white">
						<h1 className="text-lg font-bold mb-3">Let Us Help You</h1>
						{helpLinks}
					</div>
					<div className="flex flex-col text-white">
						<h1 className="text-lg font-bold mb-3">About Cebleu</h1>
						{aboutLinks}
					</div>
					<div className="flex flex-col text-white">
						<h1 className="text-lg font-bold mb-3">Make Money with Cebleu</h1>
						{salesLinks}
					</div>
					{/* <div className="flex flex-col text-white">
						<h1 className="text-lg font-bold mb-3">Cebleu International</h1>
						<div className="grid grid-cols-2 gap-2">{countriestLinks}</div>
					</div> */}
				</div>

				{/* Social Media and Payment Section */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 gap-6">
					<div className="flex flex-col text-white">
						<h1 className="text-lg font-bold mb-3">Join Us On</h1>
						<div className="flex flex-wrap">{socilaMediaLink}</div>
					</div>
					<div className="font-styling">
						<h1 className="text-lg font-bold mb-3">Payment Methods</h1>
						<div className="flex flex-wrap">{paymentMethodLink}</div>
					</div>
					<p className="py-4 text-white font-medium hover:text-[#8A7CD5]">Develop by Zahid Ghotia</p>
				</div>
			</div>
		</div>
	);
};
