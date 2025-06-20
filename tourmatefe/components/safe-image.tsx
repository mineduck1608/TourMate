import React from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

const SafeImage: React.FC<Props> = ({ src, ...rest }) => {
  if (typeof src === 'string' && src.trim() === '') {
    return <img src="/not-found.jpg" {...rest} />;
  }
  const safeSrc = src ?? '/not-found.jpg';
  return <img src={safeSrc} {...rest} />;
};

export default SafeImage;
