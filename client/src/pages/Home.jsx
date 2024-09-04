/* eslint-disable no-unused-vars */
import axios from 'axios';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Outlet, useLocation} from 'react-router-dom';
import {logout, setOnlineUser, setsocketConection, setUser} from '../redux/UserSlice';
import {useNavigate} from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import talking from '../assets/talking.png';
import io from 'socket.io-client';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.user);

  console.log('user',user)

  const fetchUserDetail = async () => {
    try {
      const URL = 'http://localhost:8080/api/user-detail';
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate('/email');
      }
      console.log('Detail User Sekarang', response);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, []);

  useEffect(() => {
    const socketConection = io('http://localhost:8080', {
      auth: {
        token: localStorage.getItem('token'),
      },
    });
  
    socketConection.on('onlineUser', (data) => {
      console.log('Pengguna Online:', data);
      dispatch(setOnlineUser(data));
    });
  
    dispatch(setsocketConection(socketConection));
  
    // Cleanup ketika komponen unmount
    return () => {
      socketConection.disconnect();
    };
  }, []);
  

  const basePath = location.pathname === '/'
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar/>
      </section>

      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div className={` justify-center items-center flex-col gap-4 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
        <div>
          <img src={talking} width={200} alt='Moss-Talk'/>
        </div>
        <p className='text-lg mt-4 text-slate-700 font-mono font-semibold'>Pilih Teman Kamu Buat Dikirimi Pesan</p>
      </div>

    </div>
  );
};

export default Home;
