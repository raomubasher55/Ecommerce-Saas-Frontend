const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: (i) => (
      <div style={{ backgroundColor: '#4222C4', width: '10px', height: '10px', borderRadius: '50%' }} />
    ),
    appendDots: (dots) => (
      <ul style={{ position: 'absolute', bottom: '-15px', left: '50%', transform: 'translateX(-50%)' }}>
        {dots}
      </ul>
    ),
  };
  
  export default sliderSettings;
  