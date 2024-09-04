/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {Link, useParams} from 'react-router-dom';
import Avatar from './Avatar';
import {BsThreeDotsVertical} from 'react-icons/bs';
import {FaAngleLeft, FaPlus, FaRegImage, FaVideo} from 'react-icons/fa';
import {IoSendSharp} from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import moment from 'moment';
import uploadFile from '../helpers/UploadFile';
import Loading from './Loading';
import Background from '../assets/wallapaper.jpeg';

const Message = () => {
  const params = useParams();
  const socket = useSelector(state => state?.user?.socketConection);
  const user = useSelector(state => state?.user);

  const [dataUser, setDataUser] = useState({
    name: '',
    email: '',
    profile_pic: '',
    id: '',
    online: false,
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: '',
    imageUrl: '',
    videoUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editMessageId, setEditMessageId] = useState(null);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [allMessages]);

  const handleUploadVideoImage = () => {
    setOpenImageVideoUpload(prev => !prev);
  };

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const uploadedFile = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage(prev => ({
      ...prev,
      [type]: uploadedFile?.url,
    }));
  };

  const handleClearUpload = type => {
    setMessage(prev => ({
      ...prev,
      [type]: '',
    }));
  };

  useEffect(() => {
    if (socket) {
      socket.emit('message-page', params.userId);
      socket.emit('seen', params.userId);

      socket.on('message-user', data => setDataUser(data));
      socket.on('pesan', data => setAllMessages(data));
    }

    return () => {
      if (socket) {
        socket.off('message-user');
        socket.off('pesan');
      }
    };
  }, [socket, params.userId, user]);

  const handleOnChange = e => {
    const {value} = e.target;
    setMessage(prev => ({
      ...prev,
      text: value,
    }));
  };

  const handleSendMessage = e => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      const event = isEditing ? 'edit-message' : 'pesan baru';
      const payload = {
        sender: user?.id,
        receiver: params.userId,
        text: message.text,
        imageUrl: message.imageUrl,
        videoUrl: message.videoUrl,
        msgByUserId: user?.id,
        ...(isEditing && {messageId: editMessageId}),
      };
  
      socket.emit(event, payload);
  
      // Update state allMessages setelah mengirim pesan baru atau pesan yang diedit
      if (isEditing) {
        setAllMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === editMessageId ? { ...msg, text: message.text, imageUrl: message.imageUrl, videoUrl: message.videoUrl } : msg
          )
        );
      } else {
        setAllMessages(prevMessages => [...prevMessages, payload]);
      }
  
      setMessage({text: '', imageUrl: '', videoUrl: ''});
      setIsEditing(false);
      setEditMessageId(null);
    }
  };
  

  const handleEditMessage = (msgId, msgText) => {
    setIsEditing(true);
    setEditMessageId(msgId);
    setMessage(prev => ({
      ...prev,
      text: msgText,
    }));
  };
  

  const handleDeleteMessage = msgId => {
    socket.emit('delete-message', {
      messageId: msgId,
      conversationId: params.userId,
      sender: user.id,
      receiver: params.userId,
    });
  
    // Perbarui state allMessages untuk menghapus pesan dari tampilan
    setAllMessages(prevMessages => prevMessages.filter(msg => msg.id !== msgId));
  };

  return (
    <div
      style={{backgroundImage: `url(${Background})`}}
      className="bg-no-repeat bg-cover">
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <Avatar
            width={50}
            height={50}
            imageUrl={dataUser?.profile_pic}
            name={dataUser?.name}
            userId={dataUser?.id}
          />
          <div>
            <h3 className="font-semibold font-mono text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p className="-my-2 text-sm">
              {dataUser.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>
        <button className="cursor-pointer hover:text-primary">
          <BsThreeDotsVertical />
        </button>
      </header>

      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          {allMessages.map(msg => (
            <div
              key={msg.id}
              className={`bg-white p-1 w-fit py-1 rounded max-w-[200px] md:max-w-sm lg:max-w-md ${
                user.id === msg.msgByUserId ? 'ml-auto bg-gray-200' : 'bg-white'
              }`}>
              {msg?.imageUrl && (
                <img
                  src={msg?.imageUrl}
                  className="w-full h-full object-scale-down"
                />
              )}
              {msg?.videoUrl && (
                <video
                  src={msg?.videoUrl}
                  className="w-full h-full object-scale-down"
                  controls
                />
              )}
              <p className="px-2">{msg.text}</p>
              <p className="text-xs ml-auto w-fit">
                {moment(msg.createdAt).format('hh:mm')}
              </p>
              {user.id === msg.msgByUserId && (
                <div className="flex justify-end mt-1">
                  <button
                    className="text-blue-500 text-xs mr-2"
                    onClick={() => handleEditMessage(msg.id, msg.text)}>
                    Edit
                  </button>
                  <button
                    className="text-red-500 text-xs"
                    onClick={() => handleDeleteMessage(msg.id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {message.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-primary"
              onClick={() => handleClearUpload('imageUrl')}>
              <IoMdClose size={30} />
            </div>
            <div className="bg-gray-200 p-3">
              <img
                src={message.imageUrl}
                alt="upload-Image"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}
        {message.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-primary"
              onClick={() => handleClearUpload('videoUrl')}>
              <IoMdClose size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl}
                alt="upload-Video"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}
        {loading && (
          <div className="w-full h-full sticky bottom-0 flex justify-center items-center">
            <Loading />
          </div>
        )}
      </section>

      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative">
          <button
            onClick={handleUploadVideoImage}
            className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white">
            <FaPlus size={20} />
          </button>

          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <ul className="flex flex-col gap-2">
                <li>
                  <label
                    htmlFor="upload-image"
                    className="flex items-center cursor-pointer">
                    <FaRegImage size={20} />
                    <span className="ml-3">Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      id="upload-image"
                      className="hidden"
                      onChange={e => handleUpload(e, 'imageUrl')}
                    />
                  </label>
                </li>
                <li>
                  <label
                    htmlFor="upload-video"
                    className="flex items-center cursor-pointer">
                    <FaVideo size={20} />
                    <span className="ml-3">Video</span>
                    <input
                      type="file"
                      accept="video/*"
                      id="upload-video"
                      className="hidden"
                      onChange={e => handleUpload(e, 'videoUrl')}
                    />
                  </label>
                </li>
              </ul>
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="flex-1">
          <input
            value={message.text}
            onChange={handleOnChange}
            className="px-3 py-2 mx-3 h-11 rounded-full bg-slate-200 w-full focus:outline-none"
            placeholder="Type a message..."
          />
        </form>
        <button
          onClick={handleSendMessage}
          className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white">
          <IoSendSharp size={25} />
        </button>
      </section>
    </div>
  );
};

export default Message;
