import React from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

const SafeImage: React.FC<Props> = ({ src, ...rest }) => {
  const safeSrc = src ? src : '/not-found.jpg';

  return <img src={safeSrc} {...rest} />;
};

export default SafeImage;
