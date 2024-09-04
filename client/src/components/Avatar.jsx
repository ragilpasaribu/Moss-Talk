/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {LiaUserCircleSolid} from 'react-icons/lia';
import {useSelector} from 'react-redux';

const Avatar = ({userId, name, imageUrl, width, height}) => {
  const userOnline = useSelector(state => state?.user?.onlineUser);

  let avatarName = '';
  if (name) {
    const splitName = name?.split(' ');
    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

  const bgColor = [
    'bg-slate-200',
    'bg-teal-200',
    'bg-red-200',
    'bg-green-200',
    'bg-yellow-200',
  ];

  const randomNumber = Math.floor(Math.random() * 5);
  const isOnline = userOnline.includes(userId);
  return (
    <div
      className={`text-slate-800 overflow-hidden rounded-full shadow border text-xl font-bold relative ${bgColor[randomNumber]}`}
      style={{width: width + 'px', height: height + 'px'}}>
      {imageUrl ? (
        <img
          src={imageUrl}
          width={width}
          height={height}
          alt={name}
          onError={(e) => {e.target.src = 'default_image_url.png';}}
          className="overflow-hidden rounded-full"
        />
      ) : name ? (
        <div
          style={{width: width + 'px', height: height + 'px'}}
          className="overflow-hidden rounded-full flex justify-center items-center">
          {avatarName}
        </div>
      ) : (
        <LiaUserCircleSolid size={width} />
      )}

      {isOnline && <div className="bg-green-600 p-1 absolute bottom-1  right-1 z-0 rounded-full"></div>}
    </div>
  );
};

export default Avatar;
