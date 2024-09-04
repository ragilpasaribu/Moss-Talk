/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {useEffect, useRef, useState} from 'react';
import Avatar from './Avatar';
import uploadFile from '../helpers/UploadFile';
import Divider from './Divider';
import axios from 'axios';
import toast from 'react-hot-toast';
import {useDispatch} from 'react-redux';
import {setUser} from '../redux/UserSlice';

const EditUserDetail = ({onClose, user}) => {
  const [data, setData] = useState({
    name: user?.name || '',
    profile_pic: user?.profile_pic || '',
  });

  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    // Set data ketika komponen pertama kali di-render atau user berubah
    setData({
      name: user?.name || '',
      profile_pic: user?.profile_pic || '',
    });
  }, [user]);

  const handleOnChange = e => {
    const {name, value} = e.target;

    setData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadPhoto = async e => {
    const file = e.target.files[0];
    if (file) {
      try {
        const uploadPhoto = await uploadFile(file);
        setData(prev => ({
          ...prev,
          profile_pic: uploadPhoto?.url || '',
        }));
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Gagal mengunggah foto.');
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const URL = 'http://localhost:8080/api/update-user';
      const dataToSend = {
        name: data.name,
        profile_pic: data.profile_pic,
      };

      const response = await axios.put(URL, dataToSend, {
        withCredentials: true,
      });

      if (response?.data?.success) {
        toast.success(response?.data?.message || 'Profil berhasil diperbarui.');
        dispatch(setUser(response.data.data));
        onClose();
      } else {
        toast.error('Gagal memperbarui profil.');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Terjadi kesalahan saat memperbarui profil.');
    }
  };

  const handleOpenUploadPhoto = () => {
    uploadPhotoRef.current.click();
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-600 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-white p-4 py-6 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Detail Profil</h2>
        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Nama:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleOnChange}
              className="w-full py-1 px-2 focus:outline-primary border-0.5"
              required
            />
          </div>

          <div>
            <div>Foto:</div>
            <div className="my-1 flex items-center gap-4">
              <Avatar
                width={40}
                height={40}
                imageUrl={data?.profile_pic}
                name={data?.name}
              />
              <label htmlFor="profile_pic">
                <button
                  className="font-semibold"
                  type="button"
                  onClick={handleOpenUploadPhoto}>
                  Ubah Foto
                </button>
                <input
                  type="file"
                  id="profile_pic"
                  className="hidden"
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>

          <Divider />

          <div className="flex gap-3 w-fit ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="border-primary border px-4 py-1 text-primary rounded hover:bg-primary hover:text-white">
              Batal
            </button>
            <button
              type="submit"
              className="border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetail;
