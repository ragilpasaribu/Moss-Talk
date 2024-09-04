/* eslint-disable no-unused-vars */
import {AiFillWechat} from 'react-icons/ai';
import {FaUserPlus} from 'react-icons/fa';
import {NavLink, useNavigate} from 'react-router-dom';
import {RiLogoutBoxFill} from 'react-icons/ri';
import Avatar from './Avatar';
import {useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import EditUserDetail from './EditUserDetail';
import {FiArrowUpLeft} from 'react-icons/fi';
import SearchUser from './SearchUser';
import {FaRegImage} from 'react-icons/fa6';
import {FaVideo} from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/UserSlice';

const Sidebar = () => {
  const user = useSelector(state => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const koneksiSocket = useSelector(state => state?.user?.socketConection);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (koneksiSocket) {
      koneksiSocket.emit('sidebar', user.id);

      koneksiSocket.on('Percakapan', data => {
        console.log('Percakapan Kami', data);

        const converSationUserData = data.map((converSationUser, index) => {
          if (converSationUser?.sender?.id === converSationUser?.receiver?.id) {
            return {
              ...converSationUser,
              userDetails: converSationUser.sender,
            };
          } else if (converSationUser?.receiver?.id !== user?.id) {
            return {
              ...converSationUser,
              userDetails: converSationUser.receiver,
            };
          } else {
            return {
              ...converSationUser,
              userDetails: converSationUser.sender,
            };
          }
        });
        setAllUser(converSationUserData);
      });
    }
  }, [koneksiSocket, user]);

  const handleLogout = ()=>{
    dispatch(logout())
    navigate("/email")
    localStorage.clear()
  }

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
      <div className="bg-slate-200 w-12 h-full rounded-tr-lg rounded-br-lg py-5 flex flex-col justify-between">
        <div>
          <NavLink
            className={({isActive}) =>
              `w-12 h-12 cursor-pointer flex justify-center items-center hover:bg-slate-300 rounded ${
                isActive && 'bg-slate-300'
              }`
            }
            title="Ngobrol">
            <AiFillWechat size={20} />
          </NavLink>

          <div
            className="w-12 h-12 cursor-pointer flex justify-center items-center hover:bg-slate-300 rounded"
            title="Tambah Teman"
            onClick={() => setOpenSearchUser(true)}>
            <FaUserPlus size={20} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="mx-auto"
            title={user?.name}
            onClick={() => setEditUserOpen(true)}>
            <Avatar
              width={40}
              height={40}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?.id}
            />
          </button>

          <button
            className="w-12 h-12 cursor-pointer flex justify-center items-center hover:bg-slate-300 rounded"
            title="Keluar" onClick={handleLogout}>
            <span className="-ml-1">
              <RiLogoutBoxFill size={20} />
            </span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 text-slate-800">Pesan</h2>
        </div>
        <div className="bg-slate-300 p-[0.5px]"></div>
        <div className=" h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUUser.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                jelajahi pengguna untuk memulai percakapan dengan
              </p>
            </div>
          )}

          {allUUser.map((conv, index) => {
            return (
              <NavLink to={'/'+ conv?.userDetails?.id} key={conv?.id} className="flex items-center gap-2 px-2 py-3 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer">
                <div>
                  <Avatar
                    imageUrl={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.name}
                    width={40}
                    height={40}
                  />
                </div>

                <div>
                  <h3 className="text-ellipsis line-clamp-1">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    <div>
                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaRegImage />
                          </span>
                          {!conv?.lastMsg?.text && <span>Gambar</span>}
                        </div>
                      )}

                      {conv?.lastMsg?.videoUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaVideo />
                          </span>
                          {!conv?.lastMsg?.text &&<span>Video</span>}
                        </div>
                      )}

                    </div>
                    <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                  </div>

                </div>

                {
                 Boolean (conv?.unSeenMsg) && (
                    <p className='text-xs flex justify-center items-center ml-auto p-1 bg-primary text-white font-mono font-bold rounded-full'>{conv?.unSeenMsg}</p>
                  )
                }
              </NavLink>
            );
          })}
        </div>
      </div>

      {editUserOpen && (
        <EditUserDetail onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
