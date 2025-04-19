import Carousel from "react-image-carousel";

export const CarouselSlider = ({ images }) => {
  return (
    <div className="my-carousel mx-auto overflow-hidden">
      <Carousel
        images={images}
        thumb={false}
        loop={true}
        autoplay={10000}
        arrow={true}
        className="w-full h-auto" // Ensure the carousel takes full width and height as needed
      />
    </div>
  );
};
