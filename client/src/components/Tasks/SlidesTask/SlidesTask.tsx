import React from 'react';
import Slider, { CustomArrowProps } from 'react-slick';
import { ITask, SlidesTaskBody } from '../../../types';
import styles from './SlidesTask.module.scss';
import { Image } from 'react-bootstrap';

const SampleNextArrow = (props: CustomArrowProps) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block"}}
        onClick={onClick}
      >
        <img src="http://localhost:3000/pngwing.com.png" alt="Вправо" style={{objectFit: "contain", width: "20px"}}/>
      </div>
    );
  }
  
  const SamplePrevArrow = (props: CustomArrowProps) => {
    const { className, style, onClick } = props;
    return (
        <div
        className={className}
        style={{ ...style, display: "block", transform: "scaleX(-1)", WebkitTransform: "scaleX(-1)"}}
        onClick={onClick}
      >
        <img src="http://localhost:3000/pngwing.com.png" alt="Влево" style={{objectFit: "contain", width: "20px"}}/>
      </div>
    );
  }

const SlidesTask: React.FC<{task: ITask}> = ({task}) => {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow/>,
        prevArrow: <SamplePrevArrow/>,
        focusOnSelect: false,
        centerMode: true
      };

    return (
        <div className={styles.slider}>
            <Slider {...settings}>
                {(task.body as SlidesTaskBody).images.map((image, index) => (
                    <div key={`slides-${task.id}-${index}`}>
                        <img src={`${process.env.MEDIA_URL}/${image}`} alt={image} />
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default SlidesTask