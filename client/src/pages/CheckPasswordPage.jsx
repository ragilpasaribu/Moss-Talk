import {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import {useDispatch} from 'react-redux';
import {setToken} from '../redux/UserSlice';

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: '',
    userId: '', // tambahkan userId di sini
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/email');
    } else {
      setData(prev => ({
        ...prev,
        userId: location?.state?.id, // Set userId dari state yang dikirim dari halaman sebelumnya
      }));
    }
  }, [location, navigate]);

  const handleOnChange = e => {
    const {name, value} = e.target;

    setData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    e.stopPropagation();

    const URL = 'http://localhost:8080/api/password';

    try {
      const response = await axios({
        method: 'post',
        url: URL,
        data: {
          userId: data.userId,
          password: data.password,
        },
        withCredentials: true,
      });

      toast.success(response.data.message);
      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem('token', response?.data?.token);
        setData({
          password: '',
          userId: '', // reset userId setelah berhasil login
        });
        navigate('/');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col">
          <Avatar
            width={70}
            height={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
        </div>
        <h2 className="font-semibold flex justify-center items-center text-lg mt-1">
          {location?.state?.name}
        </h2>
        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Input Password Anda"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-4 font-bold text-white leading-relaxed tracking-wide">
            Masuk
          </button>
        </form>
        <p className="my-3 text-center">
          <Link
            to={'/forgot-password'}
            className="hover:text-primary font-semibold">
            Lupa Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
